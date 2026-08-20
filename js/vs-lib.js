'use strict';
/* Libreria pura VaaardStar — testabile senza DOM */
(function(root){
  const IT_WORDS=(
    'a abbandona abbandonare abilitare accedere account ad affinché dopo aggiungere aiutare aiuto al alcuni all altre altri altro ancora andare anno ans avere avete avrebbe avuto azione backup barca base bello bene buono caffè casa caso cerca cercare certo chi cio città cliccate collega collegare come commercio computer con concetto configurare connesso contenuto conto controllo copia copiare corretto cosa così creare cui da dal dare data dati deve devono di dice diceva dire direttamente disco documento documenti dove due durante e ed editor effetti email errore esempio essa essere estensione fa facile fai fanno far fare fatto file fin fine fino forse forma formato frase fuori generale gestire già giorno giu grande ha hai hanno have help here i il importa importare in indietro info informazioni insieme internet io italiano l la lasciare le lei li libero linea link lista lo locale lontano lui lungo ma mail mailmerge mai male margine menu merge mio modo molti molto mondo mostra nascosto ne nel nello no noi nome non nostro nuovo o offline ogni ok oltre online oppure opzioni ora origine ogni pagina parola parole parte passa per perché periodo persona piattaforma piattaforme piu più pochi poi popolare porta posizione possibile potere premere premendo prima prime primo prodotto programma proprio può puo pure qualche quando quasi quello questa questi questo qui riga righe righello salva salvare salvataggio sarà scrivere scrivi scrivo scuola se secondo sempre senza serve si sia sicuro signore sinistra sistema solo sono sotto sopra spazio speciale spellstar stato stesso su sua suo sync tab tastiera tempo testo ti trova trovare tu tutta tutte tutti tutto uguale ultimo una uno usa usare utente utenti vaaardstar va vada vanno vari versione versioni via voglio volte vostro wordstar wrap zip'
  ).split(/\s+/);
  const IT_SET=new Set(IT_WORDS);

  function normDiskName(name,isDoc,ext){
    ext=ext||'.CIO';
    name=(name||'').toUpperCase().trim().replace(/[^A-Z0-9._\-]/g,'').slice(0,12);
    if(!name)return'';
    if(name.indexOf('.')<0)name+=(isDoc!==false?ext:'.DAT');
    return name;
  }
  function diskNameFromFile(name,ext){
    ext=ext||'.CIO';
    const base=(name||'UNNAMED').split(/[\\/]/).pop()||'UNNAMED';
    let n=base.toUpperCase().replace(/[^A-Z0-9._\-]/g,'').slice(0,12);
    if(n.indexOf('.')<0)n+=ext;
    return n;
  }
  function simpleHash(str){
    let h=2166136261;
    for(let i=0;i<str.length;i++){ h^=str.charCodeAt(i); h=Math.imul(h,16777619); }
    return (h>>>0).toString(16);
  }
  function countWords(text){
    const t=String(text||'').replace(/\r/g,'');
    const words=t.match(/[A-Za-zÀ-ÿ0-9']+/g)||[];
    const chars=t.replace(/\n/g,'').length;
    const lines=t.split('\n').length;
    return {words:words.length,chars,lines,paragraphs:t.split(/\n\s*\n/).filter(Boolean).length};
  }
  function extractWords(text){
    return (String(text||'').match(/[A-Za-zÀ-ÿ']{2,}/g)||[]);
  }
  function spellUnknown(text){
    const seen=new Set(), bad=[];
    extractWords(text).forEach(w=>{
      const k=w.toLowerCase();
      if(seen.has(k))return;
      seen.add(k);
      if(!IT_SET.has(k))bad.push(w);
    });
    return bad;
  }
  function parseCsvLine(line){
    const out=[]; let cur='', q=false;
    for(let i=0;i<line.length;i++){
      const c=line[i];
      if(c==='"'){ q=!q; continue; }
      if((c===','||c===';')&&!q){ out.push(cur); cur=''; continue; }
      cur+=c;
    }
    out.push(cur);
    return out.map(s=>s.trim());
  }
  function parseCsv(text){
    const lines=String(text||'').replace(/\r/g,'').split('\n').filter(l=>l.trim());
    if(!lines.length)return {headers:[],rows:[]};
    const headers=parseCsvLine(lines[0]).map(h=>h.toUpperCase().replace(/[^A-Z0-9_]/g,''));
    const rows=lines.slice(1).map(l=>parseCsvLine(l));
    return {headers,rows};
  }
  function mailMerge(template, headers, row){
    let out=String(template||'');
    headers.forEach((h,i)=>{
      const val=row[i]!==undefined?row[i]:'';
      out=out.split('{'+h+'}').join(val);
      out=out.split('{'+h.toLowerCase()+'}').join(val);
    });
    return out;
  }
  function mergeAll(template, csvText){
    const {headers,rows}=parseCsv(csvText);
    return rows.map((row,i)=>({index:i+1,content:mailMerge(template,headers,row),row}));
  }
  function escapeHtml(s){
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  const tests=[];
  function test(name,fn){
    try{ fn(); tests.push({name,ok:true}); }
    catch(e){ tests.push({name,ok:false,err:e.message}); }
  }
  function runTests(){
    test('normDiskName doc',()=>{ if(normDiskName('test',true)!=='TEST.CIO')throw new Error(normDiskName('test',true)); });
    test('diskNameFromFile',()=>{ if(diskNameFromFile('a/b.cio')!=='B.CIO')throw new Error('bad'); });
    test('countWords',()=>{ const c=countWords('uno due\n tre'); if(c.words!==3)throw new Error(c.words); });
    test('mailMerge',()=>{ const o=mailMerge('Ciao {NOME}',['NOME'],['Luigi']); if(o!=='Ciao Luigi')throw new Error(o); });
    test('parseCsv',()=>{ const p=parseCsv('NOME\nLuigi\nAnna'); if(p.rows.length!==2)throw new Error('rows'); });
    test('simpleHash',()=>{ if(!simpleHash('x'))throw new Error('hash'); });
    return tests;
  }

  root.VSLib={
    IT_SET,normDiskName,diskNameFromFile,simpleHash,countWords,extractWords,spellUnknown,
    parseCsv,parseCsvLine,mailMerge,mergeAll,escapeHtml,runTests
  };
})(typeof window!=='undefined'?window:globalThis);
