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
  return roots.flatMap(dir=>[
    path.join(dir,name+'.exe'),
    path.join(dir,'resources','app.asar','package.json'),
    path.join(dir,'app.asar','package.json')
  ]);
}
function readInstalled(name){
  for(const p of candidates(name)){
    try{
      if(p.endsWith('package.json')) {
        const pkg=JSON.parse(fs.readFileSync(p,'utf8'));
        if(pkg.name||pkg.version)return {version:String(pkg.version||''),path:p};
      } else if(fs.existsSync(p)) return {version:'installed',path:p};
    }catch{}
  }
  return null;
}
ipcMain.handle('scan-installed',(_,names)=>{
  const out={}; for(const name of (Array.isArray(names)?names:[])) out[name]=readInstalled(String(name)); return out;
});
ipcMain.handle('launch-app',(_,name)=>{
  const hit=readInstalled(String(name));
  if(!hit) return {ok:false,error:'Application is not installed in a standard Windows location.'};
  const exe=hit.path.endsWith('package.json')?path.join(path.dirname(path.dirname(hit.path)),String(name)+'.exe'):hit.path;
  try{shell.openPath(exe);return {ok:true,path:exe}}catch(err){return {ok:false,error:err.message}};
});
