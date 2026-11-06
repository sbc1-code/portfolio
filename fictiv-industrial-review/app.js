(() => {
 'use strict';
 const dataset=window.CAMPAIGN_DATA,c=window.ReviewCore,$=id=>document.getElementById(id),prefix='sb-fictiv-review-v1:';
 let d=dataset.accounts[0],state=c.fresh(d),storageOK=true,editSession=0;
 const memory=new Map();
 const tone=a=>a.classification==='Relevant signal'?'relevant':a.classification==='Excluded'?'excluded':'hold';
 const say=m=>{$('notice').textContent=m;};
 function read(a){if(memory.has(a.id))return memory.get(a.id);let value=c.fresh(a);try{value=c.restore(a,localStorage.getItem(prefix+a.id));}catch{storageOK=false;}memory.set(a.id,value);return value;}
 function save(){memory.set(d.id,state);try{localStorage.setItem(prefix+d.id,JSON.stringify(state));storageOK=true;}catch{storageOK=false;}renderSave();}
 function renderSave(){$('save-status').textContent=storageOK?'Saved in this browser only':'Storage unavailable — edits last only this session';}
 function list(){
  $('account-list').innerHTML=dataset.accounts.map(a=>`<button class="account ${a.id===d.id?'selected':''}" data-account="${c.esc(a.id)}" data-tone="${tone(a)}" aria-pressed="${a.id===d.id}"><span class="signal-dot"></span><strong>${c.esc(a.company)}</strong><span>${c.esc(a.short)}</span><small>${c.approved(a,read(a))?'Approved for export':c.esc(a.classification)}</small></button>`).join('');
  for(const button of $('account-list').querySelectorAll('button'))button.addEventListener('click',()=>{d=dataset.accounts.find(a=>a.id===button.dataset.account);state=read(d);populate();say('');$('evidence').focus();});
 }
 function fit(){for(const el of document.querySelectorAll('textarea')){el.style.height='auto';el.style.height=Math.max(70,el.scrollHeight+2)+'px';}}
 function status(){const ok=c.approved(d,state),errors=c.validate(d,state);$('status').textContent=ok?'Approved for export':d.exportBlocked?'Export blocked':'Pending review';$('status').classList.toggle('approved',ok);$('proposal').classList.toggle('blocked',d.exportBlocked);$('approve').disabled=errors.length>0||ok;$('approve').textContent=ok?'This version is approved':d.exportBlocked?'Campaign export blocked':'Approve for export';$('csv').disabled=!ok;$('brief').disabled=!ok&&!d.exportBlocked;$('brief').textContent=d.exportBlocked?'Evidence brief':'Download brief';$('ack').checked=state.ack;$('gate-message').textContent=ok?'Any edit will require a new review.':errors.length?errors[0]:'Ready for your local approval.';renderSave();}
 function history(){const p=d.provenance;$('provenance-content').innerHTML=`<p><strong>${c.esc(p.runId)}</strong><br>${c.esc(p.prepared)}</p><p>${c.esc(p.method)}</p><h3>Inputs</h3><p>The source facts above, with publisher, URL, publication date where available and check date.</p><h3>Instruction used in preparation</h3><p>${c.esc(p.instruction)}</p><h3>Original AI output</h3><pre>${c.esc(JSON.stringify(d.initial,null,2))}</pre><h3>Assistant source check</h3><p>${c.esc(p.assistantCheck)}</p><h3>Human review</h3><p>${c.esc(p.humanReview)}</p><h3>Corrections</h3><p>${c.esc(p.corrections)}</p><h3>Local edit & approval history (${state.history.length})</h3><pre>${c.esc(JSON.stringify(state.history,null,2))}</pre>`;}
 function populate(){
  $('company').textContent=d.company;$('location').textContent=d.geography;$('lead').textContent=d.lead;$('boundary').textContent=d.boundary;
  $('signal-banner').className='signal-banner '+tone(d);$('signal-banner').innerHTML=`<span class="signal-dot"></span><strong>${c.esc(d.classification)}</strong><span>${c.esc(d.signal)}</span>`;
  $('sources').innerHTML=d.sources.map(s=>`<article class="source"><div class="source-top">${c.esc(s.id)} / ${c.esc(s.publisher.toUpperCase())} · ${c.esc(s.kind.toUpperCase())}</div><h3><a class="source-title" href="${c.esc(s.url)}" target="_blank" rel="noopener noreferrer">${c.esc(s.title)} ↗</a></h3><p class="dates">Published: ${c.esc(s.published||'not stated')} · Checked: ${c.esc(s.checked)}</p><ul class="facts">${s.facts.map(f=>`<li><span class="fact-id">${c.esc(f.id)}</span><span>${c.esc(f.text)}</span></li>`).join('')}</ul></article>`).join('');
  $('resource').innerHTML=d.sources.filter(s=>s.publisher==='Fictiv').map(s=>`<option value="${c.esc(s.url)}">${c.esc(s.title)}</option>`).join('');
  for(const f of c.fields)$(f).value=state.values[f];$('resource-link').href=state.values.resource;
  status();history();list();fit();
 }
 for(const field of c.fields){$(field).addEventListener('focus',()=>{editSession++;});$(field).addEventListener('input',()=>{const prior=!!state.approval;state=c.edit(state,field,$(field).value,editSession);save();status();fit();if(prior){say('Approval removed. Review and approve your updated proposal before exporting.');list();}if($('provenance').open)history();});}
 $('provenance').addEventListener('toggle',()=>{if($('provenance').open)history();});
 $('ack').addEventListener('change',()=>{state.ack=$('ack').checked;if(!state.ack&&state.approval){state.history.push({type:'approval_withdrawn',at:new Date().toISOString()});state.approval=null;say('Approval withdrawn.');}save();status();history();list();});
 $('review-form').addEventListener('submit',e=>{e.preventDefault();try{state=c.approve(d,state);save();status();history();list();say('This version is approved for internal research export. Nothing has been sent.');}catch(error){say(error.message);}});
 function download(content,type,name){const u=URL.createObjectURL(new Blob([content],{type})),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),30000);say('Download prepared: '+name);}
 $('csv').addEventListener('click',()=>{try{download(c.csv(d,state),'text/csv;charset=utf-8',d.id+'-research-record.csv');}catch(error){say(error.message);}});
 $('brief').addEventListener('click',()=>{try{download(c.brief(d,state,{preview:d.exportBlocked}),'text/html;charset=utf-8',d.id+(d.exportBlocked?'-evidence-brief.html':'-research-brief.html'));}catch(error){say(error.message);}});
 $('reset').addEventListener('click',()=>$('reset-dialog').showModal());$('reset-dialog').addEventListener('close',()=>{if($('reset-dialog').returnValue==='reset'){state=c.fresh(d);save();populate();say('Original proposal restored for this account. Other account reviews are unchanged.');$('reset').focus();}});
 window.addEventListener('resize',fit);state=read(d);populate();
})();
