import "dotenv/config";
import express from "express";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {getAgents,getManagerInfo,getVulnerabilities,normalizeAlert,tailAlerts} from "./wazuh.js";

const app=express(); app.use(express.json({limit:"1mb"}));
const PORT=Number(process.env.PORT||8080);
const dist=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../dist");
const clients=new Set<express.Response>(); let latestAlerts:any[]=[];

app.get("/api/health",async(_req,res)=>{try{const info=await getManagerInfo();res.json({ok:true,wazuh:true,manager:info?.data});}catch(e:any){res.status(503).json({ok:false,wazuh:false,error:e.message});}});
app.get("/api/soc/summary",async(_req,res)=>{try{const agents=await getAgents();const active=agents.filter((a:any)=>a.status==="active").length;res.json({connected:true,agents:{total:agents.length,active,disconnected:agents.length-active},recentAlerts:latestAlerts.slice(0,20)});}catch(e:any){res.status(503).json({connected:false,error:e.message});}});
app.get("/api/soc/agents",async(_req,res)=>{try{res.json({items:await getAgents()});}catch(e:any){res.status(503).json({items:[],error:e.message});}});
app.get("/api/soc/alerts",async(_req,res)=>res.json({items:latestAlerts}));
app.get("/api/soc/vulnerabilities",async(req,res)=>{try{res.json({items:await getVulnerabilities(Number(req.query.limit||100))});}catch(e:any){res.status(503).json({items:[],error:e.message});}});
app.get("/api/soc/agent-install",async(req,res)=>{
  const os=String(req.query.os||"windows").toLowerCase(), manager=process.env.WAZUH_MANAGER_HOST||"YOUR_WAZUH_MANAGER_IP", version=process.env.WAZUH_AGENT_VERSION||"4.14.7";
  if(os==="linux") return res.json({os,manager,version,commands:[
    "curl -so wazuh-agent.deb https://packages.wazuh.com/4.x/apt/pool/main/w/wazuh-agent/wazuh-agent_"+version+"-1_amd64.deb",
    "sudo WAZUH_MANAGER='"+manager+"' WAZUH_AGENT_NAME='CYBERSHIELDPK-LINUX' dpkg -i ./wazuh-agent.deb",
    "sudo systemctl enable --now wazuh-agent"]});
  res.json({os:"windows",manager,version,commands:[
    "Invoke-WebRequest -Uri https://packages.wazuh.com/4.x/windows/wazuh-agent-"+version+"-1.msi -OutFile $env:TEMP\\wazuh-agent.msi",
    "Start-Process msiexec.exe -Wait -ArgumentList '/i',$env:TEMP+'\\wazuh-agent.msi','/q','WAZUH_MANAGER="+manager+"','WAZUH_AGENT_NAME=CYBERSHIELDPK-WIN11'",
    "Start-Service WazuhSvc"]});
});
app.get("/api/soc/stream",(_req,res)=>{res.writeHead(200,{"Content-Type":"text/event-stream","Cache-Control":"no-cache","Connection":"keep-alive","X-Accel-Buffering":"no"});res.write("event: ready\ndata: "+JSON.stringify({connected:true})+"\n\n");clients.add(res);res.on("close",()=>clients.delete(res));});
function publish(alert:any){const item=normalizeAlert(alert);latestAlerts=[item,...latestAlerts].slice(0,200);const payload="event: alert\ndata: "+JSON.stringify(item)+"\n\n";for(const client of clients)client.write(payload);}
tailAlerts(publish);
if(process.env.NODE_ENV==="production"){app.use(express.static(dist));app.get("*",(req,res)=>{if(req.path.startsWith("/api/"))return res.status(404).end();res.sendFile(path.join(dist,"index.html"));});}
app.listen(PORT,()=>console.log("CyberShieldPK SOC backend listening on :"+PORT));