const {app,BrowserWindow,ipcMain,globalShortcut,nativeTheme,dialog}=require('electron');
const os=require('os'),path=require('path'),fs=require('fs/promises');let win;
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
ipcMain.handle('pickAudio',async()=>{const r=await dialog.showOpenDialog(win,{title:'Choose music / playlist',properties:['openFile','multiSelections'],filters:[{name:'Audio',extensions:['mp3','wav','ogg','m4a','aac','flac','webm']}]});if(r.canceled)return[];return Promise.all(r.filePaths.map(async p=>({path:p,name:path.basename(p),size:(await fs.stat(p)).size})))});
ipcMain.handle('readAudio',async(_,p)=>{if(typeof p!=='string')throw new Error('Invalid path');const b=await fs.readFile(p);const e=path.extname(p).slice(1).toLowerCase();const mime=e==='mp3'?'audio/mpeg':e==='wav'?'audio/wav':e==='ogg'?'audio/ogg':e==='m4a'?'audio/mp4':e==='aac'?'audio/aac':e==='flac'?'audio/flac':'audio/webm';return{data:'data:'+mime+';base64,'+b.toString('base64')}});
