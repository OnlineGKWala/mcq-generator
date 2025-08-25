function parseMCQs(text){
  const lines = text.split(/\n+/);
  const items = [];
  let cur = null;

  const qRe = /^\s*(\d+)[).\-]\s*(.*)$/;
  const optRe = /^\s*([A-Da-d])[).\-]?\s*(.*)$/;
  const ansRe = /^\s*(Answer|उत्तर)[:\-]\s*(.*)$/i;
  const expRe = /^\s*(Explanation|व्याख्या)[:\-]\s*(.*)$/i;

  function push(){ if(cur){ items.push(cur); } cur=null; }

  lines.forEach(l=>{
    l=l.trim(); if(!l) return;

    const qm=l.match(qRe);
    if(qm){ push(); cur={qnum:qm[1],q:qm[2],options:[],answer:"",explanation:""}; return; }

    if(!cur) return;

const am = l.match(ansRe);
if (am) {
  cur.answer = am[2];
  return;
}

const om = l.match(optRe);
if (om) {
  cur.options.push({ label: om[1].toUpperCase(), text: om[2] });
  return;
}

    const em=l.match(expRe);
    if(em){ cur.explanation=em[2]; return; }

    if(cur.explanation){ cur.explanation += " "+l; }
    else if(cur.options.length>0){ cur.options[cur.options.length-1].text += " "+l; }
    else{ cur.q += " "+l; }
  });

  push();
  return items;
}

function generate(){
  const raw=document.getElementById('raw').value;
  const parsed=parseMCQs(raw);
  let html="";
  parsed.forEach(it=>{
    let opts=it.options.map(o=>`<li>${o.text}</li>`).join("\n");
    html+=`
<p><strong>Q${it.qnum}. ${it.q}</strong></p>
<ol class="pointsa">
${opts}
</ol>
<button class="showanswer" onclick="showhide(${it.qnum})"><span id="btntext${it.qnum}">Show Answer</span></button>
<button class="workspace" onclick="showworkspace(${it.qnum})"><span id="btntext${it.qnum}">Workspace</span></button>
<div id="workspace${it.qnum}"></div>
<div class="testanswer" id="answer${it.qnum}">
${it.answer?`<p><strong>Answer:</strong> ${it.answer}</p>`:""}
${it.explanation?`<p><strong>Explanation:</strong> ${it.explanation}</p>`:""}
</div>
<hr/>\n`;
  });


  document.getElementById('output').textContent=html.trim();
  document.getElementById('preview').innerHTML=html;
}

function copyOutput(){
  navigator.clipboard.writeText(document.getElementById('output').textContent);
  alert("Copied HTML! Paste into Blogger post.");
}

function showhide(num){
  const ans=document.getElementById("answer"+num);
  if(ans.style.display==="block"){ ans.style.display="none"; document.getElementById("btntext"+num).innerText="Show Answer"; }
  else{ ans.style.display="block"; document.getElementById("btntext"+num).innerText="Hide Answer"; }
}
function showworkspace(num){
  const ws=document.getElementById("workspace"+num);
  ws.innerHTML = ws.innerHTML ? "" : "<textarea style='width:100%;height:80px'></textarea>";
}




// < > sign convert

const input = document.getElementById('inputText');
const output = document.getElementById('outputText');
const convertBtn = document.getElementById('convertBtn');

// Convert button click
convertBtn.addEventListener('click', () => {
    let converted = input.value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    output.value = converted;
    input.value = ''; // clear input
    output.focus();
    output.select();
});

// Clear output on space key press
document.addEventListener('keydown', (e) => {
     if(e.code === 'Space' || e.code === 'Backspace'){
        output.value = '';
    }
});



// URL convert

const slugInput = document.getElementById('slugInput');

slugInput.addEventListener('input', () => {
    let text = slugInput.value.trim().toLowerCase();
    let slug = text.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    slugInput.value = slug;
});
