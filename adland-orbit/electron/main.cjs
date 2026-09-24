const {app,BrowserWindow,ipcMain,nativeTheme,shell}=require('electron');
const path=require('path'),https=require('https'),fs=require('fs'),{spawn}=require('child_process');let win;
const repo='AradProgramming/AdLandSite';
const products={
Nexus:{version:'1.4.4',tag:'v1.4.4',installer:'AdLand-Nexus-1.4.4-Setup.exe',portable:'AdLand-Nexus-1.4.4-Portable.exe',filePrefix:'AdLand-Nexus-',site:'nexus/'},
Canvas:{version:'1.1.1',tag:'canvas-v1.1.1',installer:'AdLand-Canvas-1.1.1-Setup.exe',portable:'AdLand-Canvas-1.1.1-Portable.exe',filePrefix:'AdLand-Canvas-',site:'canvas/'},
Pulse:{version:'1.0.3',tag:'pulse-v1.0.3',installer:'AdLand-Pulse-1.0.3-Setup.exe',portable:'AdLand-Pulse-1.0.3-Portable.exe',filePrefix:'AdLand-Pulse-',site:'pulse/'},
Frame:{version:'1.1.3',tag:'frame-v1.1.3',installer:'AdLand-Frame-1.1.3-Setup.exe',portable:'AdLand-Frame-1.1.3-Portable.exe',filePrefix:'AdLand-Frame-',site:'frame/'},
Atlas:{version:'1.0.1',tag:'atlas-v1.0.1',installer:'Atlas-1.0.1-Setup.exe',portable:'Atlas-1.0.1-Portable.exe',filePrefix:'Atlas-',site:'atlas/'},
Forge:{version:'1.0.1',tag:'forge-v1.0.1',installer:'Forge-1.0.1-Setup.exe',portable:'Forge-1.0.1-Portable.exe',filePrefix:'Forge-',site:'forge/'},
Prism:{version:'1.0.1',tag:'prism-v1.0.1',installer:'Prism-1.0.1-Setup.exe',portable:'Prism-1.0.1-Portable.exe',filePrefix:'Prism-',site:'prism/'},
Relay:{version:'1.0.0',tag:'relay-v1.0.0',installer:'Relay-1.0.0-Setup.exe',portable:'Relay-1.0.0-Portable.exe',filePrefix:'Relay-',site:'relay/'},
Chrono:{version:'1.0.0',tag:'chrono-v1.0.0',installer:'Chrono-1.0.0-Setup.exe',portable:'Chrono-1.0.0-Portable.exe',filePrefix:'Chrono-',site:'chrono/'},
Echo:{version:'1.0.0',tag:'echo-v1.0.0',installer:'Echo-1.0.0-Setup.exe',portable:'Echo-1.0.0-Portable.exe',filePrefix:'Echo-',site:'echo/'},
Orbit:{version:'1.0.1',tag:'orbit-v1.0.1',installer:'Orbit-1.0.1-Setup.exe',portable:'Orbit-1.0.1-Portable.exe',filePrefix:'Orbit-',site:'orbit/'}
};
\nconst executableMap={Nexus:'adland-nexus',Canvas:'adland-canvas',Pulse:'adland-pulse',Frame:'adland-frame',Atlas:'adland-atlas',Forge:'adland-forge',Prism:'adland-prism',Relay:'adland-relay',Chrono:'adland-chrono',Echo:'adland-echo',Orbit:'adland-orbit'};\nfunction findInstalled(name){const pkg=executableMap[name]||('adland-'+name.toLowerCase()),roots=[];for(const base of [process.env.LOCALAPPDATA,process.env.ProgramFiles,process.env['ProgramFiles(x86)']]){if(!base)continue;for(const dir of [name,pkg]){roots.push(path.join(base,'Programs',dir,name+'.exe'));roots.push(path.join(base,'Programs',dir,pkg+'.exe'));roots.push(path.join(base,dir,name+'.exe'));roots.push(path.join(base,dir,pkg+'.exe'));}}return [...new Set(roots)].find(x=>fs.existsSync(x))||null}\nfunction launchInstalled(name){const exe=findInstalled(name);if(!exe)return {ok:false,notInstalled:true};try{const child=spawn(exe,[],{detached:true,stdio:'ignore',windowsHide:false});child.unref();return {ok:true,path:exe}}catch(e){return {ok:false,error:e.message||'Launch failed'}}}\nfunction create(){win=new BrowserWindow({width:1460,height:920,minWidth:1040,minHeight:680,frame:false,show:false,backgroundColor:'#05070a',autoHideMenuBar:true,webPreferences:{preload:path.join(__dirname,'preload.cjs'),contextIsolation:true,nodeIntegration:false,sandbox:true}});win.loadFile(path.join(__dirname,'../src/index.html'));win.once('ready-to-show',()=>win.show())}
function json(url){return new Promise((resolve,reject)=>{const req=https.get(url,{headers:{'User-Agent':'Orbit-AdLand'}},res=>{let d='';res.on('data',x=>d+=x);res.on('end',()=>{if(res.statusCode<200||res.statusCode>=300)return reject(new Error('HTTP '+res.statusCode));try{resolve(JSON.parse(d))}catch(e){reject(e)}})});req.on('error',reject);req.setTimeout(9000,()=>req.destroy(new Error('Request timeout')))})}
ipcMain.handle('window',(_,a)=>{if(!win)return false;if(a==='min')win.minimize();else if(a==='max')win.isMaximized()?win.unmaximize():win.maximize();else if(a==='close')win.close();return win.isMaximized()});
ipcMain.handle('open',(_,url)=>{if(typeof url!=='string')return false;shell.openExternal(url);return true});\nipcMain.handle('launch-app',(_,name)=>{if(!products[name])return {ok:false,error:'Unknown application'};return launchInstalled(name)});
ipcMain.handle('check-updates',async()=>{
  const out={ok:false,checkedAt:new Date().toISOString(),items:[],error:null};
  function ver(s){const m=String(s||'').match(/(\d+)\.(\d+)\.(\d+)/);return m?[+m[1],+m[2],+m[3]]:[0,0,0]}
  function cmp(a,b){for(let i=0;i<3;i++){if(a[i]!==b[i])return a[i]-b[i]}return 0}
  try{
    const rows=await json('https://api.github.com/repos/'+repo+'/releases?per_page=40');
    for(const [name,p] of Object.entries(products)){
      const matches=rows.filter(r=>(r.assets||[]).some(a=>a.name.startsWith(p.filePrefix)));
      let best=null,bestV=[0,0,0];
      for(const r of matches){const asset=r.assets.find(a=>a.name.startsWith(p.filePrefix)&&a.name.includes('-Setup.exe'));const v=ver(asset?.name||r.name);if(!best||cmp(v,bestV)>0){best=r;bestV=v}}
      const latest=best?bestV.join('.'):p.version;
      const setup=best?.assets?.find(a=>a.name.includes('-Setup.exe'))?.name||p.installer;
      const portable=best?.assets?.find(a=>a.name.includes('-Portable.exe'))?.name||p.portable;
      out.items.push({name,local:p.version,latest,tag:best?.tag_name||p.tag,published:best?.published_at||null,available:!!best,
        installer:best?('https://github.com/'+repo+'/releases/download/'+best.tag_name+'/'+setup):('https://github.com/'+repo+'/releases/download/'+p.tag+'/'+p.installer),
        portable:best?('https://github.com/'+repo+'/releases/download/'+best.tag_name+'/'+portable):('https://github.com/'+repo+'/releases/download/'+p.tag+'/'+p.portable),
        releaseUrl:best?.html_url||('https://github.com/'+repo+'/releases/tag/'+p.tag)});
    }
    out.ok=true;
  }catch(e){
    out.error=e.message||'Offline';
    out.items=Object.entries(products).map(([name,p])=>({name,local:p.version,latest:p.version,tag:p.tag,available:false,
      installer:'https://github.com/'+repo+'/releases/download/'+p.tag+'/'+p.installer,
      portable:'https://github.com/'+repo+'/releases/download/'+p.tag+'/'+p.portable,
      releaseUrl:'https://github.com/'+repo+'/releases/tag/'+p.tag}));
  }
  return out;
});
app.whenReady().then(()=>{nativeTheme.themeSource='dark';create()});
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit()});