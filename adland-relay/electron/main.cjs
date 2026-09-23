const {app,BrowserWindow,ipcMain,clipboard}=require('electron');const path=require('path');
function make(){const w=new BrowserWindow({width:1320,height:840,minWidth:980,minHeight:620,frame:false,backgroundColor:'#080a0e',webPreferences:{preload:path.join(__dirname,'preload.cjs'),contextIsolation:true,nodeIntegration:false}});w.loadFile(path.join(__dirname,'../src/index.html'));return w}
app.whenReady().then(make);app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit()});
ipcMain.handle('window',(e,a)=>{const w=BrowserWindow.fromWebContents(e.sender);if(a==='min')w?.minimize();else if(a==='max')w?.isMaximized()?w.unmaximize():w?.maximize();else if(a==='close')w?.close()});
ipcMain.handle('clipboard:read',()=>clipboard.readText());ipcMain.handle('clipboard:write',(_,t)=>{clipboard.writeText(String(t||''));return true});
