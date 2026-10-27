import { DEFAULTS, evaluateScenario, moneyInput, currency } from './model.mjs';

const $ = selector => document.querySelector(selector);
const all = selector => [...document.querySelectorAll(selector)];
const query = new URLSearchParams(window.location.search);
const variant = query.get('variant') === 'b' ? 'b' : 'a';
const events = [];
let announcementTimer;
let inputEventTimer;
let lastResults;
let fitFrame;

// Preserve exact cents while fitting long amounts in narrow comparison columns.
function fitFigures() {
  cancelAnimationFrame(fitFrame);
  fitFrame = requestAnimationFrame(() => {
    const table = $('.comparison-table');
    const figures = all('[data-numeric]');
    table.style.minWidth = '';
    figures.forEach(element => { element.style.fontSize = ''; });
    let requiredWidth = table.clientWidth;
    figures.forEach(element => {
      const cell = element.closest('td');
      const style = getComputedStyle(cell);
      const padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
      const range = document.createRange();
      range.selectNodeContents(element);
      const textWidth = range.getBoundingClientRect().width;
      const size = parseFloat(getComputedStyle(element).fontSize);
      // Expand the table instead of making exact monetary amounts unreadably small.
      const requiredCell = textWidth * Math.min(1, 14 / size) + padding + 3;
      requiredWidth = Math.max(requiredWidth, requiredCell / (cell.clientWidth / table.clientWidth));
    });
    if (requiredWidth > table.clientWidth + 1) table.style.minWidth = `${Math.ceil(requiredWidth)}px`;
    $('#comparison-scroll-hint').hidden = table.clientWidth <= $('.table-scroll').clientWidth + 2;
    figures.forEach(element => {
      element.style.fontSize = '';
      const cell = element.closest('td');
      const style = getComputedStyle(cell);
      const available = cell.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      const range = document.createRange();
      range.selectNodeContents(element);
      const textWidth = range.getBoundingClientRect().width;
      if (textWidth > available) {
        const size = parseFloat(getComputedStyle(element).fontSize);
        element.style.fontSize = `${Math.max(14, Math.floor(size * available / textWidth * 10) / 10 - 0.2)}px`;
      }
    });
  });
}

function logEvent(name, detail = '') {
  events.push({ name, detail, time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) });
  if (events.length > 40) events.shift();
  $('#event-count').textContent = `${events.length} local event${events.length === 1 ? '' : 's'}`;
  const log = $('#event-log');
  log.replaceChildren();
  [...events].reverse().forEach(event => {
    const li = document.createElement('li');
    const nameElement = document.createElement('span');
    nameElement.textContent = event.name + (event.detail ? ` · ${event.detail}` : '');
    const time = document.createElement('time');
    time.textContent = event.time;
    li.append(nameElement, time);
    log.append(li);
  });
}

function setError(id, message) {
  const input = $(`#${id}`);
  const error = $(`#${id}-error`);
  input.setAttribute('aria-invalid', String(!!message));
  error.hidden = !message;
  error.textContent = message || '';
}

function rawScenario(id) {
  return Object.fromEntries(all(`[data-example="${id}"]`).map(input => [input.dataset.field, input.value]));
}

function displayScenario(id, result) {
  const values = {};
  for (const field of ['principal', 'fee', 'monthly', 'count']) setError(`${id}-${field}`, result.errors[field]);
  if (!result.valid) {
    for (const key of ['principal', 'fee', 'net', 'monthly', 'count', 'total', 'cost']) values[key] = '—';
    values.termLabel = result.state === 'incomplete' ? 'Example incomplete' : 'Check example details';
    values.balance = result.state === 'incomplete' ? 'Complete this example' : 'Check this example';
    values.balanceNote = 'Open Edit to review the highlighted fields.';
  } else {
    for (const key of ['principal', 'net', 'monthly', 'total', 'cost']) values[key] = currency(result[key]);
    values.fee = `− ${currency(result.fee)}`;
    values.count = String(result.count);
    values.termLabel = `${result.count} monthly payment${result.count === 1 ? '' : 's'}`;
    if (result.needError) { values.balance = 'Enter your payoff amount'; values.balanceNote = 'Available cash can still be compared above.'; }
    else if (result.gap > 0) { values.balance = `${currency(result.gap)} left unpaid`; values.balanceNote = 'The example does not cover the full balance.'; }
    else if (result.gap < 0) { values.balance = `${currency(-result.gap)} beyond the balance`; values.balanceNote = 'Available cash exceeds the entered payoff amount.'; }
    else { values.balance = 'Covers the entered balance'; values.balanceNote = 'The available cash matches the payoff amount.'; }
  }
  all(`[data-output^="${id}."]`).forEach(element => {
    const key = element.dataset.output.split('.')[1];
    element.textContent = values[key];
    if (['principal', 'fee', 'net', 'monthly', 'total', 'cost'].includes(key)) element.setAttribute('data-numeric', '');
  });
  const track = $(`#${id}-coverage`);
  track.style.width = result.valid && !result.needError ? `${Math.min(100, result.net / result.need * 100)}%` : '0%';
  track.parentElement.classList.toggle('is-incomplete', !result.valid || !!result.needError);
}

function takeaway(a, b) {
  if (!a.valid || !b.valid) return 'Complete both examples to compare their monthly payments and full repayment costs.';
  const monthlyDifference = b.monthly - a.monthly;
  const countDifference = b.count - a.count;
  const totalDifference = b.total - a.total;
  if (!monthlyDifference && !countDifference && !totalDifference) return 'Both examples have the same scheduled payments. Compare the money available after fees to see whether either covers your entered balance.';
  const monthly = monthlyDifference === 0 ? 'has the same monthly payment' : `is ${currency(Math.abs(monthlyDifference))} ${monthlyDifference < 0 ? 'less' : 'more'} per month`;
  const term = countDifference === 0 ? 'the same number of payments' : `${Math.abs(countDifference)} ${countDifference < 0 ? 'fewer' : 'more'} payments`;
  const total = totalDifference === 0 ? 'the same total scheduled payments' : `${currency(Math.abs(totalDifference))} ${totalDifference < 0 ? 'less' : 'more'} in total scheduled payments`;
  return `Example B ${monthly}, with ${term} and ${total}.`;
}

function render(announce = false) {
  const need = $('#need').value;
  setError('need', moneyInput(need).error);
  const results = { a: evaluateScenario(rawScenario('a'), need), b: evaluateScenario(rawScenario('b'), need) };
  lastResults = results;
  displayScenario('a', results.a);
  displayScenario('b', results.b);
  $('#takeaway-text').textContent = takeaway(results.a, results.b);
  $('#print').disabled = !results.a.valid || !results.b.valid || !!results.a.needError;
  fitFigures();
  if (announce) {
    clearTimeout(announcementTimer);
    announcementTimer = setTimeout(() => {
      $('#live-status').textContent = !results.a.valid || !results.b.valid || results.a.needError ? 'Comparison incomplete. Review the highlighted fields.' : `Comparison updated. Example A: ${currency(results.a.net)} available. Example B: ${currency(results.b.net)} available. ${takeaway(results.a, results.b)}`;
    }, 650);
  }
}

if (variant === 'b') {
  const rows = $('#comparison-rows');
  ['monthly', 'count', 'total', 'principal', 'fee', 'net', 'balance', 'cost'].forEach(key => rows.append($(`[data-row="${key}"]`)));
}
$(`#variant-${variant}`).setAttribute('aria-current', 'page');

all('input').forEach(input => input.addEventListener('input', () => {
  render(true);
  clearTimeout(inputEventTimer);
  inputEventTimer = setTimeout(() => logEvent('comparison_updated', input.id === 'need' ? 'payoff amount edited' : 'example terms edited'), 500);
}));

all('[data-edit]').forEach(button => button.addEventListener('click', () => {
  const editor = $('#example-editor');
  editor.open = true;
  const input = $(`#${button.dataset.edit}-principal`);
  input.focus({ preventScroll: true });
  editor.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
  logEvent('example_editor_opened', `example ${button.dataset.edit.toUpperCase()}`);
}));

$('#reset').addEventListener('click', () => {
  $('#need').value = DEFAULTS.need;
  for (const id of ['a', 'b']) for (const key of Object.keys(DEFAULTS[id])) $(`#${id}-${key}`).value = DEFAULTS[id][key];
  render(true);
  logEvent('examples_reset');
});

$('#print').addEventListener('click', () => {
  if (!lastResults.a.valid || !lastResults.b.valid || lastResults.a.needError) return;
  logEvent('print_requested');
  window.print();
});

$('#clear-events').addEventListener('click', () => {
  events.length = 0;
  $('#event-log').replaceChildren();
  $('#event-count').textContent = '0 local events';
});
$('#reviewer-details').addEventListener('toggle', event => { if (event.target.open) logEvent('reviewer_notes_opened'); });

render();
logEvent('comparison_viewed', `variant ${variant.toUpperCase()}`);
let tableWidth = 0;
new ResizeObserver(entries => {
  const width = entries[0].contentRect.width;
  if (width !== tableWidth) { tableWidth = width; fitFigures(); }
}).observe($('.table-scroll'));
document.fonts.ready.then(fitFigures);
