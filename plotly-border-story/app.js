'use strict';
const data = window.BORDER_DATA;
const api = window.BorderStory;
const $ = id => document.getElementById(id);
const fmt = new Intl.NumberFormat('en-US');
const monthName = m => new Date(m + '-01T00:00:00Z').toLocaleDateString('en-US',{month:'short',year:'numeric',timeZone:'UTC'});
const option = (value,label) => {const o=document.createElement('option');o.value=value;o.textContent=label;return o;};
let series=[];
let renderVersion=0;
for(const p of data.ports){$('port').add(option(p,p));$('compare').add(option(p,p));}
$('compare').prepend(option('','No comparison'));
const months=[...new Set(data.rows.map(r=>r.month))].sort();
for(const m of months){$('from').add(option(m,monthName(m)));$('to').add(option(m,monthName(m)));}
$('port').value='Otay Mesa';$('compare').value='Laredo';$('from').value='2025-01';$('to').value='2025-12';
function update(){
  const version=++renderVersion;
  $('download-status').textContent='';
  $('print-chart').removeAttribute('src');
  try{
    series=api.selection(data,[$('port').value,$('compare').value],$('from').value,$('to').value);
    $('range-error').hidden=true;$('results').hidden=false;$('download').disabled=false;
    const range=monthName($('from').value)+'–'+monthName($('to').value);
    $('summary').textContent=range+': '+series.map(s=>s.port+' '+(s.complete?fmt.format(s.total)+' truck entries':'has missing months; no complete total')).join('; ')+'.';
    $('table-caption').textContent='Monthly reported truck entries · '+range;
    $('rows').replaceChildren();
    series.flatMap(s=>s.values).sort((a,b)=>a.month.localeCompare(b.month)||a.port.localeCompare(b.port)).forEach(r=>{
      const tr=document.createElement('tr');
      [monthName(r.month),r.port,r.code,r.value===null?'Not reported':fmt.format(r.value)].forEach((v,i)=>{const td=document.createElement('td');td.textContent=v;if(i===3)td.className='number';tr.append(td);});$('rows').append(tr);
    });
    if(window.Plotly){
      const mobile=window.innerWidth<700;
      Plotly.react($('chart'),series.map((s,i)=>({x:s.values.map(r=>r.month+'-01'),y:s.values.map(r=>r.value),name:s.port,type:'scatter',mode:'lines+markers',connectgaps:false,line:{color:i?'#007b80':'#112b40',width:2.5,dash:i?'dash':'solid'},marker:{size:5},hovertemplate:'%{x|%b %Y}<br>%{y:,d} truck entries<extra>%{fullData.name}</extra>'})),{margin:{l:mobile?48:64,r:15,t:45,b:48},font:{family:'Arial, sans-serif',size:mobile?11:13,color:'#53616e'},paper_bgcolor:'#fff',plot_bgcolor:'#fff',legend:{orientation:'h',y:1.17,x:0},xaxis:{type:'date',tickformat:mobile?'%b<br>%Y':'%b %Y',nticks:mobile?4:8,showgrid:false,automargin:true},yaxis:{rangemode:'tozero',gridcolor:'#e1e6e9',zerolinecolor:'#a2aeb7',tickformat:',.0f',title:mobile?undefined:{text:'Truck entries',font:{size:12}}},hovermode:'x unified',dragmode:false},{displayModeBar:false,responsive:true,scrollZoom:false}).then(async()=>{if(version!==renderVersion)return;$('chart-fallback').hidden=true;const image=await Plotly.toImage($('chart'),{format:'svg',width:1000,height:390});if(version===renderVersion)$('print-chart').src=image;}).catch(()=>{if(version!==renderVersion)return;$('chart-fallback').hidden=false;$('table-details').open=true;});
    }else{$('chart-fallback').hidden=false;$('table-details').open=true;}
  }catch(e){series=[];$('range-error').textContent=e.message;$('range-error').hidden=false;$('results').hidden=true;$('download').disabled=true;}
}
$('filters').addEventListener('submit',e=>e.preventDefault());
$('filters').addEventListener('change',update);
$('download').addEventListener('click',()=>{if(!series.length)return;const blob=new Blob([api.csv(series,data)],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='bts-truck-crossings-'+$('from').value+'-to-'+$('to').value+'.csv';a.click();$('download-status').textContent='CSV prepared: '+series.reduce((n,s)=>n+s.values.length,0)+' records, with source and retrieval date.';setTimeout(()=>URL.revokeObjectURL(url),1000);});
$('reset').addEventListener('click',()=>{$('port').value='Otay Mesa';$('compare').value='Laredo';$('from').value='2025-01';$('to').value='2025-12';$('table-details').open=false;update();$('port').focus();});
let resizeTimer;window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(update,200);});
update();
