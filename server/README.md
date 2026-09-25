# Live Wazuh SOC backend

Run this backend on the Wazuh manager host or another host with private network access to the Wazuh API and Indexer.

Required server environment:
WAZUH_API_URL=https://127.0.0.1:55000
WAZUH_API_USER=...
WAZUH_API_PASSWORD=...
WAZUH_INDEXER_URL=https://127.0.0.1:9200
WAZUH_INDEXER_USER=...
WAZUH_INDEXER_PASSWORD=...
WAZUH_MANAGER_HOST=<manager-ip-or-dns>
WAZUH_ALERTS_FILE=/var/ossec/logs/alerts/alerts.json
WAZUH_INSECURE_TLS=true
WAZUH_AGENT_VERSION=4.14.7

Keep WAZUH_* values server-side. Never put them in VITE_* frontend variables.
