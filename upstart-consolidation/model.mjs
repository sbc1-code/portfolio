export const DEFAULTS = Object.freeze({
  need: '10000',
  a: Object.freeze({ principal: '10000', fee: '815', monthly: '335', count: '36' }),
  b: Object.freeze({ principal: '10000', fee: '500', monthly: '245', count: '60' }),
});

export function moneyInput(raw, { zero = false } = {}) {
  if (raw === '' || raw === null || raw === undefined) return { error: 'Enter an amount to complete the comparison.', missing: true };
  const value = String(raw).trim();
  if (!/^\d+(?:\.\d{1,2})?$/.test(value)) return { error: 'Enter a positive amount with no more than two decimal places.' };
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount > 1000000 || amount < (zero ? 0 : 0.01)) return { error: zero ? 'Enter an amount from $0 to $1,000,000.' : 'Enter an amount from $0.01 to $1,000,000.' };
  return { cents: Math.round(amount * 100) };
}

export function evaluateScenario(raw, needRaw) {
  const errors = {};
  const amounts = {};
  let missing = false;
  for (const field of ['principal', 'fee', 'monthly']) {
    const parsed = moneyInput(raw[field], { zero: field === 'fee' });
    if (parsed.error) { errors[field] = parsed.error; missing ||= !!parsed.missing; }
    else amounts[field] = parsed.cents;
  }
  const countRaw = raw.count === undefined || raw.count === null ? '' : String(raw.count).trim();
  if (countRaw === '') { errors.count = 'Enter the number of monthly payments.'; missing = true; }
  else if (!/^\d+$/.test(countRaw) || Number(countRaw) < 1 || Number(countRaw) > 600) errors.count = 'Enter a whole number from 1 to 600.';
  const count = Number(countRaw);
  if (!errors.principal && !errors.fee && amounts.fee >= amounts.principal) errors.fee = 'The deducted fee must be less than the amount borrowed.';
  if (!errors.principal && !errors.monthly && !errors.count && amounts.monthly * count < amounts.principal) errors.monthly = 'These scheduled payments total less than the amount borrowed. Check the payment terms.';
  const need = moneyInput(needRaw);
  if (Object.keys(errors).length) return { valid: false, state: missing ? 'incomplete' : 'invalid', errors, needError: need.error };
  const net = amounts.principal - amounts.fee;
  const total = amounts.monthly * count;
  return { valid: true, state: need.error ? 'need-incomplete' : 'complete', errors, needError: need.error, ...amounts, count, net, total, cost: total - net, gap: need.error ? null : need.cents - net, need: need.cents };
}

export const currency = cents => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
