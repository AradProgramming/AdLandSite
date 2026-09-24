const {app,BrowserWindow,ipcMain,shell,net}=require('electron');
const path=require('path');
const MANIFEST_URL='https://aradprogramming.github.io/AdLandSite/app-manifest.json';
function makeWindow(){
  const w=new BrowserWindow({
    width:1440,height:900,minWidth:1120,minHeight:720,frame:false,backgroundColor:'#05070a',
    webPreferences:{preload:path.join(__dirname,'preload.cjs'),contextIsolation:true,nodeIntegration:false}
  });
  w.loadFile(path.join(__dirname,'../src/index.html'));
  return w;
}
app.whenReady().then(()=>makeWindow());
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit()});
ipcMain.handle('window',(e,a)=>{const w=BrowserWindow.fromWebContents(e.sender);if(!w)return;
  if(a==='min')w.minimize();else if(a==='max')w.isMaximized()?w.unmaximize():w.maximize();else if(a==='close')w.close();
});
ipcMain.handle('open-external',(_,url)=>shell.openExternal(String(url||'')));
ipcMain.handle('manifest',async()=>{
  try{
    const res=await net.fetch(MANIFEST_URL,{headers:{'Cache-Control':'no-cache'}});
    if(!res.ok) throw new Error('HTTP '+res.status);
    return await res.json();
  }catch(err){return {error:err.message||'Network request failed'};}
});

const fs=require('fs');
function candidates(name){
  const roots=[
    process.env.LOCALAPPDATA?path.join(process.env.LOCALAPPDATA,'Programs',name):null,
    process.env.ProgramFiles?path.join(process.env.ProgramFiles,name):null,
    process.env['ProgramFiles(x86)']?path.join(process.env['ProgramFiles(x86)'],name):null
  ].filter(Boolean);
  return roots.map(dir=>({
    dir,
    pkg:path.join(dir,'resources','app.asar','package.json'),
    pkgAlt:path.join(dir,'app.asar','package.json'),
    exe:path.join(dir,name+'.exe')
  }));
}
function readInstalled(name){
  for(const x of candidates(name)){
    for(const p of [x.pkg,x.pkgAlt]){
      try{
        const pkg=JSON.parse(fs.readFileSync(p,'utf8'));
        if(pkg&&pkg.version)return {version:String(pkg.version),path:p,exe:x.exe};
      }catch{}
    }
    try{if(fs.existsSync(x.exe))return {version:'installed',path:x.exe,exe:x.exe};}catch{}
  }
  return null;
}
ipcMain.handle('scan-installed',(_,names)=>{
  const out={}; for(const name of (Array.isArray(names)?names:[])) out[name]=readInstalled(String(name)); return out;
});
ipcMain.handle('launch-app',(_,name)=>{
  const hit=readInstalled(String(name));
  if(!hit)return {ok:false,error:'Application is not installed in a standard Windows location.'};
  try{shell.openPath(hit.exe);return {ok:true,path:hit.exe}}catch(err){return {ok:false,error:err.message}};
});

const {finished}=require('stream/promises');
ipcMain.handle('download-release',async(e,args={})=>{
  try{
    const raw=String(args.url||'');
    if(!/^https:\/\/github\.com\//i.test(raw)) throw new Error('Only GitHub release downloads are supported.');
    const safeName=path.basename(String(args.name||'Orbit-download.exe')).replace(/[^a-zA-Z0-9._-]/g,'_');
    const target=path.join(app.getPath('downloads'),safeName);
    const res=await net.fetch(raw,{headers:{'Cache-Control':'no-cache'}});
    if(!res.ok) throw new Error('HTTP '+res.status);
    const out=fs.createWriteStream(target);
    const total=Number(res.headers.get('content-length'))||0;
    let received=0;
    if(!res.body) throw new Error('No response body.');
    const reader=res.body.getReader();
    try{
      while(true){
        const {done,value}=await reader.read();
        if(done)break;
        const chunk=Buffer.from(value);
        received+=chunk.length;
        if(!out.write(chunk)) await new Promise(resolve=>out.once('drain',resolve));
        e.sender.send('download-progress',{name:safeName,received,total});
      }
    }finally{reader.releaseLock()}
    out.end();
    await finished(out);
    e.sender.send('download-complete',{name:safeName,path:target});
    return {ok:true,path:target};
  }catch(err){
    e.sender.send('download-error',{name:String(args.name||'download'),error:err.message||'Download failed'});
    return {ok:false,error:err.message||'Download failed'};
  }
});
