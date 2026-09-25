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
      let body=""; res.on("data",c=>body+=c); res.on("end",()=>{if((res.statusCode||500)>=400)return reject(new Error("Wazuh request "+res.statusCode+": "+body.slice(0,500)));try{resolve(body?JSON.parse(body):{});}catch{resolve(body);}});
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
export async function wazuhGet(path:string){ const jwt=await getToken(); return fetchHttps(API_URL+path,{headers:{Authorization:"Bearer "+jwt}}); }
export async function indexerGet(path:string){
  if(!INDEXER_USER || !INDEXER_PASSWORD) throw new Error("WAZUH_INDEXER_USER/WAZUH_INDEXER_PASSWORD not configured");
  return fetchHttps(INDEXER_URL+path,{}, {user:INDEXER_USER,password:INDEXER_PASSWORD});
}
export async function indexerSearch(index:string,body:any){
  if(!INDEXER_USER || !INDEXER_PASSWORD) throw new Error("WAZUH_INDEXER_USER/WAZUH_INDEXER_PASSWORD not configured");
  return fetchHttps(INDEXER_URL+"/"+index+"/_search",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)},{user:INDEXER_USER,password:INDEXER_PASSWORD});
}
export async function getAgents(){ const r=await wazuhGet("/agents?limit=1000&sort=-status,name"); return r?.data?.affected_items ?? []; }
export async function getManagerInfo(){ return wazuhGet("/manager/info"); }
export async function getIndexerHealth(){ return indexerGet("/_cluster/health"); }

function normalizeVulnerability(h:any){
  const s=h?._source||{};
  const cve=s.vulnerability?.id||s.vulnerability?.reference||s.cve||s.id||h?._id||"Unknown";
  const score=Number(s.vulnerability?.score?.base||s.vulnerability?.cvss?.base_score||s.cvss?.score||s.score||0);
  const severity=String(s.vulnerability?.severity||s.severity||"unknown").toLowerCase();
  return {
    id:String(h?._id||cve), cveId:String(cve), cvssScore:Number.isFinite(score)?score:0,
    severity, description:String(s.vulnerability?.description||s.description||"Vulnerability detected by Wazuh"),
    vendor:String(s.package?.vendor||s.vendor||s.software?.vendor||"Unknown"),
    product:String(s.package?.name||s.product||s.software?.name||"Unknown"),
    affectedAssets:[s.agent?.name||s.agent?.id||s.host?.name||"endpoint"].filter(Boolean),
    patchStatus:String(s.vulnerability?.status||s.status||"Unresolved").toLowerCase().replace("resolved","completed").replace("unresolved","pending")
  };
}
export async function getVulnerabilities(limit=100){
  const r=await indexerSearch("wazuh-states-vulnerabilities-*",{size:Math.min(Math.max(limit,1),500),sort:[{"@timestamp":{"order":"desc","unmapped_type":"date"}}],query:{match_all:{}}});
  return (r?.hits?.hits||[]).map(normalizeVulnerability);
}
export async function getHistoricalAlerts(limit=100){
  const r=await indexerSearch("wazuh-alerts-*",{size:Math.min(Math.max(limit,1),500),sort:[{"timestamp":{"order":"desc","unmapped_type":"date"}}],query:{match_all:{}}});
  return (r?.hits?.hits||[]).map((h:any)=>normalizeAlert(h?._source||{}));
}
export function tailAlerts(onAlert:(a:any)=>void){
  if(!fs.existsSync(ALERTS_FILE)) return ()=>{};
  let position=fs.statSync(ALERTS_FILE).size;
  const timer=setInterval(()=>{try{
    const stat=fs.statSync(ALERTS_FILE); if(stat.size<position)position=0; if(stat.size===position)return;
    const fd=fs.openSync(ALERTS_FILE,"r"); const buf=Buffer.alloc(stat.size-position);
    fs.readSync(fd,buf,0,buf.length,position); fs.closeSync(fd); position=stat.size;
    for(const line of buf.toString("utf8").split("\n")){if(!line.trim())continue;try{onAlert(JSON.parse(line));}catch{}}
  }catch{}},1000);
  return ()=>clearInterval(timer);
}
export function normalizeAlert(a:any){
  const level=Number(a?.rule?.level||0);
  const mitre=a?.rule?.mitre;
  const techniques=mitre?.id||mitre?.technique||[];
  return {
    id:String(a?.id||a?.timestamp||Date.now()), timestamp:a?.timestamp||new Date().toISOString(),
    severity:level>=12?"CRITICAL":level>=9?"HIGH":level>=6?"MEDIUM":"LOW",
    ruleId:String(a?.rule?.id||""), ruleName:a?.rule?.description||"Wazuh alert",
    agentId:String(a?.agent?.id||"000"), endpoint:a?.agent?.name||a?.agent?.ip||"manager",
    sourceIp:a?.data?.srcip||a?.srcip||a?.data?.win?.eventdata?.IpAddress||"",
    destinationIp:a?.data?.dstip||a?.dstip||"", mitreTechnique:String(Array.isArray(techniques)?techniques[0]||"":techniques||""),
    status:"NEW", fullEvent:a
  };
}
