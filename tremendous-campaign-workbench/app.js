/* OpenAI Codex · November 6, 2026 Pacific · private first functional review */
(()=>{'use strict';
const D=window.CampaignData,C=window.CampaignCore,$=s=>document.querySelector(s),all=s=>[...document.querySelectorAll(s)],E=C.esc;
let audience='demand',tab='email',preview=false,storageOK=true,timer;
const states={};const prefix='sb-tremendous-v01:';
for(const id of Object.keys(D.variants)){let raw=null;try{raw=localStorage.getItem(prefix+id)}catch{storageOK=false}states[id]=C.restore(D,id,raw)}
const state=()=>states[audience];
function toast(msg){$('#toast').textContent=msg;clearTimeout(timer);timer=setTimeout(()=>$('#toast').textContent='',3500)}
function save(){try{localStorage.setItem(prefix+audience,JSON.stringify(state()));storageOK=true}catch{storageOK=false}status()}
function status(){const s=state(),errs=C.errors(D,s),done=C.reviewed(s);$('#status').textContent=done?'Locally reviewed':'Draft';$('#status').classList.toggle('reviewed',done);$('#review').checked=done;$('#review').disabled=!!errs.length;$('#export').disabled=!!errs.length;$('#export').innerHTML=(done?'Export reviewed pack':'Export draft pack')+' <span aria-hidden="true">↓</span>';$('#validation').textContent=errs.join(' ');$('#saved').textContent=storageOK?'Saved in this browser only':'Storage unavailable — edits stay in this tab; export to keep them.'}
function download(content,type,name){const url=URL.createObjectURL(new Blob([content],{type}));const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000)}
function textAsset(){return D.fields[tab].map(([k,l])=>l+'\n'+state().assets[tab][k]).join('\n\n')+'\n\nDestination: '+D.destination}
function renderPreview(){const a=state().assets[tab];let html='';const cta=x=>`<a class="preview-cta" href="${E(D.destination)}" target="_blank" rel="noopener noreferrer">${E(x)}</a><p class="preview-note">Opens the public guide page. No message or reward is sent.</p>`;
if(tab==='email')html=`<div class="preview-email"><p class="subject">${E(a.subject)}</p><p class="preheader">${E(a.preheader)}</p><p class="preview-body">${E(a.body)}</p>${cta(a.cta)}</div>`;
else if(tab==='landing')html=`<div class="preview-landing"><h3>${E(a.headline)}</h3><p class="preview-body">${E(a.intro)}</p>${cta(a.cta)}</div>`;
else html='<div class="preview-document">'+D.fields[tab].map(([k,l])=>`<h3>${E(l)}</h3><p>${E(a[k])}</p>`).join('')+'</div>';
$('#preview').innerHTML=html}
function renderAsset(){all('[data-tab]').forEach(b=>{const on=b.dataset.tab===tab;b.setAttribute('aria-selected',on);b.tabIndex=on?0:-1});$('#asset-panel').setAttribute('aria-labelledby','tab-'+tab);$('#asset-note').textContent=preview?'Preview of your current edits':'Editable saved draft · '+D.variants[audience].name;$('#preview-toggle').textContent=preview?'Edit':'Preview';$('#preview-toggle').setAttribute('aria-pressed',preview);$('#fields').hidden=preview;$('#preview').hidden=!preview;
$('#fields').innerHTML=D.fields[tab].map(([key,label])=>{const v=E(state().assets[tab][key]);const short=key==='cta';return `<label class="field"><span>${E(label)}</span>${short?`<input id="field-${key}" data-field="${key}" maxlength="12000" value="${v}">`:`<textarea id="field-${key}" data-field="${key}" maxlength="12000" class="${key==='body'?'body':(['subject','preheader','headline'].includes(key)?'compact':'')}" rows="${key==='body'?8:(['subject','preheader','headline'].includes(key)?2:4)}">${v}</textarea>`}</label>`}).join('');
all('[data-field]').forEach(el=>el.addEventListener('input',()=>{states[audience]=C.edited(D,state(),tab,el.dataset.field,el.value);save()}));
$('#asset-sources').textContent='Source context: '+D.variants[audience].sourceMap[tab].join(', ')+'. Messaging and test design are editorial proposals.';renderPreview();status()}
function renderAudience(){const v=D.variants[audience];all('[data-audience]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.audience===audience));$('#angle').textContent=v.angle;$('#objective').textContent=v.objective;renderAsset()}
$('#sources').innerHTML=D.sources.map(s=>`<article class="source"><div class="source-head"><span>${s.id} / ${E(s.type)}</span><span>PUBLIC</span></div><a href="${E(s.url)}" target="_blank" rel="noopener noreferrer">${E(s.title)} ↗</a><p>${E(s.facts)}</p><details><summary>Source limits & date</summary><p>${E(s.limit)}</p><p>Checked ${E(s.checked)} Pacific. Publication date not stated.</p></details></article>`).join('');
$('#ai-method').textContent=D.provenance.method;$('#about-method').textContent=D.provenance.method;$('#source-check').textContent=D.provenance.sourceCheck;
all('[data-audience]').forEach(b=>b.addEventListener('click',()=>{audience=b.dataset.audience;renderAudience();toast('Opened '+D.variants[audience].name+' draft')}));
all('[data-tab]').forEach(b=>{b.addEventListener('click',()=>{tab=b.dataset.tab;renderAsset()});b.addEventListener('keydown',e=>{const bs=all('[data-tab]'),i=bs.indexOf(b);let next;if(e.key==='ArrowRight')next=(i+1)%bs.length;else if(e.key==='ArrowLeft')next=(i+bs.length-1)%bs.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=bs.length-1;else return;e.preventDefault();bs[next].click();bs[next].focus()})});
$('#preview-toggle').onclick=()=>{preview=!preview;renderAsset()};
$('#copy').onclick=async()=>{const value=textAsset();try{await navigator.clipboard.writeText(value);toast('Copied '+D.labels[tab])}catch{download(value,'text/plain;charset=utf-8',audience+'-'+tab+'.txt');toast('Clipboard unavailable. Downloaded a text copy.')}};
$('#review').onchange=()=>{states[audience]=$('#review').checked?C.mark(D,state()):{...state(),reviewed:null};save()};
$('#export').onclick=()=>{try{download(C.html(D,state()),'text/html;charset=utf-8','tremendous-'+audience+'-campaign.html');toast('Campaign pack downloaded')}catch(e){toast(e.message)}};
$('#provenance-download').onclick=()=>download(JSON.stringify(C.record(D,state()),null,2),'application/json','tremendous-'+audience+'-preparation.json');
$('#reset').onclick=()=>$('#reset-dialog').showModal();$('#reset-cancel').onclick=()=>$('#reset-dialog').close();$('#reset-confirm').onclick=()=>{states[audience]=C.fresh(D,audience);save();renderAudience();$('#reset-dialog').close();toast('Restored original '+D.variants[audience].name+' draft')};
$('#about-open').onclick=()=>$('#about').showModal();$('#about-close').onclick=()=>$('#about').close();renderAudience();
})();
