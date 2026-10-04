const { app, BrowserWindow, ipcMain, shell } = require("electron");
const path = require("path");

const isMac = process.platform === "darwin";

function createWindow(){
  const win = new BrowserWindow({
    width: 1480,
    height: 940,
    minWidth: 1080,
    minHeight: 720,
    backgroundColor: "#070914",
    show: false,
    frame: false,
    title: "AniDiary",
    titleBarStyle: isMac ? "hidden" : "default",
    webPreferences:{
      contextIsolation:true,
      nodeIntegration:false,
      sandbox:true,
      preload:path.join(__dirname,"preload.cjs")
    }
  });
  win.loadFile(path.join(__dirname,"renderer","index.html"));
  win.once("ready-to-show",()=>win.show());
  win.webContents.setWindowOpenHandler(({url})=>{
    if(/^https?:/i.test(url)) shell.openExternal(url);
    return {action:"deny"};
  });
  return win;
}

app.whenReady().then(()=>{
  const win=createWindow();
  ipcMain.handle("window:minimize",()=>win.isDestroyed()?null:win.minimize());
  ipcMain.handle("window:maximize",()=>{
    if(win.isDestroyed()) return false;
    win.isMaximized()?win.unmaximize():win.maximize();
    return win.isMaximized();
  });
  ipcMain.handle("window:close",()=>{ if(!win.isDestroyed()) win.close(); });
  ipcMain.handle("window:isMaximized",()=>!win.isDestroyed() && win.isMaximized());
  ipcMain.handle("shell:openExternal",(_,url)=>{
    if(typeof url==="string" && /^https?:/i.test(url)) return shell.openExternal(url);
    return false;
  });
  app.on("activate",()=>{ if(BrowserWindow.getAllWindows().length===0) createWindow(); });
});

app.on("window-all-closed",()=>{ if(!isMac) app.quit(); });
