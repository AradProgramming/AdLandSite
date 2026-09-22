const {app,BrowserWindow,ipcMain,globalShortcut,nativeTheme}=require('electron');
const os=require('os'),path=require('path');let win;
function create(){
 win=new BrowserWindow({width:1440,height:900,minWidth:980,minHeight:650,frame:false,show:false,backgroundColor:'#061018',autoHideMenuBar:true,webPreferences:{preload:path.join(__dirname,'preload.cjs'),contextIsolation:true,nodeIntegration:false,sandbox:true}});
 win.loadFile(path.join(__dirname,'../src/index.html'));
 win.once('ready-to-show',()=>win.show());
}
app.whenReady().then(()=>{nativeTheme.themeSource='dark';create();globalShortcut.register('CommandOrControl+Shift+Space',()=>{win?.show();win?.focus();win?.webContents.send('palette')})});
ipcMain.handle('window',(_,a)=>{if(!win)return;if(a==='min')win.minimize();else if(a==='max')win.isMaximized()?win.unmaximize():win.maximize();else if(a==='close')win.close();return win?.isMaximized()});
ipcMain.handle('sys',()=>{const c=os.cpus();return{host:os.hostname(),cpu:c[0]?.model||'Unknown',cores:c.length,total:os.totalmem(),free:os.freemem(),release:os.release(),arch:process.arch}});
app.on('will-quit',()=>globalShortcut.unregisterAll());
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit()});