const requests = [
  {id:'REQ-01',title:'Clarify referral status',source:'customer',evidence:5,state:'maturing',reality:'Coordinators need one reliable state before taking the next action.',gap:'Status labels exist, but the event and next-action rules are not yet explicit.',change:'Define four verified states with timestamps and an exception path.'},
  {id:'REQ-02',title:'Show incomplete intake fields',source:'customer',evidence:4,state:'ready',reality:'Users discover missing fields only after trying to advance the workflow.',gap:'Frequency is known; the highest-friction fields still need validation.',change:'Inline the three most common missing-field prompts.'},
  {id:'REQ-03',title:'Standardize release notes',source:'internal',evidence:6,state:'ready',reality:'Enablement teams translate inconsistent release summaries by hand.',gap:'No gap; examples and downstream consumers are documented.',change:'Use one tiered release-note template with owner and due date.'},
  {id:'REQ-04',title:'Reduce duplicate request entry',source:'customer',evidence:3,state:'new',reality:'Similar requests enter through more than one channel.',gap:'Identity and matching rules are not defined.',change:'Add a lightweight related-request suggestion at intake.'},
  {id:'REQ-05',title:'Name analytics events consistently',source:'internal',evidence:7,state:'ready',reality:'Teams cannot compare adoption across releases when events use different names.',gap:'No gap; current variants are inventoried.',change:'Publish one event schema and validation checklist.'},
  {id:'REQ-06',title:'Expose rollout ownership',source:'internal',evidence:4,state:'maturing',reality:'Cross-functional tasks stall when a workflow change has no accountable owner.',gap:'RACI is incomplete for two rollout stages.',change:'Require an owner and approver before a change enters release.'},
  {id:'REQ-07',title:'Add saved workflow filters',source:'customer',evidence:2,state:'new',reality:'Frequent users repeat the same filtering steps.',gap:'Usage frequency and segment value are not quantified.',change:'Prototype one saved-filter pattern with five users.'},
  {id:'REQ-08',title:'Create release exception log',source:'internal',evidence:4,state:'maturing',reality:'Repeated launch issues are discussed but not captured in one place.',gap:'Severity and closure definitions need agreement.',change:'Create a compact exception log tied to retrospectives.'},
  {id:'REQ-09',title:'Confirm change adoption',source:'internal',evidence:2,state:'new',reality:'Process launches are marked complete before teams demonstrate adoption.',gap:'No baseline or adoption threshold exists.',change:'Add a two-week pulse with usage and feedback checks.'}
];

const gates = [
  ['1','Intake','Signal, user, and outcome captured','done'],
  ['2','Define','Acceptance and guardrail agreed','done'],
  ['3','Plan','Owner, dependencies, and events set','active'],
  ['4','Verify','QA plus enablement evidence',''],
  ['5','Release','Rollout and learning review','']
];

let selected = requests[0];
const stateLabel = state => state === 'ready' ? 'Ready' : state === 'maturing' ? 'Maturing' : 'New';

function renderRows(filter='all'){
  const rows = requests.filter(r => filter === 'all' || r.source === filter).map(r => `
    <tr><td><strong>${r.title}</strong><br><small>${r.id}</small></td><td>${r.source === 'customer' ? 'Customer' : 'Internal'}</td><td>${r.evidence} signals</td><td><span class="tag ${r.state}">${stateLabel(r.state)}</span></td><td><button class="inspect" data-id="${r.id}">Inspect</button></td></tr>`).join('');
  document.querySelector('#requestRows').innerHTML = rows;
  document.querySelectorAll('.inspect').forEach(button => button.addEventListener('click', () => selectRequest(button.dataset.id)));
}

function selectRequest(id){
  selected = requests.find(r => r.id === id);
  document.querySelector('#requestId').textContent = selected.id;
  document.querySelector('#requestTitle').textContent = selected.title;
  document.querySelector('#requestReality').textContent = selected.reality;
  document.querySelector('#requestGap').textContent = selected.gap;
  document.querySelector('#requestChange').textContent = selected.change;
  document.querySelector('#requirementCard').classList.remove('visible');
  document.querySelector('#matureButton').disabled = selected.id !== 'REQ-01';
  document.querySelector('#matureNote').textContent = selected.id === 'REQ-01' ? 'Adds a problem statement, acceptance criteria, owner, and measurement plan.' : 'The full maturation demo is attached to REQ-01.';
}

document.querySelectorAll('.tab').forEach(tab => tab.addEventListener('click', () => {
  document.querySelectorAll('.tab,.view').forEach(el => el.classList.remove('active'));
  tab.classList.add('active');
  document.querySelector(`#${tab.dataset.view}`).classList.add('active');
}));

document.querySelector('#signalFilter').addEventListener('change', event => renderRows(event.target.value));
document.querySelector('#matureButton').addEventListener('click', () => {
  document.querySelector('#requirementCard').classList.add('visible');
  document.querySelector('#matureButton').textContent = 'Requirement matured';
  document.querySelector('#matureButton').disabled = true;
  document.querySelector('#readyCount').textContent = '4';
});

document.querySelector('#gateGrid').innerHTML = gates.map(g => `<article class="gate ${g[3]}"><span>${g[0]}</span><h3>${g[1]}</h3><p>${g[2]}</p></article>`).join('');
document.querySelector('#runRollout').addEventListener('click', () => {
  const button = document.querySelector('#runRollout');
  button.disabled = true; button.textContent = 'Running…';
  setTimeout(() => {
    document.querySelector('#taskSuccess').textContent = '90%';
    document.querySelector('#repeatChecks').textContent = '17%';
    document.querySelector('#exceptionRate').textContent = '4.4%';
    document.querySelector('#decisionTitle').textContent = 'Scale with monitoring';
    document.querySelector('#decisionCopy').textContent = 'The synthetic cohort cleared the success target and held the exception guardrail. Expand one cohort while monitoring state conflicts and repeat checks.';
    button.disabled = false; button.textContent = 'Run again';
  }, 850);
});

renderRows();
selectRequest('REQ-01');
