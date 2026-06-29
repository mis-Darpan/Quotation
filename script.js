// ══════════════════════════════════════════════
// LITPAX QUOTATION MAKER — script.js
// ══════════════════════════════════════════════

// 🔴 Apna GAS URL yahan daalo
const GAS_URL = 'https://script.google.com/macros/s/AKfycbxV1VaKAuoJc0Jpgb1fPbj6ICJ6Qqn8d1i2v5JDvdT3Z-VoDawl3-Kd6ORbk0A6h9OwyQ/exec';

let products = [], company = {}, rowCount = 0, savedQNo = null;

// ── INIT ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const today = new Date();
  if(document.getElementById('navDate'))
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
    .then(r=>r.json()).then(d=>{
      if(!d.success) throw new Error(d.message);
      products = d.products; company = d.company;
      applyCompany(); hideLoader(); setStatus('live','Live'); addItem();
    }).catch(e=>{
      setStatus('error','Error');
      document.getElementById('loader').innerHTML=
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
  products = [
    {category:'2 Wheeler',model:'LTX-2W-48V-30Ah', capacityWh:1440,voltage:'48V',absoluteRate:18500,perWattRate:12.8,unit:'Nos'},
    {category:'2 Wheeler',model:'LTX-2W-60V-30Ah', capacityWh:1800,voltage:'60V',absoluteRate:22000,perWattRate:12.2,unit:'Nos'},
    {category:'2 Wheeler',model:'LTX-2W-72V-30Ah', capacityWh:2160,voltage:'72V',absoluteRate:26500,perWattRate:12.0,unit:'Nos'},
    {category:'3 Wheeler',model:'LTX-3W-48V-60Ah', capacityWh:2880,voltage:'48V',absoluteRate:36000,perWattRate:12.5,unit:'Nos'},
    {category:'3 Wheeler',model:'LTX-3W-60V-60Ah', capacityWh:3600,voltage:'60V',absoluteRate:44000,perWattRate:12.2,unit:'Nos'},
    {category:'3 Wheeler',model:'LTX-3W-72V-60Ah', capacityWh:4320,voltage:'72V',absoluteRate:52000,perWattRate:12.0,unit:'Nos'},
    {category:'Inverter', model:'LTX-INV-12V-100Ah',capacityWh:1200,voltage:'12V',absoluteRate:14500,perWattRate:12.1,unit:'Nos'},
    {category:'Inverter', model:'LTX-INV-24V-100Ah',capacityWh:2400,voltage:'24V',absoluteRate:28000,perWattRate:11.7,unit:'Nos'},
    {category:'Inverter', model:'LTX-INV-48V-100Ah',capacityWh:4800,voltage:'48V',absoluteRate:54000,perWattRate:11.2,unit:'Nos'},
    {category:'Solar',    model:'LTX-SOL-48V-100Ah',capacityWh:4800,voltage:'48V',absoluteRate:58000,perWattRate:12.1,unit:'Nos'},
    {category:'Solar',    model:'LTX-SOL-48V-200Ah',capacityWh:9600,voltage:'48V',absoluteRate:112000,perWattRate:11.7,unit:'Nos'},
    {category:'E-Cycle',  model:'LTX-EC-36V-15Ah',  capacityWh:540, voltage:'36V',absoluteRate:7500, perWattRate:13.9,unit:'Nos'},
    {category:'E-Cycle',  model:'LTX-EC-48V-15Ah',  capacityWh:720, voltage:'48V',absoluteRate:9800, perWattRate:13.6,unit:'Nos'},
    {category:'E-Cycle',  model:'LTX-EC-48V-20Ah',  capacityWh:960, voltage:'48V',absoluteRate:12500,perWattRate:13.0,unit:'Nos'},
  ];
  applyCompany(); hideLoader(); addItem();
}

// ── APPLY COMPANY ─────────────────────────────
function applyCompany() {
  const n = company['Company Name'] || 'Litpax Technology Pvt. Ltd.';
  const g = company['GST'] || '';
  document.getElementById('hCompanyName').textContent = n;
  document.getElementById('hCompanyContact').textContent = [company['Website'], g ? `GSTIN: ${g}` : ''].filter(Boolean).join('  |  ');
  document.getElementById('hPhoneVal').textContent   = company['Phone']   || '';
  document.getElementById('hEmailVal').textContent   = company['Email']   || '';
  document.getElementById('hAddressVal').textContent = company['Address'] || '';
  document.getElementById('sigCo').textContent = n;
  // bank
  const bank = [company['Bank Name'], company['Account No'] ? 'A/C: '+company['Account No'] : '', company['IFSC'] ? 'IFSC: '+company['IFSC'] : ''].filter(Boolean).join('  |  ');
  document.getElementById('printBank').textContent = bank ? 'Bank: ' + bank : '';
}

// ── CATEGORIES ────────────────────────────────
function cats() { return [...new Set(products.map(p=>p.category))]; }
function modelsFor(cat) { return products.filter(p=>p.category===cat); }

// ── ADD ITEM ROW ──────────────────────────────
function addItem() {
  rowCount++;
  const id = `r${rowCount}`;
  const catOpts = cats().map(c=>`<option value="${c}">${c}</option>`).join('');

  const row = document.createElement('div');
  row.className = 'item-row'; row.id = id;
  row.innerHTML = `
    <select class="finput" id="${id}_cat" onchange="onCat('${id}')">
      <option value="">— Category —</option>${catOpts}
    </select>
    <select class="finput" id="${id}_mdl" onchange="onMdl('${id}')" disabled>
      <option value="">— Model —</option>
    </select>
    <div class="info-pill" id="${id}_cap">—</div>
    <div class="info-pill" id="${id}_vlt">—</div>
    <div class="rtog">
      <button type="button" class="rtbtn on" id="${id}_bA" onclick="setMode('${id}','abs')">Abs<br>₹/Unit</button>
      <button type="button" class="rtbtn"    id="${id}_bW" onclick="setMode('${id}','watt')">Per Watt<br>₹/Wh</button>
    </div>
    <input class="finput" type="number" id="${id}_qty" value="1" min="1" oninput="calcRow('${id}')"/>
    <input class="finput mono" type="number" id="${id}_rate" placeholder="0.00" min="0" step="0.01" oninput="calcRow('${id}')"/>
    <div class="amt-cell" id="${id}_amt" data-val="0">₹0.00</div>
    <button type="button" class="btn-del" onclick="delRow('${id}')">✕</button>`;
  document.getElementById('itemsList').appendChild(row);
  updateEmpty();
}

// ── ON CATEGORY ───────────────────────────────
function onCat(id) {
  const cat = document.getElementById(`${id}_cat`).value;
  const mdl = document.getElementById(`${id}_mdl`);
  reset(id);
  if (!cat) { mdl.innerHTML='<option value="">— Model —</option>'; mdl.disabled=true; return; }
  mdl.innerHTML = `<option value="">— Select model —</option>` +
    modelsFor(cat).map(m=>`<option value="${m.model}">${m.model}</option>`).join('');
  mdl.disabled = false; mdl.focus();
  recalcTotals();
}

// ── ON MODEL ──────────────────────────────────
function onMdl(id) {
  const cat = document.getElementById(`${id}_cat`).value;
  const mdl = document.getElementById(`${id}_mdl`).value;
  if (!mdl) { reset(id); return; }
  const p = products.find(x=>x.category===cat && x.model===mdl);
  if (!p) return;
  document.getElementById(`${id}_cap`).textContent = p.capacityWh ? p.capacityWh+' Wh' : '—';
  document.getElementById(`${id}_vlt`).textContent = p.voltage || '—';
  const isW = document.getElementById(`${id}_bW`).classList.contains('on');
  document.getElementById(`${id}_rate`).value = isW ? p.perWattRate : p.absoluteRate;
  calcRow(id);
}

// ── RESET ROW INFO ────────────────────────────
function reset(id) {
  document.getElementById(`${id}_cap`).textContent = '—';
  document.getElementById(`${id}_vlt`).textContent = '—';
  document.getElementById(`${id}_rate`).value = '';
  const c = document.getElementById(`${id}_amt`);
  c.textContent = '₹0.00'; c.dataset.val = '0';
  recalcTotals();
}

// ── SET RATE MODE ─────────────────────────────
function setMode(id, mode) {
  document.getElementById(`${id}_bA`).classList.toggle('on', mode==='abs');
  document.getElementById(`${id}_bW`).classList.toggle('on', mode==='watt');
  const cat = document.getElementById(`${id}_cat`).value;
  const mdl = document.getElementById(`${id}_mdl`).value;
  if (cat && mdl) {
    const p = products.find(x=>x.category===cat && x.model===mdl);
    if (p) document.getElementById(`${id}_rate`).value = mode==='watt' ? p.perWattRate : p.absoluteRate;
  }
  calcRow(id);
}

// ── CALC ROW ──────────────────────────────────
function calcRow(id) {
  const cat = document.getElementById(`${id}_cat`).value;
  const mdl = document.getElementById(`${id}_mdl`).value;
  const qty  = parseFloat(document.getElementById(`${id}_qty`).value)  || 0;
  const rate = parseFloat(document.getElementById(`${id}_rate`).value) || 0;
  const isW  = document.getElementById(`${id}_bW`).classList.contains('on');
  let amt = 0;
  if (isW && cat && mdl) {
    const p = products.find(x=>x.category===cat && x.model===mdl);
    amt = qty * rate * (p?.capacityWh || 0);
  } else { amt = qty * rate; }
  const c = document.getElementById(`${id}_amt`);
  c.textContent = inr(amt); c.dataset.val = amt;
  recalcTotals();
}

// ── DELETE ROW ────────────────────────────────
function delRow(id) {
  const r = document.getElementById(id);
  if (!r) return;
  r.style.opacity='0'; r.style.transition='opacity .15s';
  setTimeout(()=>{ r.remove(); recalcTotals(); updateEmpty(); }, 150);
}

// ── RECALC TOTALS ─────────────────────────────
function recalcTotals() {
  let sub = 0;
  document.querySelectorAll('.amt-cell').forEach(e=>sub+=parseFloat(e.dataset.val||0));
  const gp = parseFloat(document.getElementById('gstSelect').value)||0;
  const ga = sub*gp/100, grand = sub+ga;

  ['subtotalVal','sbSubtotal'].forEach(i=>document.getElementById(i).textContent=inr(sub));
  ['gstVal','sbGst'].forEach(i=>document.getElementById(i).textContent=inr(ga));
  ['grandTotalVal','sbGrand'].forEach(i=>document.getElementById(i).textContent=inr(grand));
  document.getElementById('gstPctLbl').textContent = `(${gp}%)`;
  document.getElementById('sbGstLabel').textContent = `GST (${gp}%)`;
  document.getElementById('amountWords').textContent = n2w(Math.round(grand));
}

// ── VALID TILL ────────────────────────────────
function updateValidTill() {
  const d = new Date();
  d.setDate(d.getDate() + (parseInt(document.getElementById('validityDays').value)||30));
  document.getElementById('docValidTill').textContent = fmt(d);
}

// ── EMPTY STATE ───────────────────────────────
function updateEmpty() {
  document.getElementById('emptyState').style.display =
    document.querySelectorAll('.item-row').length ? 'none' : 'block';
}

// ── COLLECT ITEMS ─────────────────────────────
function collectItems() {
  return [...document.querySelectorAll('.item-row')].map(r=>{
    const id  = r.id;
    const cat = document.getElementById(`${id}_cat`).value;
    const mdl = document.getElementById(`${id}_mdl`).value;
    if (!cat || !mdl) return null;
    const p    = products.find(x=>x.category===cat && x.model===mdl);
    const qty  = parseFloat(document.getElementById(`${id}_qty`).value)||0;
    const rate = parseFloat(document.getElementById(`${id}_rate`).value)||0;
    const isW  = document.getElementById(`${id}_bW`).classList.contains('on');
    const amt  = parseFloat(document.getElementById(`${id}_amt`).dataset.val||0);
    return {category:cat,model:mdl,capacityWh:p?.capacityWh||'',voltage:p?.voltage||'',unit:p?.unit||'Nos',qty,rate,rateType:isW?'perWatt':'absolute',amount:amt};
  }).filter(Boolean);
}

// ── BUILD PRINT ROWS ──────────────────────────
function buildPrint(items) {
  const c = document.getElementById('printList');
  c.innerHTML = '';
  items.forEach((item,i)=>{
    const rateStr = item.rateType==='perWatt' ? `${inr(item.rate)}/Wh` : inr(item.rate);
    const d = document.createElement('div');
    d.className = 'pr-row';
    d.innerHTML = `
      <div><strong>${item.category}</strong><br><span style="font-size:11px;color:#64748b">${item.model}</span></div>
      <div>${item.capacityWh ? item.capacityWh+' Wh' : '—'}</div>
      <div>${item.voltage||'—'}</div>
      <div class="c-qty">${item.qty} ${item.unit}</div>
      <div class="c-rate">${rateStr}</div>
      <div class="c-amt">${inr(item.amount)}</div>`;
    c.appendChild(d);
  });
}

// ── FILL PRINT TERMS ──────────────────────────
function fillTerms() {
  const notes = document.getElementById('notes').value.trim();
  const days  = document.getElementById('validityDays').value || '30';
  const gstP  = document.getElementById('gstSelect').value;
  document.getElementById('printTerms').innerHTML = notes
    ? notes.split('\n').filter(l=>l.trim()).map(l=>`<div>${l.replace(/^[•\-]\s*/,'• ')}</div>`).join('')
    : `<div>• Valid for ${days} days from date of issue.</div>
       <div>• GST @ ${gstP}% as applicable.</div>
       <div>• 50% advance, balance before dispatch.</div>
       <div>• Delivery 15–20 working days from confirmation.</div>`;
}

// ── SAVE ──────────────────────────────────────
function saveQuotation() {
  const name = document.getElementById('custName').value.trim();
  if (!name) { toast('Customer name required!','error'); return; }
  const items = collectItems();
  if (!items.length) { toast('Ek item add karein!','error'); return; }
  buildPrint(items); fillTerms();

  if (GAS_URL==='YOUR_GAS_DEPLOYED_URL_HERE') {
    document.getElementById('docQNo').textContent = 'LTX-Q-DEMO';
    toast('Demo — print kar sakte hain!','info'); return;
  }

  const btn = document.getElementById('saveBtn');
  btn.disabled=true; btn.textContent='Saving...';

  const sub   = parseNum('subtotalVal'), gstP=parseFloat(document.getElementById('gstSelect').value)||0;
  const gstA  = parseNum('gstVal'), grand = parseNum('grandTotalVal');
  const payload = {
    customer:{name,phone:val('custPhone'),email:val('custEmail'),address:val('custAddress'),gst:val('custGST')},
    items,subtotal:sub,gstPercent:gstP,gstAmount:gstA,grandTotal:grand,
    notes:val('notes'),validityDays:val('validityDays')
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
  const items = collectItems();
  if (!items.length) { toast('Ek item add karein!','error'); return; }
  buildPrint(items); fillTerms();
  if (!savedQNo) document.getElementById('docQNo').textContent = 'DRAFT';
  window.print();
}

// ── RESET ─────────────────────────────────────
function resetForm() {
  if (!confirm('Form reset karna chahte hain?')) return;
  ['custName','custPhone','custEmail','custAddress','custGST','notes'].forEach(i=>document.getElementById(i).value='');
  document.getElementById('validityDays').value='30';
  document.getElementById('itemsList').innerHTML='';
  document.getElementById('printList').innerHTML='';
  document.getElementById('docQNo').textContent='Auto';
  savedQNo=null; rowCount=0;
  recalcTotals(); updateValidTill(); updateEmpty(); addItem();
}

// ── HELPERS ───────────────────────────────────
function hideLoader() {
  const l=document.getElementById('loader');
  l.style.opacity='0'; l.style.transition='opacity .3s';
  setTimeout(()=>l.style.display='none',300);
  document.getElementById('app').style.display='block';
}
function setStatus(type,lbl) {
  document.getElementById('navStatus').className=`nav-pill ${type}`;
  document.getElementById('navLbl').textContent=lbl;
}
function fmt(d){ return d.toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}); }
function inr(n){ return '₹'+Number((n||0).toFixed(2)).toLocaleString('en-IN',{minimumFractionDigits:2}); }
function val(id){ return document.getElementById(id).value; }
function parseNum(id){ return parseFloat(document.getElementById(id).textContent.replace(/[₹,]/g,''))||0; }
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
    if(!x) return '';
    if(x<20) return o[x]+' ';
    if(x<100) return t[Math.floor(x/10)]+(x%10?' '+o[x%10]:'')+' ';
    if(x<1000) return o[Math.floor(x/100)]+' Hundred '+w(x%100);
    if(x<100000) return w(Math.floor(x/1000))+'Thousand '+w(x%1000);
    if(x<10000000) return w(Math.floor(x/100000))+'Lakh '+w(x%100000);
    return w(Math.floor(x/10000000))+'Crore '+w(x%10000000);
  }
  return w(n).trim()+' Rupees Only';
}
