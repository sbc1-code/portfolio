(function (root) {
  'use strict';
  const fields = ['hypothesis','segment','priority','resource','resourceReason','action','questions','reviewer','reviewNote'];
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const https = value => {try {return new URL(value).protocol === 'https:';} catch {return false;}};
  const fresh = data => ({version:data.version,values:{...data.initial},ack:false,approval:null,history:[]});
  function validate(data,state) {
    const errors=[];
    if(data.exportBlocked) errors.push(data.blockReason);
    if (!data.sources.length || data.sources.some(s => !s.id || !s.publisher || !s.title || !https(s.url) || !/^\d{4}-\d{2}-\d{2}$/.test(s.checked) || !s.facts?.length || s.facts.some(f=>!f.id||!f.text?.trim()))) errors.push('Indispensable source evidence is missing.');
    for (const field of fields.filter(f => f !== 'reviewNote')) if (!state.values[field]?.trim()) errors.push('Complete '+field.replace(/([A-Z])/g,' $1').toLowerCase()+'.');
    if (!data.sources.some(s=>s.url===state.values.resource && s.publisher==='Fictiv')) errors.push('Choose a verified Fictiv resource.');
    if (!['Research next','Hold for evidence','Do not pursue'].includes(state.values.priority)) errors.push('Choose a valid research priority.');
    if (!state.ack) errors.push('Confirm your source and inference review.');
    return errors;
  }
  function edit(state,key,value,session,now=new Date().toISOString()) {
    if (!fields.includes(key) || state.values[key] === value) return state;
    const next=structuredClone(state), before=next.values[key];
    if (next.approval) next.history.push({type:'approval_invalidated',at:now,reason:'Proposal or reviewer field edited.'});
    next.approval=null;next.ack=false;next.values[key]=value;
    const last=next.history.at(-1);
    if(last?.type==='edit' && last.field===key && last.session===session){last.after=value;last.at=now;}
    else next.history.push({type:'edit',at:now,field:key,before,after:value,session});
    return next;
  }
  function approve(data,state,now=new Date().toISOString()) {
    const errors=validate(data,state);if(errors.length) throw new Error(errors.join(' '));
    const next=structuredClone(state);
    next.approval={at:now,reviewer:state.values.reviewer,scope:'Local demonstration: approved for internal research export only',snapshot:JSON.stringify(state.values)};
    next.history.push({type:'approval',at:now,reviewer:state.values.reviewer});return next;
  }
  const approved=(data,state)=>!!state.approval && !validate(data,state).length && state.approval.snapshot===JSON.stringify(state.values);
  function restore(data,raw) {
    if(!raw) return fresh(data);
    try {
      const saved=JSON.parse(raw);
      if(saved.version!==data.version || !saved.values || fields.some(f=>typeof saved.values[f]!=='string') || !Array.isArray(saved.history)) return fresh(data);
      const state={version:data.version,values:Object.fromEntries(fields.map(f=>[f,saved.values[f]])),ack:saved.ack===true,approval:saved.approval||null,history:saved.history};
      if(!approved(data,state)) state.approval=null;
      return state;
    } catch {return fresh(data);}
  }
  function record(data,state) {
    return {
      record_id:data.id,dataset_version:data.version,company:data.company,industry:data.industry,geography:data.geography,
      signal_classification:data.classification,classification_reason:data.rationale,
      facts:data.sources.flatMap(s=>s.facts.map(f=>`${f.id} [${s.id}] ${f.text}`)).join('\n'),
      sources:data.sources.map(s=>`${s.id} | ${s.publisher} | published ${s.published||'not stated'} | checked ${s.checked} | ${s.url}`).join('\n'),
      ...state.values,proposal_type:'Hypotheses for internal research; buying intent not established',
      review_status:data.exportBlocked?data.classification+' — not approved for campaign export':approved(data,state)?'Approved for internal research export':'Pending human review — preview only',
      campaign_eligibility:data.exportBlocked?'Blocked: '+data.blockReason:'Research record only; procurement qualification and channel permission remain unverified',
      reviewer_label:state.approval?.reviewer||'',approved_at:state.approval?.at||'',
      approval_scope:state.approval?.scope||'No approval',
      ai_run_id:data.provenance.runId,ai_prepared:data.provenance.prepared,ai_executor:data.provenance.executor,
      original_ai_output:JSON.stringify(data.initial),review_history:JSON.stringify(state.history)
    };
  }
  function csvCell(value){let s=String(value??'');if(/^[\s\uFEFF]*[=+@-]/u.test(s) || /^[\t\r\n]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';}
  function csv(data,state){if(!approved(data,state))throw new Error('Review and approve this version before exporting.');const r=record(data,state);return '\uFEFF'+Object.keys(r).map(csvCell).join(',')+'\r\n'+Object.values(r).map(csvCell).join(',')+'\r\n';}
  function brief(data,state,{preview=false}={}){
    if(!preview&&!approved(data,state))throw new Error('Review and approve this version before exporting.');
    const r=record(data,state);
    const section=(label,text)=>`<section><h2>${esc(label)}</h2><p>${esc(text)}</p></section>`;
    return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><link rel="icon" href="data:,"><title>${esc(data.company)} — research brief</title><style>body{font:14px/1.55 Arial,sans-serif;color:#1d2939;max-width:850px;margin:35px auto;padding:0 24px}h1{font-size:30px;margin:5px 0 10px}h2{font-size:15px;color:#007e6b;margin:20px 0 5px}p{margin:0 0 12px;white-space:pre-wrap;overflow-wrap:anywhere}.meta{font-size:11px;color:#536471}.status{padding:12px;background:#edf8f5;border-left:3px solid #007e6b}a{color:#006b5b;overflow-wrap:anywhere}li{margin-bottom:8px}section{break-inside:avoid}.appendix{break-inside:auto}h2,h3{break-after:avoid}pre{white-space:pre-wrap;font:10px/1.5 monospace;overflow-wrap:anywhere}button{padding:10px 18px;background:#007e6b;color:white;border:0;cursor:pointer}footer{border-top:1px solid #ccd8d5;padding-top:15px;margin-top:25px;font-size:11px}@media print{body{margin:0;padding:0;font-size:11px}h1{font-size:24px}h2{font-size:13px}button{display:none}a{color:#1d2939}.status{background:none}@page{size:A4;margin:16mm}}</style></head><body><button onclick="window.print()">Print / Save as PDF</button><p class="meta">INDEPENDENT WORK SAMPLE · PREPARED FOR FICTIV · ${esc(data.version)}</p><h1>${esc(data.company)}</h1><p>${esc(data.industry)} · ${esc(data.geography)}</p><p class="status">${esc(r.review_status)}<br><span class="meta">${esc(r.approval_scope)}${r.approved_at?' · '+esc(r.approved_at):''}${r.reviewer_label?' · Reviewer label: '+esc(r.reviewer_label):''}</span></p>${section('Research disposition',data.classification+' · '+state.values.priority+'\n'+data.rationale)}<section><h2>Reported facts & sources</h2>${data.sources.map(s=>`<h3>${esc(s.id)} · ${esc(s.publisher)}</h3><ul>${s.facts.map(f=>`<li>${esc(f.id)} · ${esc(f.text)}</li>`).join('')}</ul><p class="meta">Published: ${esc(s.published||'not stated')} · Checked: ${esc(s.checked)}<br><a href="${esc(https(s.url)?s.url:'#')}">${esc(s.url)}</a></p>`).join('')}</section>${section('Commercial hypothesis — inferred',state.values.hypothesis)}${section('Proposed segment',state.values.segment)}${section('Resource relevance & fit limits',state.values.resourceReason)}<p><a href="${esc(https(state.values.resource)?state.values.resource:'#')}">${esc(state.values.resource)}</a></p>${section('Suggested next action — not executed',state.values.action)}${section('Unresolved questions',state.values.questions)}${section('Local reviewer note',state.values.reviewNote||'No reviewer note recorded.')}<section class="appendix"><h2>AI provenance</h2><p class="meta">${esc(data.provenance.runId)} · ${esc(data.provenance.prepared)}</p><p>${esc(data.provenance.method)}</p><h2>Input instruction</h2><p>${esc(data.provenance.instruction)}</p><h2>Original saved AI output</h2><pre>${esc(JSON.stringify(data.initial,null,2))}</pre><h2>Assistant source check</h2><p>${esc(data.provenance.assistantCheck)}</p><h2>Local corrections & review actions</h2><pre>${esc(JSON.stringify(state.history,null,2))}</pre></section><footer>Prepared by Sebastian Becerra with AI assistance. This is a research demonstration, not a Fictiv system, verified buying intent, outreach authorization or a commercial result. Local reviewer labels are self-entered; identity is not verified. Sources may change after the recorded check.</footer></body></html>`;
  }
  const api={fields,esc,https,fresh,validate,edit,approve,approved,restore,record,csvCell,csv,brief};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ReviewCore=api;
})(typeof window==='undefined'?globalThis:window);
