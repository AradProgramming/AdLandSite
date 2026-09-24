const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('vertex',{
  window:{min:()=>ipcRenderer.invoke('window','min'),max:()=>ipcRenderer.invoke('window','max'),close:()=>ipcRenderer.invoke('window','close')},
  openExternal:url=>ipcRenderer.invoke('open-external',url),
  manifest:()=>ipcRenderer.invoke('manifest')
});