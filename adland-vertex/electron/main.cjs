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
