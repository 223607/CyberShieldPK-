export interface LiveSocAlert {
  id:string; timestamp:string; severity:"CRITICAL"|"HIGH"|"MEDIUM"|"LOW"; ruleId:string; ruleName:string;
  agentId:string; endpoint:string; sourceIp:string; destinationIp:string; mitreTechnique:string; status:"NEW"; fullEvent:any;
}
const base=(import.meta.env.VITE_SOC_API_URL||"").replace(/\/$/,"");
const url=(p:string)=>base+p;
export async function getSocAlerts(){const r=await fetch(url("/api/soc/alerts"));if(!r.ok)throw new Error("SOC API unavailable");return (await r.json()).items as LiveSocAlert[];}
export async function getSocAgents(){const r=await fetch(url("/api/soc/agents"));if(!r.ok)throw new Error("SOC API unavailable");return (await r.json()).items as any[];}
export async function getSocVulnerabilities(){const r=await fetch(url("/api/soc/vulnerabilities"));if(!r.ok)throw new Error("SOC API unavailable");return (await r.json()).items as any[];}
export function subscribeSocAlerts(onAlert:(a:LiveSocAlert)=>void,onState?:(connected:boolean)=>void){
 const es=new EventSource(url("/api/soc/stream")); es.addEventListener("ready",()=>onState?.(true)); es.addEventListener("alert",(e)=>{onState?.(true);onAlert(JSON.parse((e as MessageEvent).data));}); es.onerror=()=>onState?.(false); return ()=>es.close();
}