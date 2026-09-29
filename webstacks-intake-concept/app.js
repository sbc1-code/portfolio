const plans = {
  journey: {
    title: 'Clarify the path from question to action.',
    summary: 'Map the jobs visitors came to do, then make the next useful step visible in navigation, page structure, and calls to action. Validate the path before expanding the redesign scope.',
    url: 'https://www.webstacks.com/solutions/website-redesigns',
    task: 'Help a buyer find the right product answer, proof, and next step without guessing where to click.',
    move: 'Sketch one high-intent journey and test a revised page hierarchy with a small group of users.',
    measure: 'Track entry-page to proof-page progression and qualified next-step actions; compare with the current path.',
    evidence: ['Top entry pages and their intended audiences', 'Current navigation and one representative user journey', 'Baseline next-step actions by page'],
    questions: {
      marketing: 'Which visitor questions most often go unanswered before someone asks for a demo?',
      product: 'Where does the site describe capabilities differently from the product experience?',
      executive: 'Which buying journey matters most to the next quarter’s business goal?'
    }
  },
  velocity: {
    title: 'Make repeatable launches a product capability.',
    summary: 'Separate reusable page patterns from truly custom work. Give the team a smaller, safer publishing path so campaigns can launch without eroding quality or consistency.',
    url: 'https://www.webstacks.com/solutions/website-product-teams',
    task: 'Let the site team publish a credible new page without reopening design and engineering decisions each time.',
    move: 'Inventory recent launches, choose one repeatable page type, and prototype its content and QA rules.',
    measure: 'Record time from approved brief to live page, rework rounds, and post-launch QA issues.',
    evidence: ['Three recent page briefs and launch timelines', 'Existing components and CMS authoring constraints', 'Approval steps and common rework reasons'],
    questions: {
      marketing: 'Which page type do you rebuild most often, and what slows it down?',
      product: 'Which component or CMS constraint forces a developer into routine launches?',
      executive: 'What launch delay is most costly to the business right now?'
    }
  },
  migration: {
    title: 'Plan the move around what cannot break.',
    summary: 'Treat content, search visibility, authoring, and measurement as one migration system. Start with a small page set and a clear release gate before committing to a full move.',
    url: 'https://www.webstacks.com/solutions/website-migrations',
    task: 'Keep important content findable and usable while the team changes the platform beneath it.',
    move: 'Map a representative URL and content set, then define redirects, page QA, and rollback ownership.',
    measure: 'Compare indexed priority pages, key events, broken links, and authoring time before and after launch.',
    evidence: ['Priority URL inventory and traffic sources', 'Content model and required integrations', 'Current publishing and analytics setup'],
    questions: {
      marketing: 'Which content and campaign paths must work on day one?',
      product: 'Which integrations and content models create the greatest release risk?',
      executive: 'Which migration failure would have the largest business impact?'
    }
  },
  measurement: {
    title: 'Connect website changes to useful signals.',
    summary: 'Define a short list of visitor actions that reflect progress, check whether they are captured reliably, and use those signals to choose the next change.',
    url: 'https://www.webstacks.com/capabilities/technical-seo',
    task: 'Show which page and journey changes help visitors get closer to a meaningful decision.',
    move: 'Audit one critical journey’s events, URLs, and search entry points; repair gaps before judging performance.',
    measure: 'Create a baseline for agreed journey events, organic entry quality, and qualified actions.',
    evidence: ['Current GA4 event list and definitions', 'Search Console queries and landing pages', 'One recent launch with its intended outcome'],
    questions: {
      marketing: 'Which campaign or content decision lacks a trustworthy signal?',
      product: 'What user action matters, but is invisible in current instrumentation?',
      executive: 'What evidence would make the next web investment easier to decide?'
    }
  }
};

let selected = 'journey';
const audience = document.getElementById('audience');
const buttons = [...document.querySelectorAll('[data-issue]')];
function render() {
  const plan = plans[selected];
  document.getElementById('result-heading').textContent = plan.title;
  document.getElementById('result-summary').textContent = plan.summary;
  document.getElementById('result-link').href = plan.url;
  document.getElementById('result-question').textContent = plan.questions[audience.value];
  document.getElementById('result-task').textContent = plan.task;
  document.getElementById('result-move').textContent = plan.move;
  document.getElementById('result-measure').textContent = plan.measure;
  document.getElementById('result-evidence').replaceChildren(...plan.evidence.map(item => {
    const li = document.createElement('li');
    li.textContent = item;
    return li;
  }));
  for (const button of buttons) {
    const active = button.dataset.issue === selected;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  }
}
for (const button of buttons) button.addEventListener('click', () => { selected = button.dataset.issue; render(); });
audience.addEventListener('change', render);
render();
