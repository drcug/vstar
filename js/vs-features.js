'use strict';
(function(root){
  const DEFAULTS={
    soundKeys:true,soundDisk:true,soundBoot:true,soundProfile:'classic',soundVolume:0.7,
    haptic:true,helpLevel:3,ruler:true,wrapOn:true,wrapMargin:65,wrapWidth:80,
    driveSyncAll:true,driveSyncFiles:{},recentFiles:[],versionKeep:10,
    theme:'white',crtOff:false,fontScale:1,lang:'it',bootEnabled:true,
    userDict:[],macroText:'',lastSyncAt:0,lastSyncErr:''
  };
  let CFG={...DEFAULTS};

  function mergeCfg(raw){
    CFG={...DEFAULTS,...raw};
    if(!Array.isArray(CFG.recentFiles))CFG.recentFiles=[];
    if(!Array.isArray(CFG.userDict))CFG.userDict=[];
    if(!CFG.driveSyncFiles||typeof CFG.driveSyncFiles!=='object')CFG.driveSyncFiles={};
    CFG.soundVolume=Math.max(0,Math.min(1,+CFG.soundVolume||0.7));
    CFG.wrapMargin=Math.max(40,Math.min(78,+CFG.wrapMargin||65));
    CFG.helpLevel=Math.max(0,Math.min(3,+CFG.helpLevel||3));
    CFG.fontScale=Math.max(0.6,Math.min(1.5,+CFG.fontScale||1));
    return CFG;
  }

  function applyToState(S){
    if(!S)return;
    S.helpLevel=CFG.helpLevel;
    S.ruler=CFG.ruler;
    S.wrapOn=CFG.wrapOn;
    if(root.VSExt)VSExt.applyTheme(CFG);
  }

  function haptic(ms){
    if(!CFG.haptic)return;
    try{ if(navigator.vibrate)navigator.vibrate(ms||10); }catch(e){}
  }

  function vol(v){ return v*(CFG.soundProfile==='silent'?0:CFG.soundVolume); }
  function profileMul(kind){
    if(CFG.soundProfile==='silent')return 0;
    if(CFG.soundProfile==='xt')return kind==='disk'?1.3:0.85;
    return 1;
  }
  function pushRecent(name){
    CFG.recentFiles=[name,...CFG.recentFiles.filter(n=>n!==name)].slice(0,5);
  }

  function printDocument(name,content,font,pdf){
    const html='<!DOCTYPE html><html><head><meta charset="utf-8"><title>'+
      root.VSLib.escapeHtml(name)+'</title><style>@page{margin:2cm;size:A4}body{margin:0}'+
      'pre{font-family:'+(font||'monospace')+';font-size:11pt;line-height:1.25;'+
      'white-space:pre-wrap;word-break:break-word;color:#000;background:#fff;padding:2cm}</style></head><body><pre>'+
      root.VSLib.escapeHtml(content)+'</pre></body></html>';
    const w=root.open('','_blank');
    if(!w)return false;
    w.document.open(); w.document.write(html); w.document.close();
    setTimeout(()=>{ try{ w.focus(); w.print(); }catch(e){} },pdf?500:300);
    return true;
  }

  async function saveVersion(idbPutVersion,name,content,keep){
    if(!idbPutVersion)return;
    await idbPutVersion(name,content,Date.now());
    if(typeof idbTrimVersions==='function')await idbTrimVersions(name,keep||CFG.versionKeep);
  }

  root.VSF={
    DEFAULTS,CFG,get cfg(){return CFG;},
    mergeCfg,applyToState,haptic,vol,profileMul,pushRecent,printDocument,saveVersion,
    load:async getMeta=>{ mergeCfg(await getMeta('appSettings')||{}); applyToState(null); return CFG; },
    save:async putMeta=>{ await putMeta('appSettings',CFG); }
  };
})(typeof window!=='undefined'?window:globalThis);
