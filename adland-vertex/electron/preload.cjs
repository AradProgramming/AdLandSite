const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('vertex',{
  window:{min:()=>ipcRenderer.invoke('window','min'),max:()=>ipcRenderer.invoke('window','max'),close:()=>ipcRenderer.invoke('window','close')},
  openExternal:url=>ipcRenderer.invoke('open-external',url),
  manifest:()=>ipcRenderer.invoke('manifest'),scanInstalled:names=>ipcRenderer.invoke('scan-installed',names),launchApp:name=>ipcRenderer.invoke('launch-app',name),
  downloadRelease:(url,name)=>ipcRenderer.invoke('download-release',{url,name}),
  onDownloadProgress:cb=>{const fn=(_,data)=>cb(data);ipcRenderer.on('download-progress',fn);return()=>ipcRenderer.removeListener('download-progress',fn)},
  onDownloadComplete:cb=>{const fn=(_,data)=>cb(data);ipcRenderer.on('download-complete',fn);return()=>ipcRenderer.removeListener('download-complete',fn)},
  onDownloadError:cb=>{const fn=(_,data)=>cb(data);ipcRenderer.on('download-error',fn);return()=>ipcRenderer.removeListener('download-error',fn)}
});