'use strict';
(function(root){
  const STR={
    it:{
      unsaved:'* NON SALVATO ',saved:'Salvato ',open:'Aperto ',newf:'Nuovo file ',
      clickFile:'Clicca un file per aprirlo.',page:'Pag',install:'Installa app',
      syncNow:'Sincronizza ora',lastSync:'Ultima sync:',spellErr:'SpellStar:',
      redo:'Ripristinato',macroRec:'Macro registrata',macroRun:'Macro eseguita',
      diff:'Diff:',preview:'Anteprima MailMerge OK?'
    },
    en:{
      unsaved:'* UNSAVED ',saved:'Saved ',open:'Opened ',newf:'New file ',
      clickFile:'Click a file to open it.',page:'Page',install:'Install app',
      syncNow:'Sync now',lastSync:'Last sync:',spellErr:'SpellStar:',
      redo:'Redone',macroRec:'Macro recorded',macroRun:'Macro run',
      diff:'Diff:',preview:'MailMerge preview OK?'
    }
  };
  const TEMPLATES={
    'LETTERA.CIO':'Gentile {NOME},\n\n{TESTO}\n\nCordiali saluti,\n{MITTENTE}\n',
    'INVITO.CIO':'Sei invitato/a {NOME}!\n\nData: {DATA}\nLuogo: {LUOGO}\n\nConferma entro {SCADENZA}.\n'
  };
  const SPELL_EXTRA='questo quello quella quelli quelle anche perché perchè cioè cioe quindi oppure inoltre tuttavia però pero abbastanza proprio ancora sempre mai poi dove quando come quale quale quale quale'.split(/\s+/);

  function t(key){ const lang=(root.VSF&&VSF.cfg.lang)||'it'; return (STR[lang]||STR.it)[key]||key; }

  function themeFG(cfg){
    if(!cfg||cfg.theme==='green')return cfg&&cfg.theme==='green'?'#33ff33':'#ffffff';
    if(cfg.theme==='amber')return '#ffb000';
    return '#ffffff';
  }

  function applyTheme(cfg){
    const fg=themeFG(cfg);
    document.documentElement.style.setProperty('--vs-fg',fg);
    document.body.classList.toggle('crt-off',cfg&&cfg.crtOff);
    document.body.classList.toggle('theme-green',cfg&&cfg.theme==='green');
    document.body.classList.toggle('theme-amber',cfg&&cfg.theme==='amber');
    const crt=document.getElementById('crt');
    if(crt)crt.style.display=cfg&&cfg.crtOff?'none':'';
  }

  function cycleTheme(cfg){
    const p=['white','green','amber'];
    cfg.theme=p[(p.indexOf(cfg.theme||'white')+1)%p.length];
    applyTheme(cfg);
    return cfg.theme;
  }

  function textDiff(a,b){
    const la=String(a||'').split('\n'), lb=String(b||'').split('\n');
    let add=0,del=0;
    const max=Math.max(la.length,lb.length);
    for(let i=0;i<max;i++){
      if(la[i]===lb[i])continue;
      if(la[i]===undefined)add++;
      else if(lb[i]===undefined)del++;
      else{ add++; del++; }
    }
    return {add,del,lines:max};
  }

  function buildSpellSet(cfg){
    const s=new Set(root.VSLib.IT_SET);
    SPELL_EXTRA.forEach(w=>s.add(w));
    (cfg.userDict||[]).forEach(w=>s.add(String(w).toLowerCase()));
    return s;
  }

  function findSpellMarks(doc,set){
    const marks=[];
    (doc||[]).forEach((line,ln)=>{
      const re=/[A-Za-zÀ-ÿ']{2,}/g; let m;
      while((m=re.exec(line))){
        const w=m[0];
        if(!set.has(w.toLowerCase()))marks.push({ln,start:m.index,end:m.index+w.length,word:w});
      }
    });
    return marks;
  }

  function nextSpellMark(marks,from){
    if(!marks.length)return null;
    const pos=from||{ln:0,col:0};
    for(let i=0;i<marks.length;i++){
      const m=marks[i];
      if(m.ln>pos.ln||(m.ln===pos.ln&&m.start>=pos.col))return m;
    }
    return marks[0];
  }

  function addUserWord(cfg,word){
    const w=String(word||'').toLowerCase().trim();
    if(!w||w.length<2)return;
    if(!cfg.userDict)cfg.userDict=[];
    if(cfg.userDict.indexOf(w)<0)cfg.userDict.push(w);
  }

  function editDist(a,b){
    const m=a.length,n=b.length;
    const dp=new Array(n+1);
    for(let j=0;j<=n;j++)dp[j]=j;
    for(let i=1;i<=m;i++){
      let prev=dp[0]; dp[0]=i;
      for(let j=1;j<=n;j++){
        const tmp=dp[j];
        dp[j]=a[i-1]===b[j-1]?prev:1+Math.min(prev,dp[j],dp[j-1]);
        prev=tmp;
      }
    }
    return dp[n];
  }

  function suggestWords(word,set,max){
    const w=String(word||'').toLowerCase();
    if(!w||w.length<2)return [];
    const out=[];
    set.forEach(dict=>{
      if(dict===w)return;
      if(dict[0]!==w[0]&&editDist(w,dict)>2)return;
      const d=editDist(w,dict);
      if(d<=2||(dict.startsWith(w.slice(0,3))&&Math.abs(dict.length-w.length)<=2))out.push({word:dict,d});
    });
    out.sort((a,b)=>a.d-b.d||a.word.length-b.word.length);
    return out.slice(0,max||5).map(x=>x.word);
  }

  function runTests(){
    const tests=[];
    function test(name,fn){ try{ fn(); tests.push({name,ok:true}); }catch(e){ tests.push({name,ok:false,err:e.message}); } }
    test('textDiff equal',()=>{ const d=textDiff('a\nb','a\nb'); if(d.add||d.del)throw new Error('diff'); });
    test('textDiff change',()=>{ const d=textDiff('a','a\nb'); if(!d.add)throw new Error('add'); });
    test('findSpellMarks',()=>{ const s=new Set(['ciao']); const m=findSpellMarks(['xyz ciao'],s); if(m.length!==1)throw new Error('marks'); });
    test('suggestWords',()=>{ const s=new Set(['casa','caso','caro']); const g=suggestWords('casa',s,3); if(!g.length)throw new Error('suggest'); });
    test('addUserWord',()=>{ const c={userDict:[]}; addUserWord(c,'Test'); if(c.userDict[0]!=='test')throw new Error('dict'); });
    return tests;
  }

  function ensureTemplates(disk){
    Object.keys(TEMPLATES).forEach(n=>{ if(!disk[n])disk[n]=TEMPLATES[n]; });
  }

  function macroRecord(cfg,steps){ cfg.macro=steps||[]; }
  function macroRun(steps,dispatchFn){
    if(!steps||!steps.length)return;
    steps.forEach(s=>{ try{ dispatchFn(s); }catch(e){} });
  }

  let deferredInstall=null;
  function setupInstallPrompt(){
    root.addEventListener('beforeinstallprompt',e=>{
      e.preventDefault();
      deferredInstall=e;
    });
  }
  async function promptInstall(){
    if(!deferredInstall)return false;
    deferredInstall.prompt();
    await deferredInstall.userChoice;
    deferredInstall=null;
    return true;
  }

  root.VSExt={
    t,TEMPLATES,themeFG,applyTheme,cycleTheme,textDiff,
    buildSpellSet,findSpellMarks,nextSpellMark,addUserWord,suggestWords,
    ensureTemplates,macroRecord,macroRun,setupInstallPrompt,promptInstall,runTests
  };
})(typeof window!=='undefined'?window:globalThis);
