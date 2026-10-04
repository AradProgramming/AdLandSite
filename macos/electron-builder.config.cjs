const slug=process.env.ADLAND_APP_SLUG||"nexus";
const meta={
  "ai-tools":["AdLand AI Tools","com.adland.tools","AdLand-AI-Tools"],
  "nexus":["AdLand Nexus","com.adland.nexus","AdLand-Nexus"],
  "canvas":["AdLand Canvas","com.adland.canvas","AdLand-Canvas"],
  "pulse":["AdLand Pulse","com.adland.pulse","AdLand-Pulse"],
  "frame":["AdLand Frame","com.adland.frame","AdLand-Frame"],
  "atlas":["AdLand Atlas","com.adland.atlas","AdLand-Atlas"],
  "forge":["AdLand Forge","com.adland.forge","AdLand-Forge"],
  "prism":["AdLand Prism","com.adland.prism","AdLand-Prism"],
  "relay":["AdLand Relay","com.adland.relay","AdLand-Relay"],
  "echo":["AdLand Echo","com.adland.echo","AdLand-Echo"],
  "chrono":["AdLand Chrono","com.adland.chrono","AdLand-Chrono"],
  "orbit":["AdLand Orbit","com.adland.orbit","AdLand-Orbit"]
};
const [productName,appId,fileBase]=meta[slug]||meta.nexus;
module.exports={
  appId,productName,
  directories:{output:"dist"},
  files:["main.cjs","site/**/*"],
  asar:true,
  mac:{
    target:[
      {target:"dmg",arch:["universal"]},
      {target:"zip",arch:["universal"]}
    ],
    category:"public.app-category.utilities",
    artifactName:fileBase+"-1.0.0-${arch}.${ext}"
  },
  dmg:{title:productName+" · AdLand Studio",window:{width:640,height:420}},
  publish:null
};
