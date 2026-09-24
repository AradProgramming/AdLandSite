const {app,BrowserWindow,ipcMain,nativeTheme,shell}=require('electron');
const path=require('path'),https=require('https');let win;
const repo='AradProgramming/AdLandSite';
const products={
Nexus:{version:'1.4.4',tag:'v1.4.4',installer:'AdLand-Nexus-1.4.4-Setup.exe',portable:'AdLand-Nexus-1.4.4-Portable.exe',site:'nexus/'},
Canvas:{version:'1.1.1',tag:'canvas-v1.1.1',installer:'AdLand-Canvas-1.1.1-Setup.exe',portable:'AdLand-Canvas-1.1.1-Portable.exe',site:'canvas/'},
Pulse:{version:'1.0.3',tag:'pulse-v1.0.3',installer:'AdLand-Pulse-1.0.3-Setup.exe',portable:'AdLand-Pulse-1.0.3-Portable.exe',site:'pulse/'},
Frame:{version:'1.1.3',tag:'frame-v1.1.3',installer:'AdLand-Frame-1.1.3-Setup.exe',portable:'AdLand-Frame-1.1.3-Portable.exe',site:'frame/'},
Atlas:{version:'1.0.1',tag:'atlas-v1.0.1',installer:'Atlas-1.0.1-Setup.exe',portable:'Atlas-1.0.1-Portable.exe',site:'atlas/'},
Forge:{version:'1.0.1',tag:'forge-v1.0.1',installer:'Forge-1.0.1-Setup.exe',portable:'Forge-1.0.1-Portable.exe',site:'forge/'},
Prism:{version:'1.0.1',tag:'prism-v1.0.1',installer:'Prism-1.0.1-Setup.exe',portable:'Prism-1.0.1-Portable.exe',site:'prism/'},
Relay:{version:'1.0.0',tag:'relay-v1.0.0',installer:'Relay-1.0.0-Setup.exe',portable:'Relay-1.0.0-Portable.exe',site:'relay/'},
Chrono:{version:'1.0.0',tag:'chrono-v1.0.0',installer:'Chrono-1.0.0-Setup.exe',portable:'Chrono-1.0.0-Portable.exe',site:'chrono/'},
Echo:{version:'1.0.0',tag:'echo-v1.0.0',installer:'Echo-1.0.0-Setup.exe',portable:'Echo-1.0.0-Portable.exe',site:'echo/'},
Orbit:{version:'1.0.1',tag:'orbit-v1.0.1',installer:'Orbit-1.0.1-Setup.exe',portable:'Orbit-1.0.1-Portable.exe',site:'orbit/'}
};
function create(){win=new BrowserWindow({width:1460,height:920,minWidth:1040,minHeight:680,frame:false,show:false,backgroundColor:'#05070a',autoHideMenuBar:true,webPreferences:{preload:path.join(__dirname,'preload.cjs'),contextIsolation:true,nodeIntegration:false,sandbox:true}});win.loadFile(path.join(__dirname,'../src/index.html'));win.once('ready-to-show',()=>win.show())}
function json(url){return new Promise((resolve,reject)=>{const req=https.get(url,{headers:{'User-Agent':'Orbit-AdLand'}},res=>{let d='';res.on('data',x=>d+=x);res.on('end',()=>{if(res.statusCode<200||res.statusCode>=300)return reject(new Error('HTTP '+res.statusCode));try{resolve(JSON.parse(d))}catch(e){reject(e)}})});req.on('error',reject);req.setTimeout(9000,()=>req.destroy(new Error('Request timeout')))})}
ipcMain.handle('window',(_,a)=>{if(!win)return false;if(a==='min')win.minimize();else if(a==='max')win.isMaximized()?win.unmaximize():win.maximize();else if(a==='close')win.close();return win.isMaximized()});
ipcMain.handle('open',(_,url)=>{if(typeof url!=='string')return false;shell.openExternal(url);return true});
ipcMain.handle('check-updates',async()=>{const out={ok:false,checkedAt:new Date().toISOString(),items:[],error:null};try{const rows=await json('https://api.github.com/repos/'+repo+'/releases?per_page=40');const map={'v1.4.4':'Nexus','canvas-v1.1.1':'Canvas','pulse-v1.0.3':'Pulse','frame-v1.1.3':'Frame','atlas-v1.0.1':'Atlas','forge-v1.0.1':'Forge','prism-v1.0.1':'Prism','relay-v1.0.0':'Relay','chrono-v1.0.0':'Chrono','echo-v1.0.0':'Echo','orbit-v1.0.1':'Orbit'};const seen={};for(const r of rows){const n=map[r.tag_name];if(n&&!seen[n])seen[n]=r}for(const [name,p] of Object.entries(products)){out.items.push({name,local:p.version,latest:p.version,tag:seen[name]?.tag_name||null,published:seen[name]?.published_at||null,available:!!seen[name]})}out.ok=true}catch(e){out.error=e.message||'Offline';out.items=Object.entries(products).map(([name,p])=>({name,local:p.version,latest:p.version,tag:p.tag,available:false}))}return out});
app.whenReady().then(()=>{nativeTheme.themeSource='dark';create()});
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit()});