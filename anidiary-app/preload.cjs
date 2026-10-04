const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("aniDesktop",{
  minimize:()=>ipcRenderer.invoke("window:minimize"),
  toggleMaximize:()=>ipcRenderer.invoke("window:maximize"),
  close:()=>ipcRenderer.invoke("window:close"),
  isMaximized:()=>ipcRenderer.invoke("window:isMaximized"),
  openExternal:(url)=>ipcRenderer.invoke("shell:openExternal",url)
});
