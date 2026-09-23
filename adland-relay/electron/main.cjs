const {app,BrowserWindow,ipcMain,clipboard}=require('electron');const path=require('path');
function win(){const w=new BrowserWindow({width:1320,height:840,minWidth:980,minHeight:620,frame:false,backgroundColor:'#080a0e',webPreferences:{preload:path.join(__dirname,'preload.cjs'),contextIsolation:true,nodeIntegration:false}});w.loadFile(path.join(__dirname,'../src/index.html'));return w}
app.whenReady().then(()=>{win();app.on('activate',()=>{if(!BrowserWindow.getAllWindows().length)win()})});
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit()});
ipcMain.handle('window',e=>({min:()=>BrowserWindow.fromWebContents(e.sender)?.minimize(),max:()=>{const w=BrowserWindow.fromWebContents(e.sender);w?.isMaximized()?w.unmaximize():w?.maximize()},close:()=>BrowserWindow.fromWebContents(e.sender)?.close()}));
ipcMain.handle('clipboard:read',()=>clipboard.readText());
ipcMain.handle('clipboard:write',(_,text)=>{clipboard.writeText(String(text||''));return true});
