const signals = [
  {id:'SIG-01',title:'Payment marked “sent,” vendor has not received it',source:'Support',cluster:'status',severity:'high',reality:'The customer needs a precise transaction state before contacting a vendor.',failure:'The current language collapses scheduled, processing, and completed into an ambiguous status.',fix:'Show the verified state, latest event time, and exception route.',metric:'Repeat contacts per payment-status case.'},
  {id:'SIG-02',title:'Owner asks whether a scheduled bill actually cleared',source:'Onboarding',cluster:'status',severity:'high',reality:'The customer is learning the product and cannot map interface language to bank movement.',failure:'A status label appears authoritative without exposing the underlying event.',fix:'Add plain-language status definitions and a source-of-truth timestamp.',metric:'Status comprehension on first attempt.'},
  {id:'SIG-03',title:'Support checks two systems before answering status',source:'Internal',cluster:'status',severity:'high',reality:'A routine question consumes human time because evidence is split across views.',failure:'The operating workflow has no single verified status surface.',fix:'Use one event-backed response component for both customer and operator.',metric:'Median handling time for status questions.'},
  {id:'SIG-04',title:'Customer follows up twice after a processing delay',source:'Support',cluster:'status',severity:'medium',reality:'The customer has no bounded expectation for when a state should change.',failure:'No estimated review window or proactive exception message exists.',fix:'Add a bounded expectation and trigger review when the window is exceeded.',metric:'Repeat-contact rate within 48 hours.'},
  {id:'SIG-05',title:'Failed payment is mistaken for a pending payment',source:'Support',cluster:'status',severity:'high',reality:'The customer needs a clear recovery action, not another generic status.',failure:'Failure and delay states look too similar.',fix:'Separate failed state, reason category, and recovery action.',metric:'Time from failure to successful retry.'},
  {id:'SIG-06',title:'Feed expense categorized with low confidence',source:'Review queue',cluster:'category',severity:'medium',reality:'The operator wants automation but needs to know when judgment is required.',failure:'The suggested category does not expose confidence or comparable evidence.',fix:'Show confidence band and route uncertain items to a focused review queue.',metric:'Accepted suggestions without later recategorization.'},
  {id:'SIG-07',title:'Recurring supplier changes category after one correction',source:'Support',cluster:'category',severity:'medium',reality:'The customer expects a correction to persist for similar future expenses.',failure:'The feedback loop is not visible and may not generalize safely.',fix:'Confirm whether the correction creates a reusable rule and show its scope.',metric:'Repeat corrections for the same supplier.'},
  {id:'SIG-08',title:'Mixed-use purchase requires a manual split',source:'Onboarding',cluster:'category',severity:'low',reality:'The customer has a legitimate exception that should remain human-reviewed.',failure:'Automation treats a nuanced split like a routine categorization.',fix:'Detect mixed-use cues and open a structured split workflow.',metric:'Review completion time and error rate.'},
  {id:'SIG-09',title:'Receipt and bank feed both create records',source:'Support',cluster:'duplicate',severity:'medium',reality:'The customer wants the receipt attached to the transaction, not a second expense.',failure:'The system has not linked two likely representations of the same purchase.',fix:'Present a likely-match suggestion before creating another record.',metric:'Duplicate records created per 100 uploads.'},
  {id:'SIG-10',title:'Mobile upload repeated after slow confirmation',source:'Support',cluster:'duplicate',severity:'low',reality:'The customer retries because the first upload gives weak feedback.',failure:'Processing feedback does not establish that the first upload was received.',fix:'Show immediate receipt confirmation and suppress identical retries.',metric:'Repeated uploads within five minutes.'},
  {id:'SIG-11',title:'Forwarded invoice already exists in workspace',source:'Internal',cluster:'duplicate',severity:'medium',reality:'The team needs a safe match before another payable enters review.',failure:'Email ingestion lacks a visible duplicate fingerprint.',fix:'Compare vendor, amount, date, and file hash before record creation.',metric:'Operator minutes spent merging duplicates.'},
  {id:'SIG-12',title:'Customer cannot find why two items were linked',source:'Onboarding',cluster:'duplicate',severity:'low',reality:'The customer needs trust in an automated match and a simple undo path.',failure:'The match is correct but its evidence is hidden.',fix:'Expose match rationale and a reversible unlink action.',metric:'Unlink rate and support contacts after matching.'}
];

const labels={status:'Payment status',category:'Category confidence',duplicate:'Duplicate capture'};
const rows=document.querySelector('#signalRows');
function renderSignals(filter='all'){
  rows.innerHTML=signals.filter(s=>filter==='all'||s.cluster===filter).map(s=>`<tr><td>${s.title}<small>${s.id}</small></td><td>${s.source}</td><td><span class="cluster">${labels[s.cluster]}</span></td><td><span class="severity ${s.severity}">${s.severity}</span></td><td><button class="inspect" data-id="${s.id}">Inspect</button></td></tr>`).join('');
  document.querySelectorAll('.inspect').forEach(button=>button.addEventListener('click',()=>inspectSignal(button.dataset.id)));
}
function inspectSignal(id){
  const s=signals.find(item=>item.id===id);
  document.querySelector('#signalId').textContent=s.id+' · '+labels[s.cluster];
  document.querySelector('#signalTitle').textContent=s.title;
  document.querySelector('#signalReality').textContent=s.reality;
  document.querySelector('#signalFailure').textContent=s.failure;
  document.querySelector('#signalFix').textContent=s.fix;
  document.querySelector('#signalMetric').textContent=s.metric;
}
document.querySelector('#clusterFilter').addEventListener('change',event=>renderSignals(event.target.value));
document.querySelectorAll('.tab').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('.tab,.view').forEach(element=>element.classList.remove('active'));
  button.classList.add('active');
  document.querySelector('#'+button.dataset.view).classList.add('active');
}));

const runButton=document.querySelector('#runPrototype');
runButton.addEventListener('click',async()=>{
  runButton.disabled=true;
  const state=document.querySelector('#runState');
  state.className='run-state running'; state.textContent='Running';
  document.querySelectorAll('#flow article').forEach(item=>item.classList.remove('active'));
  for(const step of [1,2,3,4]){
    document.querySelector(`#flow article[data-step="${step}"]`).classList.add('active');
    await new Promise(resolve=>setTimeout(resolve,360));
  }
  document.querySelector('#evidenceText').textContent='Latest event: processing · initiated 09:42 UTC · no settlement event present.';
  document.querySelector('#responseText').textContent='The payment is still processing. I cannot confirm completion yet.';
  document.querySelector('#actionText').textContent='Monitor until the review window; route to a human if evidence conflicts or the window expires.';
  state.className='run-state done'; state.textContent='Safe response · no unsupported claim';
  runButton.disabled=false;
});

renderSignals();
inspectSignal('SIG-01');
