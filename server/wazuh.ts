import fs from "node:fs";
import https from "node:https";

const API_URL = process.env.WAZUH_API_URL || "https://127.0.0.1:55000";
const API_USER = process.env.WAZUH_API_USER || "";
const API_PASSWORD = process.env.WAZUH_API_PASSWORD || "";
const INDEXER_URL = process.env.WAZUH_INDEXER_URL || "https://127.0.0.1:9200";
const INDEXER_USER = process.env.WAZUH_INDEXER_USER || "";
const INDEXER_PASSWORD = process.env.WAZUH_INDEXER_PASSWORD || "";
const ALERTS_FILE = process.env.WAZUH_ALERTS_FILE || "/var/ossec/logs/alerts/alerts.json";
const INSECURE_TLS = process.env.WAZUH_INSECURE_TLS === "true";
const agent = new https.Agent({ rejectUnauthorized: !INSECURE_TLS });
let token = "";
let tokenExpiresAt = 0;

async function fetchHttps(url:string, init:RequestInit = {}, basic?:{user:string,password:string}) {
  const headers = new Headers(init.headers);
  if (basic) headers.set("Authorization", "Basic " + Buffer.from(basic.user + ":" + basic.password).toString("base64"));
  return new Promise<any>((resolve,reject)=>{
    const u=new URL(url);
    const req=https.request({hostname:u.hostname,port:u.port,path:u.pathname+u.search,method:init.method||"GET",headers:Object.fromEntries(headers.entries()),agent},res=>{
      let body=""; res.on("data",c=>body+=c); res.on("end",()=>{if((res.statusCode||500)>=400) return reject(new Error("Wazuh request "+res.statusCode+": "+body.slice(0,500))); try{resolve(body?JSON.parse(body):{});}catch{resolve(body);}});
    });
    req.on("error",reject); if(init.body) req.write(init.body as string); req.end();
  });
}
async function getToken() {
  if(token && Date.now()<tokenExpiresAt) return token;
  if(!API_USER || !API_PASSWORD) throw new Error("WAZUH_API_USER/WAZUH_API_PASSWORD not configured");
  const data=await fetchHttps(API_URL+"/security/user/authenticate?raw=true",{method:"POST"},{user:API_USER,password:API_PASSWORD});
  token=typeof data==="string"?data:data?.data?.token;
  tokenExpiresAt=Date.now()+8*60*1000;
  if(!token) throw new Error("Wazuh API did not return a JWT");
  return token;
}
export async function wazuhGet(path:string){
  const jwt=await getToken();
  return fetchHttps(API_URL+path,{headers:{Authorization:"Bearer "+jwt}});
}
export async function getAgents(){
  const r=await wazuhGet("/agents?limit=1000&sort=-status,name");
  return r?.data?.affected_items ?? [];
}
export async function getManagerInfo(){ return wazuhGet("/manager/info"); }
export async function getVulnerabilities(limit=100){
  if(!INDEXER_USER || !INDEXER_PASSWORD) return [];
  const body=JSON.stringify({size:limit,query:{match_all:{}}});
  const r=await fetchHttps(INDEXER_URL+"/wazuh-states-vulnerabilities*/_search",{method:"POST",headers:{"Content-Type":"application/json"},body},{user:INDEXER_USER,password:INDEXER_PASSWORD});
  return (r?.hits?.hits||[]).map((h:any)=>({id:h._id,index:h._index,...(h._source||{})}));
}
export function tailAlerts(onAlert:(a:any)=>void){
  if(!fs.existsSync(ALERTS_FILE)) return ()=>{};
  let position=fs.statSync(ALERTS_FILE).size;
  const timer=setInterval(()=>{
    try{
      const stat=fs.statSync(ALERTS_FILE);
      if(stat.size<position) position=0;
      if(stat.size===position) return;
      const fd=fs.openSync(ALERTS_FILE,"r"); const buf=Buffer.alloc(stat.size-position);
      fs.readSync(fd,buf,0,buf.length,position); fs.closeSync(fd); position=stat.size;
      for(const line of buf.toString("utf8").split("\n")){if(!line.trim())continue;try{onAlert(JSON.parse(line));}catch{}}
    }catch{}
  },1000);
  return ()=>clearInterval(timer);
}
export function normalizeAlert(a:any){
  const level=Number(a?.rule?.level||0);
  return {id:String(a?.id||a?.timestamp||Date.now()),timestamp:a?.timestamp||new Date().toISOString(),
    severity:level>=12?"CRITICAL":level>=9?"HIGH":level>=6?"MEDIUM":"LOW",
    ruleId:String(a?.rule?.id||""),ruleName:a?.rule?.description||"Wazuh alert",
    agentId:a?.agent?.id||"000",endpoint:a?.agent?.name||a?.agent?.ip||"manager",
    sourceIp:a?.data?.srcip||a?.srcip||a?.data?.win?.eventdata?.IpAddress||"",
    destinationIp:a?.data?.dstip||"",mitreTechnique:a?.rule?.mitre?.id?.[0]||"",
    status:"NEW",fullEvent:a};
}