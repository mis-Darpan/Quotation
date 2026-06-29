// ══════════════════════════════════════════════
// LITPAX QUOTATION MAKER — script.js
// Battery: 18% GST | Charger: 5% GST
// ══════════════════════════════════════════════

// 🔴 Apna GAS URL yahan daalo
const GAS_URL = 'https://script.google.com/macros/s/AKfycbxV1VaKAuoJc0Jpgb1fPbj6ICJ6Qqn8d1i2v5JDvdT3Z-VoDawl3-Kd6ORbk0A6h9OwyQ/exec';

const BATT_GST = 18;
const CHAR_GST = 5;

let battProducts = [], charProducts = [], company = {};
let bRowCount = 0, cRowCount = 0, savedQNo = null;

// ── INIT ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const today = new Date();
  document.getElementById('navDate').textContent = fmt(today);
  document.getElementById('docDate').textContent = fmt(today);
  updateValidTill();

  if (GAS_URL === 'YOUR_GAS_DEPLOYED_URL_HERE') {
    setStatus('demo','Demo');
    document.getElementById('demoBanner').style.display = 'block';
    loadDemo(); return;
  }
  loadGAS();
});

// ── LOAD GAS ──────────────────────────────────
function loadGAS() {
  setStatus('','Connecting...');
  fetch(`${GAS_URL}?action=getConfig`)
    .then(r => r.json()).then(d => {
      if (!d.success) throw new Error(d.message);
      battProducts = d.products.filter(p => p.type === 'battery');
      charProducts = d.products.filter(p => p.type === 'charger');
      company = d.company;
      applyCompany(); hideLoader(); setStatus('live','Live');
      addBattRow();
    }).catch(e => {
      setStatus('error','Error');
      document.getElementById('loader').innerHTML =
        `<div class="loader-box"><p style="color:#dc2626;font-weight:700;margin-bottom:8px">⚠ Load failed</p>
        <p style="color:#64748b;font-size:12px;margin-bottom:14px">${e.message}</p>
        <button onclick="loadGAS()" style="padding:8px 18px;background:#1e1b4b;color:#fff;border:none;border-radius:6px;cursor:pointer">Retry</button></div>`;
    });
}

// ── DEMO DATA ─────────────────────────────────
function loadDemo() {
  company = {
    'Company Name':'Litpax Technology Pvt. Ltd.',
    'Address':'Plot No. 12, Industrial Area, Rohtak, Haryana – 124001',
    'Phone':'+91 98765 43210','Email':'sales@litpax.in',
    'GST':'06XXXXXX1234X1ZX','Website':'www.litpax.in',
    'Bank Name':'HDFC Bank','Account No':'XXXXXXXX1234','IFSC':'HDFC0001234',
    'Quote Prefix':'LTX-Q'
  };
  battProducts = [
    {category:'2 Wheeler',model:'LTX-2W-48V-30Ah', capacityWh:1440,voltage:'48V',absoluteRate:18500,perWattRate:12.8},
    {category:'2 Wheeler',model:'LTX-2W-60V-30Ah', capacityWh:1800,voltage:'60V',absoluteRate:22000,perWattRate:12.2},
    {category:'2 Wheeler',model:'LTX-2W-72V-30Ah', capacityWh:2160,voltage:'72V',absoluteRate:26500,perWattRate:12.0},
    {category:'3 Wheeler',model:'LTX-3W-48V-60Ah', capacityWh:2880,voltage:'48V',absoluteRate:36000,perWattRate:12.5},
    {category:'3 Wheeler',model:'LTX-3W-60V-60Ah', capacityWh:3600,voltage:'60V',absoluteRate:44000,perWattRate:12.2},
    {category:'3 Wheeler',model:'LTX-3W-72V-60Ah', capacityWh:4320,voltage:'72V',absoluteRate:52000,perWattRate:12.0},
    {category:'Inverter', model:'LTX-INV-12V-100Ah',capacityWh:1200,voltage:'12V',absoluteRate:14500,perWattRate:12.1},
    {category:'Inverter', model:'LTX-INV-24V-100Ah',capacityWh:2400,voltage:'24V',absoluteRate:28000,perWattRate:11.7},
    {category:'Inverter', model:'LTX-INV-48V-100Ah',capacityWh:4800,voltage:'48V',absoluteRate:54000,perWattRate:11.2},
    {category:'Solar',    model:'LTX-SOL-48V-100Ah',capacityWh:4800,voltage:'48V',absoluteRate:58000,perWattRate:12.1},
    {category:'Solar',    model:'LTX-SOL-48V-200Ah',capacityWh:9600,voltage:'48V',absoluteRate:112000,perWattRate:11.7},
    {category:'E-Cycle',  model:'LTX-EC-36V-15Ah',  capacityWh:540, voltage:'36V',absoluteRate:7500, perWattRate:13.9},
    {category:'E-Cycle',  model:'LTX-EC-48V-15Ah',  capacityWh:720, voltage:'48V',absoluteRate:9800, perWattRate:13.6},
    {category:'E-Cycle',  model:'LTX-EC-48V-20Ah',  capacityWh:960, voltage:'48V',absoluteRate:12500,perWattRate:13.0},
  ];
  charProducts = [
    {model:'LTX-CHR-48V-10A', compat:'48V Battery',  output:'48V / 10A',  rate:3200},
    {model:'LTX-CHR-60V-10A', compat:'60V Battery',  output:'60V / 10A',  rate:3800},
    {model:'LTX-CHR-72V-10A', compat:'72V Battery',  output:'72V / 10A',  rate:4200},
    {model:'LTX-CHR-48V-20A', compat:'48V Battery',  output:'48V / 20A',  rate:5500},
    {model:'LTX-CHR-12V-20A', compat:'Inverter 12V', output:'12V / 20A',  rate:2800},
    {model:'LTX-CHR-24V-15A', compat:'Inverter 24V', output:'24V / 15A',  rate:3400},
    {model:'LTX-CHR-36V-5A',  compat:'E-Cycle 36V',  output:'36V / 5A',   rate:1800},
  ];
  applyCompany(); hideLoader(); addBattRow();
}

// ── APPLY COMPANY ─────────────────────────────
function applyCompany() {
  const n = company['Company Name'] || 'Litpax Technology Pvt. Ltd.';
  document.getElementById('hName').textContent = n;
  document.getElementById('hSub').textContent  = [company['Website'], company['GST'] ? 'GSTIN: '+company['GST'] : ''].filter(Boolean).join('  |  ');
  document.getElementById('hPhone').textContent = company['Phone']   || '';
  document.getElementById('hEmail').textContent = company['Email']   || '';
  document.getElementById('hAddr').textContent  = company['Address'] || '';
  document.getElementById('sigCo').textContent  = n;
  const bank = [company['Bank Name'], company['Account No']?'A/C: '+company['Account No']:'', company['IFSC']?'IFSC: '+company['IFSC']:''].filter(Boolean).join('  |  ');
  document.getElementById('printBank').textContent = bank ? 'Bank: '+bank : '';
}

// ════════════════════════════════════════
// BATTERY ROWS
// ════════════════════════════════════════
function cats() { return [...new Set(battProducts.map(p => p.category))]; }
function modelsFor(cat) { return battProducts.filter(p => p.category === cat); }

function addBattRow() {
  bRowCount++;
  const id = `b${bRowCount}`;
  const catOpts = cats().map(c => `<option value="${c}">${c}</option>`).join('');
  const row = document.createElement('div');
  row.className = 'item-row'; row.id = id;
  row.innerHTML = `
    <select class="finput" id="${id}_cat" onchange="onBCat('${id}')">
      <option value="">— Category —</option>${catOpts}
    </select>
    <select class="finput" id="${id}_mdl" onchange="onBMdl('${id}')" disabled>
      <option value="">— Model —</option>
    </select>
    <div class="info-pill" id="${id}_cap">—</div>
    <div class="info-pill" id="${id}_vlt">—</div>
    <div class="rtog">
      <button type="button" class="rtbtn on" id="${id}_bA" onclick="setBMode('${id}','abs')">Abs<br>₹/Unit</button>
      <button type="button" class="rtbtn"    id="${id}_bW" onclick="setBMode('${id}','watt')">Per Watt<br>₹/Wh</button>
    </div>
    <input class="finput" type="number" id="${id}_qty" value="1" min="1" oninput="calcBRow('${id}')"/>
    <input class="finput mono" type="number" id="${id}_rate" placeholder="0.00" min="0" step="0.01" oninput="calcBRow('${id}')"/>
    <div class="amt-cell" id="${id}_amt" data-val="0">₹0.00</div>
    <button type="button" class="btn-del" onclick="delRow('${id}','batt')">✕</button>`;
  document.getElementById('battList').appendChild(row);
  updateEmpty('batt');
}

function onBCat(id) {
  const cat = document.getElementById(`${id}_cat`).value;
  const mdl = document.getElementById(`${id}_mdl`);
  resetRowInfo(id);
  if (!cat) { mdl.innerHTML='<option value="">— Model —</option>'; mdl.disabled=true; return; }
  mdl.innerHTML = `<option value="">— Select model —</option>` +
    modelsFor(cat).map(m=>`<option value="${m.model}">${m.model}</option>`).join('');
  mdl.disabled = false; mdl.focus();
  recalcAll();
}

function onBMdl(id) {
  const cat = document.getElementById(`${id}_cat`).value;
  const mdl = document.getElementById(`${id}_mdl`).value;
  if (!mdl) { resetRowInfo(id); return; }
  const p = battProducts.find(x => x.category===cat && x.model===mdl);
  if (!p) return;
  document.getElementById(`${id}_cap`).textContent = p.capacityWh ? p.capacityWh+' Wh' : '—';
  document.getElementById(`${id}_vlt`).textContent = p.voltage || '—';
  const isW = document.getElementById(`${id}_bW`).classList.contains('on');
  document.getElementById(`${id}_rate`).value = isW ? p.perWattRate : p.absoluteRate;
  calcBRow(id);
}

function setBMode(id, mode) {
  document.getElementById(`${id}_bA`).classList.toggle('on', mode==='abs');
  document.getElementById(`${id}_bW`).classList.toggle('on', mode==='watt');
  const cat = document.getElementById(`${id}_cat`).value;
  const mdl = document.getElementById(`${id}_mdl`).value;
  if (cat && mdl) {
    const p = battProducts.find(x=>x.category===cat && x.model===mdl);
    if (p) document.getElementById(`${id}_rate`).value = mode==='watt' ? p.perWattRate : p.absoluteRate;
  }
  calcBRow(id);
}

function calcBRow(id) {
  const cat  = document.getElementById(`${id}_cat`).value;
  const mdl  = document.getElementById(`${id}_mdl`).value;
  const qty  = parseFloat(document.getElementById(`${id}_qty`).value) || 0;
  const rate = parseFloat(document.getElementById(`${id}_rate`).value) || 0;
  const isW  = document.getElementById(`${id}_bW`).classList.contains('on');
  let amt = 0;
  if (isW && cat && mdl) {
    const p = battProducts.find(x=>x.category===cat && x.model===mdl);
    amt = qty * rate * (p?.capacityWh||0);
  } else { amt = qty * rate; }
  const c = document.getElementById(`${id}_amt`);
  c.textContent = inr(amt); c.dataset.val = amt;
  recalcAll();
}

// ════════════════════════════════════════
// CHARGER ROWS
// ════════════════════════════════════════
function addCharRow() {
  cRowCount++;
  const id = `c${cRowCount}`;
  const mdlOpts = charProducts.map(p=>`<option value="${p.model}">${p.model}</option>`).join('');
  const row = document.createElement('div');
  row.className = 'item-row char-row'; row.id = id;
  row.innerHTML = `
    <select class="finput" id="${id}_mdl" onchange="onCMdl('${id}')">
      <option value="">— Select Charger Model —</option>${mdlOpts}
    </select>
    <div class="info-pill" id="${id}_cmp">—</div>
    <div class="info-pill" id="${id}_out">—</div>
    <select class="finput" id="${id}_unit">
      <option value="Nos">Nos</option>
      <option value="Set">Set</option>
      <option value="Pcs">Pcs</option>
    </select>
    <input class="finput" type="number" id="${id}_qty" value="1" min="1" oninput="calcCRow('${id}')"/>
    <input class="finput mono" type="number" id="${id}_rate" placeholder="0.00" min="0" step="0.01" oninput="calcCRow('${id}')"/>
    <div class="amt-cell" id="${id}_amt" data-val="0">₹0.00</div>
    <button type="button" class="btn-del" onclick="delRow('${id}','char')">✕</button>`;
  document.getElementById('charList').appendChild(row);
  updateEmpty('char');
}

function onCMdl(id) {
  const mdl = document.getElementById(`${id}_mdl`).value;
  if (!mdl) {
    document.getElementById(`${id}_cmp`).textContent = '—';
    document.getElementById(`${id}_out`).textContent = '—';
    document.getElementById(`${id}_rate`).value = '';
    calcCRow(id); return;
  }
  const p = charProducts.find(x=>x.model===mdl);
  if (!p) return;
  document.getElementById(`${id}_cmp`).textContent = p.compat || '—';
  document.getElementById(`${id}_out`).textContent = p.output || '—';
  document.getElementById(`${id}_rate`).value = p.rate || '';
  calcCRow(id);
}

function calcCRow(id) {
  const qty  = parseFloat(document.getElementById(`${id}_qty`).value)  || 0;
  const rate = parseFloat(document.getElementById(`${id}_rate`).value) || 0;
  const amt  = qty * rate;
  const c = document.getElementById(`${id}_amt`);
  c.textContent = inr(amt); c.dataset.val = amt;
  recalcAll();
}

// ── DELETE ROW ────────────────────────────────
function delRow(id, type) {
  const r = document.getElementById(id);
  if (!r) return;
  r.style.opacity='0'; r.style.transition='opacity .15s';
  setTimeout(()=>{ r.remove(); recalcAll(); updateEmpty(type); }, 150);
}

// ── RECALC ALL ────────────────────────────────
function recalcAll() {
  // Battery
  let bSub = 0;
  document.querySelectorAll('#battList .amt-cell').forEach(e => bSub += parseFloat(e.dataset.val||0));
  const bGst = bSub * BATT_GST / 100;
  const bTot = bSub + bGst;

  // Charger
  let cSub = 0;
  document.querySelectorAll('#charList .amt-cell').forEach(e => cSub += parseFloat(e.dataset.val||0));
  const cGst = cSub * CHAR_GST / 100;
  const cTot = cSub + cGst;

  const grand = bTot + cTot;

  // Sec subtotals
  set('battSubtotal', inr(bSub)); set('battGst', inr(bGst)); set('battTotal', inr(bTot));
  set('charSubtotal', inr(cSub)); set('charGst', inr(cGst)); set('charTotal', inr(cTot));

  // Grand block
  set('gtBatt', inr(bTot)); set('gtChar', inr(cTot)); set('grandTotal', inr(grand));
  set('amountWords', n2w(Math.round(grand)));

  // Sidebar
  set('sbBatt',    inr(bSub)); set('sbBattGst', inr(bGst));
  set('sbChar',    inr(cSub)); set('sbCharGst', inr(cGst));
  set('sbGrand',   inr(grand));
}

// ── EMPTY STATE ───────────────────────────────
function updateEmpty(type) {
  const listId  = type==='batt' ? 'battList' : 'charList';
  const emptyId = type==='batt' ? 'battEmpty' : 'charEmpty';
  document.getElementById(emptyId).style.display =
    document.querySelectorAll(`#${listId} .item-row`).length ? 'none' : 'block';
}

// ── RESET ROW INFO ────────────────────────────
function resetRowInfo(id) {
  ['_cap','_vlt'].forEach(s => {
    const el = document.getElementById(id+s);
    if (el) el.textContent = '—';
  });
  const r = document.getElementById(`${id}_rate`);
  if (r) r.value = '';
  const a = document.getElementById(`${id}_amt`);
  if (a) { a.textContent='₹0.00'; a.dataset.val='0'; }
  recalcAll();
}

// ── VALID TILL ────────────────────────────────
function updateValidTill() {
  const d = new Date();
  d.setDate(d.getDate() + (parseInt(document.getElementById('validityDays').value)||30));
  document.getElementById('docValidTill').textContent = fmt(d);
}

// ── COLLECT ALL ITEMS ─────────────────────────
function collectBattItems() {
  return [...document.querySelectorAll('#battList .item-row')].map(r => {
    const id  = r.id;
    const cat = document.getElementById(`${id}_cat`).value;
    const mdl = document.getElementById(`${id}_mdl`).value;
    if (!cat||!mdl) return null;
    const p   = battProducts.find(x=>x.category===cat && x.model===mdl);
    const qty = parseFloat(document.getElementById(`${id}_qty`).value)||0;
    const rate= parseFloat(document.getElementById(`${id}_rate`).value)||0;
    const isW = document.getElementById(`${id}_bW`).classList.contains('on');
    const amt = parseFloat(document.getElementById(`${id}_amt`).dataset.val||0);
    return {type:'battery',category:cat,model:mdl,capacityWh:p?.capacityWh||'',voltage:p?.voltage||'',qty,rate,rateType:isW?'perWatt':'absolute',amount:amt};
  }).filter(Boolean);
}

function collectCharItems() {
  return [...document.querySelectorAll('#charList .item-row')].map(r => {
    const id  = r.id;
    const mdl = document.getElementById(`${id}_mdl`).value;
    if (!mdl) return null;
    const p    = charProducts.find(x=>x.model===mdl);
    const unit = document.getElementById(`${id}_unit`).value;
    const qty  = parseFloat(document.getElementById(`${id}_qty`).value)||0;
    const rate = parseFloat(document.getElementById(`${id}_rate`).value)||0;
    const amt  = parseFloat(document.getElementById(`${id}_amt`).dataset.val||0);
    return {type:'charger',model:mdl,compat:p?.compat||'',output:p?.output||'',unit,qty,rate,amount:amt};
  }).filter(Boolean);
}

// ── BUILD PRINT ───────────────────────────────
function buildPrint(bItems, cItems) {
  // Battery print rows
  const bc = document.getElementById('printBattList');
  bc.innerHTML = '';
  bItems.forEach((item,i) => {
    const rLabel = item.rateType==='perWatt' ? inr(item.rate)+'/Wh' : inr(item.rate);
    const d = document.createElement('div');
    d.className = 'pr-row';
    d.innerHTML = `
      <div>${i+1}</div>
      <div><strong>${item.category}</strong><br><span style="font-size:10px;color:#64748b">${item.model}</span></div>
      <div>${item.capacityWh?item.capacityWh+' Wh':'—'}</div>
      <div>${item.voltage||'—'}</div>
      <div class="c-qty">${item.qty} Nos</div>
      <div class="c-rate">${rLabel}</div>
      <div class="c-amt">${inr(item.amount)}</div>`;
    bc.appendChild(d);
  });

  // Charger print rows
  const cc = document.getElementById('printCharList');
  cc.innerHTML = '';
  cItems.forEach((item,i) => {
    const d = document.createElement('div');
    d.className = 'pr-row';
    d.innerHTML = `
      <div>${i+1}</div>
      <div><strong>${item.model}</strong></div>
      <div>${item.compat||'—'}</div>
      <div>${item.output||'—'}</div>
      <div class="c-qty">${item.qty} ${item.unit}</div>
      <div class="c-rate">${inr(item.rate)}</div>
      <div class="c-amt">${inr(item.amount)}</div>`;
    cc.appendChild(d);
  });
}

// ── FILL TERMS ────────────────────────────────
function fillTerms() {
  const notes = document.getElementById('notes').value.trim();
  const days  = document.getElementById('validityDays').value||'30';
  document.getElementById('printTerms').innerHTML = notes
    ? notes.split('\n').filter(l=>l.trim()).map(l=>`<div>${l.replace(/^[•\-]\s*/,'• ')}</div>`).join('')
    : `<div>• Valid for ${days} days from date of issue.</div>
       <div>• Battery: 18% GST | Charger: 5% GST applicable.</div>
       <div>• 50% advance, balance before dispatch.</div>
       <div>• Delivery 15–20 working days from confirmation.</div>`;
}

// ── SAVE ──────────────────────────────────────
function saveQuotation() {
  const name = document.getElementById('custName').value.trim();
  if (!name) { toast('Customer name required!','error'); return; }
  const bItems = collectBattItems(), cItems = collectCharItems();
  if (!bItems.length && !cItems.length) { toast('Koi item add karein!','error'); return; }
  buildPrint(bItems, cItems); fillTerms();

  if (GAS_URL==='YOUR_GAS_DEPLOYED_URL_HERE') {
    document.getElementById('docQNo').textContent = 'LTX-Q-DEMO';
    toast('Demo — print kar sakte hain!','info'); return;
  }

  const btn = document.getElementById('saveBtn');
  btn.disabled=true; btn.textContent='Saving...';

  const grand = parseFloat(document.getElementById('grandTotal').textContent.replace(/[₹,]/g,''))||0;
  const payload = {
    customer:{name,phone:v('custPhone'),email:v('custEmail'),address:v('custAddress'),gst:v('custGST')},
    battItems:bItems, charItems:cItems,
    battGstPct:BATT_GST, charGstPct:CHAR_GST, grandTotal:grand,
    notes:v('notes'), validityDays:v('validityDays')
  };

  fetch(`${GAS_URL}?action=saveQuotation&data=${encodeURIComponent(JSON.stringify(payload))}`)
    .then(r=>r.json()).then(res=>{
      if(!res.success) throw new Error(res.message);
      savedQNo = res.quotationNo;
      document.getElementById('docQNo').textContent = savedQNo;
      toast(`✅ Saved! ${savedQNo}`,'success');
      btn.disabled=false; btn.innerHTML='💾 Save Quotation';
    }).catch(e=>{ toast('❌ '+e.message,'error'); btn.disabled=false; btn.innerHTML='💾 Save Quotation'; });
}

// ── PRINT ─────────────────────────────────────
function previewPrint() {
  const name = document.getElementById('custName').value.trim();
  if (!name) { toast('Customer name daalo pehle!','error'); return; }
  const bItems = collectBattItems(), cItems = collectCharItems();
  if (!bItems.length && !cItems.length) { toast('Koi item add karein!','error'); return; }
  buildPrint(bItems, cItems); fillTerms();
  if (!savedQNo) document.getElementById('docQNo').textContent = 'DRAFT';
  window.print();
}

// ── RESET ─────────────────────────────────────
function resetForm() {
  if (!confirm('Form reset karna chahte hain?')) return;
  ['custName','custPhone','custEmail','custAddress','custGST','notes'].forEach(i=>document.getElementById(i).value='');
  document.getElementById('validityDays').value='30';
  document.getElementById('battList').innerHTML='';
  document.getElementById('charList').innerHTML='';
  document.getElementById('printBattList').innerHTML='';
  document.getElementById('printCharList').innerHTML='';
  document.getElementById('docQNo').textContent='Auto';
  savedQNo=null; bRowCount=0; cRowCount=0;
  recalcAll(); updateValidTill();
  updateEmpty('batt'); updateEmpty('char');
  addBattRow();
}

// ── HELPERS ───────────────────────────────────
function hideLoader(){
  const l=document.getElementById('loader');
  l.style.opacity='0';l.style.transition='opacity .3s';
  setTimeout(()=>l.style.display='none',300);
  document.getElementById('app').style.display='block';
}
function setStatus(t,l){
  document.getElementById('navPill').className=`npill ${t}`;
  document.getElementById('navLbl').textContent=l;
}
function fmt(d){ return d.toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}); }
function inr(n){ return '₹'+Number((n||0).toFixed(2)).toLocaleString('en-IN',{minimumFractionDigits:2}); }
function set(id,val){ const e=document.getElementById(id); if(e) e.textContent=val; }
function v(id){ return document.getElementById(id)?.value||''; }
function toast(msg,type='success'){
  const t=document.getElementById('toast');
  t.textContent=msg; t.className=`toast show ${type}`;
  clearTimeout(t._t); t._t=setTimeout(()=>t.className='toast',3500);
}
function n2w(n){
  if(!n) return 'Zero Rupees Only';
  const o=['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
  const t=['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
  function w(x){
    if(!x)return '';
    if(x<20)return o[x]+' ';
    if(x<100)return t[Math.floor(x/10)]+(x%10?' '+o[x%10]:'')+' ';
    if(x<1000)return o[Math.floor(x/100)]+' Hundred '+w(x%100);
    if(x<100000)return w(Math.floor(x/1000))+'Thousand '+w(x%1000);
    if(x<10000000)return w(Math.floor(x/100000))+'Lakh '+w(x%100000);
    return w(Math.floor(x/10000000))+'Crore '+w(x%10000000);
  }
  return w(n).trim()+' Rupees Only';
}
