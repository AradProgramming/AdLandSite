const {app,BrowserWindow,Menu,shell,session} = require("electron");
const path=require("path");
const product=process.env.ADLAND_APP_SLUG||"nexus";
const entry=path.join(__dirname,"site",product,"index.html");
function createWindow(){
  const win=new BrowserWindow({
    width:1440,height:900,minWidth:980,minHeight:680,
    titleBarStyle:"hiddenInset",vibrancy:"under-window",visualEffectState:"active",
    backgroundColor:"#05070a",
    webPreferences:{contextIsolation:true,nodeIntegration:false,webSecurity:true,sandbox:true}
  });
  Menu.setApplicationMenu(null);
  win.webContents.setWindowOpenHandler(({url})=>{if(/^https?:|^mailto:|^tel:/i.test(url))shell.openExternal(url);return{action:"deny"}});
  win.webContents.on("will-navigate",(event,url)=>{if(!url.startsWith("file://")){event.preventDefault();shell.openExternal(url)}});
  win.loadFile(entry);
}
app.whenReady().then(()=>{session.defaultSession.webRequest.onHeadersReceived((details,cb)=>{cb({responseHeaders:{...details.responseHeaders,"Content-Security-Policy":["default-src 'self' 'unsafe-inline' data: https:; img-src 'self' data: https:; media-src 'self' blob: data: https:; font-src 'self' data: https:; connect-src 'self' https:"]}})});createWindow();app.on("activate",()=>{if(BrowserWindow.getAllWindows().length===0)createWindow()})});
app.on("window-all-closed",()=>{if(process.platform!=="darwin")app.quit()});
