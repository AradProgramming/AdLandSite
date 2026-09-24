const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('orbit',{
  window:a=>ipcRenderer.invoke('window',a),
  open:u=>ipcRenderer.invoke('open',u),
  launchApp:name=>ipcRenderer.invoke('launch-app',name),
  checkUpdates:()=>ipcRenderer.invoke('check-updates')
});
