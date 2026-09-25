# CyberShieldPK Live SOC — Wazuh Edition

## 1. Purpose

CyberShieldPK Live SOC is a frontend dashboard connected to a real Wazuh deployment. It is not intended to replace the Wazuh Manager, Indexer, or Dashboard. Instead, it provides a CyberShieldPK-specific SOC interface over Wazuh telemetry.

Wazuh central components can be installed on one Ubuntu host, and the Wazuh API is the programmatic interface used by this project.

## 2. Recommended lab architecture

```
Windows 11 / Linux endpoints
        |
        | Wazuh Agent
        v
Ubuntu 22.04 Wazuh host
  | Wazuh Manager
  | Wazuh Indexer
  | Wazuh API :55000
  | alerts.json
  | CyberShieldPK backend :8080
  v
Browser
  |
  +-- http://127.0.0.1:8080
  +-- CyberShieldPK Live SOC
```

Run the CyberShieldPK backend on the same Ubuntu Wazuh VM. This avoids exposing the Wazuh API or Indexer directly to the public Internet.

## 3. What becomes live

- Wazuh manager health
- Agent inventory and active/disconnected state
- New Wazuh alerts
- Alert severity/rule/agent/source/destination fields
- Live alert stream through Server-Sent Events
- Wazuh vulnerability inventory when Indexer credentials are configured
- Windows/Linux agent installation instructions
- SOC connection status

The dashboard must show an explicit offline/error state when Wazuh is unavailable. It must not present demo values as live telemetry.

## 4. Server configuration

Copy the repository's `.env.example` to a server-side `.env`.

Required values:

```env
WAZUH_API_URL=https://127.0.0.1:55000
WAZUH_API_USER=wazuh-wui
WAZUH_API_PASSWORD=CHANGE_ME
WAZUH_INDEXER_URL=https://127.0.0.1:9200
WAZUH_INDEXER_USER=admin
WAZUH_INDEXER_PASSWORD=CHANGE_ME
WAZUH_MANAGER_HOST=127.0.0.1
WAZUH_AGENT_VERSION=4.14.7
WAZUH_ALERTS_FILE=/var/ossec/logs/alerts/alerts.json
WAZUH_INSECURE_TLS=true
PORT=8080
```

`WAZUH_INSECURE_TLS=true` is for a lab with self-signed certificates. For a production deployment, use trusted certificates and set it to false.

Never put Wazuh credentials in a `VITE_*` variable.

## 5. Run on Ubuntu

From the project directory:

```bash
npm install
npm run build:full
npm start
```

Then open:

```
http://127.0.0.1:8080
```

For access from another machine on the same LAN, bind the server appropriately and use the Ubuntu VM IP. Do not expose ports 55000 or 9200 directly to the Internet.

## 6. Verify Wazuh before starting CyberShieldPK

```bash
sudo systemctl status wazuh-manager
sudo systemctl status wazuh-indexer
sudo systemctl status wazuh-dashboard
sudo tail -n 20 /var/ossec/logs/alerts/alerts.json
```

Check the Wazuh API:

```bash
curl -k -u USER:PASSWORD -X POST "https://127.0.0.1:55000/security/user/authenticate?raw=true"
```

Then test:

```bash
curl -k -H "Authorization: Bearer YOUR_TOKEN" "https://127.0.0.1:55000/agents?limit=10"
```

## 7. Connect a Windows 11 endpoint

Install the Wazuh agent on Windows and configure the Wazuh Manager address to the Ubuntu Wazuh server IP. Start the Wazuh service and confirm the agent appears in Wazuh.

After the agent becomes active, CyberShieldPK should show it under the live agents view.

For Windows telemetry, configure the Wazuh agent to collect the Windows event channels required by your lab. Wazuh rules then decode events and generate alerts.

## 8. Connect Linux

Install the Wazuh agent on the Linux endpoint, set the manager address to the Ubuntu Wazuh server IP, and start the service.

Then verify:

```bash
sudo systemctl status wazuh-agent
```

The agent should become active in Wazuh.

## 9. Live alert flow

The CyberShieldPK backend watches:

```
/var/ossec/logs/alerts/alerts.json
```

A new Wazuh alert is normalized and sent to connected browsers through:

```
GET /api/soc/stream
```

The frontend subscribes with Server-Sent Events, so the dashboard can update without a page refresh.

## 10. API endpoints

```
GET /api/health
GET /api/soc/summary
GET /api/soc/agents
GET /api/soc/alerts
GET /api/soc/vulnerabilities
GET /api/soc/agent-install?os=windows
GET /api/soc/agent-install?os=linux
GET /api/soc/stream
```

## 11. Troubleshooting

### Wazuh offline

```bash
sudo systemctl status wazuh-manager
sudo journalctl -u wazuh-manager -n 100 --no-pager
```

### No agents

Check the agent service and manager address. Then check the Wazuh dashboard's Agents page.

### No live alerts

Check:

```bash
sudo ls -lh /var/ossec/logs/alerts/alerts.json
sudo tail -f /var/ossec/logs/alerts/alerts.json
```

If the file is not changing, the issue is upstream in agent collection, manager analysis, or rules—not the CyberShieldPK frontend.

### Vulnerabilities empty

Make sure Wazuh vulnerability detection is working and the Indexer credentials in `.env` are correct.

### Browser opens but dashboard says offline

Check:

```
http://127.0.0.1:8080/api/health
```

It should return JSON with `ok: true` and `wazuh: true`.

## 12. Security rules

- Do not expose Wazuh API port 55000 publicly.
- Do not expose Indexer port 9200 publicly.
- Keep Wazuh passwords only in the backend environment.
- Change default Wazuh credentials.
- Use HTTPS/trusted certificates for production.
- Put authentication/authorization in front of the CyberShieldPK backend before exposing it beyond the private lab.
- Keep demo/simulation data clearly separated from live telemetry.

## 13. Production roadmap

The next production layer should add:

1. CyberShieldPK user authentication and RBAC.
2. PostgreSQL persistence for incidents, notes, cases and audit logs.
3. Historical alert queries from Wazuh Indexer instead of only the in-memory live buffer.
4. Real MITRE ATT&CK aggregation from Wazuh events.
5. SCA/configuration assessment views.
6. Syscollector/system inventory.
7. FIM event views.
8. Case management and analyst notes.
9. Report generation.
10. Secure reverse proxy and TLS.
11. Background service/systemd deployment for the CyberShieldPK backend.
