import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Monitor, 
  Shield, 
  Save, 
  CheckCircle2, 
  Lock, 
  Key,
  Globe,
  Sliders
} from 'lucide-react';

export const SocSettingsPage: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'notifications' | 'system' | 'security'>('profile');
  const [savedFeedback, setSavedFeedback] = useState(false);

  // Profile state
  const [profile, setProfile] = useState({
    name: 'Muhammad Zaib Zafar',
    email: 'zaibzafar936@gmail.com',
    role: 'Lead Cybersecurity Architect & SOC Director',
    timezone: 'Asia/Karachi (UTC+5)',
  });

  // Notification matrix state
  const [notifications, setNotifications] = useState({
    emailCritical: true,
    emailHigh: true,
    emailMedium: false,
    emailLow: false,
    inAppCritical: true,
    inAppHigh: true,
    inAppMedium: true,
    inAppLow: false,
    smsCritical: true,
    smsHigh: false,
    smsMedium: false,
    smsLow: false,
  });

  // System config state
  const [systemConfig, setSystemConfig] = useState({
    refreshInterval: '30',
    dataRetention: '90',
    logLevel: 'info',
    autoEscalate: true,
    maintenanceMode: false,
  });

  // Security config state
  const [securitySettings, setSecuritySettings] = useState({
    twoFactor: true,
    sessionTimeout: true,
    auditLogging: true,
    ipAllowlist: false,
    ssoEnabled: false,
  });

  const handleSave = () => {
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl">
      
      {/* Settings Navigation Subtabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveSubTab('profile')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-2 cursor-pointer transition-colors ${
            activeSubTab === 'profile' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Operator Profile</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('notifications')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-2 cursor-pointer transition-colors ${
            activeSubTab === 'notifications' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Notification Matrix</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('system')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-2 cursor-pointer transition-colors ${
            activeSubTab === 'system' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>SIEM Configuration</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('security')}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-2 cursor-pointer transition-colors ${
            activeSubTab === 'security' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Platform Security</span>
        </button>
      </div>

      {/* SUBTAB 1: Profile */}
      {activeSubTab === 'profile' && (
        <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400 font-mono font-bold text-xl">
                ZZ
              </div>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white font-sans">{profile.name}</h3>
              <p className="text-xs text-slate-400 font-mono">{profile.role}</p>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active Session · Tier 3 Privileged Authority
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs pt-2">
            <div>
              <label className="block text-slate-400 text-[11px] uppercase mb-1">Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-[11px] uppercase mb-1">Email Address</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-[11px] uppercase mb-1">Duty Title / Role</label>
              <input
                type="text"
                value={profile.role}
                onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-[11px] uppercase mb-1">Operational Timezone</label>
              <select
                value={profile.timezone}
                onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Asia/Karachi (UTC+5)">Asia/Karachi (UTC+5:00)</option>
                <option value="UTC (UTC+0)">Coordinated Universal Time (UTC)</option>
                <option value="America/New_York (EST)">America/New York (UTC-5:00)</option>
                <option value="Europe/London (BST)">Europe/London (UTC+1:00)</option>
                <option value="Asia/Dubai (GST)">Asia/Dubai (UTC+4:00)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-3 font-mono text-xs">
            <h4 className="text-xs font-bold text-white uppercase flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              Credentials & Secret Rotation
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 text-[10px] uppercase mb-1">Current Password / Token</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-[10px] uppercase mb-1">New 16+ Char Password</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: Notifications */}
      {activeSubTab === 'notifications' && (
        <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-5">
          <div>
            <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
              Alert Notification Routing Matrix
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Specify delivery channels across detection severity thresholds
            </p>
          </div>

          <div className="space-y-4 font-mono text-xs">
            {[
              { label: 'Email Alerts (Dispatch to zaibzafar936@gmail.com)', keyPrefix: 'email' },
              { label: 'In-App Telemetry Banner & Audio Chime', keyPrefix: 'inApp' },
              { label: 'SMS & PagerDuty Emergency Escalation', keyPrefix: 'sms' },
            ].map(({ label, keyPrefix }) => (
              <div key={keyPrefix} className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2">
                <span className="text-white font-bold block">{label}</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {(['critical', 'high', 'medium', 'low'] as const).map((sev) => {
                    const keyName = `${keyPrefix}${sev.charAt(0).toUpperCase() + sev.slice(1)}` as keyof typeof notifications;
                    const isChecked = notifications[keyName];
                    return (
                      <label 
                        key={sev}
                        className={`flex items-center justify-between p-2 rounded border cursor-pointer select-none transition-colors ${
                          isChecked 
                            ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300' 
                            : 'bg-slate-950 border-slate-800 text-slate-500'
                        }`}
                      >
                        <span className="capitalize text-[11px] font-bold">{sev}</span>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => setNotifications({ ...notifications, [keyName]: e.target.checked })}
                          className="accent-cyan-500 rounded"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: System Configuration */}
      {activeSubTab === 'system' && (
        <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-5 font-mono text-xs">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              SIEM Engine & Polling Configuration
            </h3>
            <p className="text-xs text-slate-400">
              Wazuh, Elastic, and Suricata pipeline settings
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-400 text-[11px] uppercase mb-1">Telemetry Refresh Interval</label>
              <select
                value={systemConfig.refreshInterval}
                onChange={(e) => setSystemConfig({ ...systemConfig, refreshInterval: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="10">Every 10 seconds</option>
                <option value="30">Every 30 seconds (Default)</option>
                <option value="60">Every 60 seconds</option>
                <option value="300">Every 5 minutes</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 text-[11px] uppercase mb-1">Index Retention Horizon</label>
              <select
                value={systemConfig.dataRetention}
                onChange={(e) => setSystemConfig({ ...systemConfig, dataRetention: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="30">30 Days</option>
                <option value="90">90 Days (PCI-DSS Standard)</option>
                <option value="180">180 Days</option>
                <option value="365">365 Days (1 Year)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 text-[11px] uppercase mb-1">Suricata Log Level</label>
              <select
                value={systemConfig.logLevel}
                onChange={(e) => setSystemConfig({ ...systemConfig, logLevel: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="debug">Debug (Verbose)</option>
                <option value="info">Info (Standard)</option>
                <option value="warn">Warn Only</option>
                <option value="error">Error Only</option>
              </select>
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <div>
                <span className="text-white font-bold block text-xs">Automatic Critical Alert Escalation</span>
                <span className="text-[11px] text-slate-400">Escalate unacknowledged critical alerts after 15 minutes</span>
              </div>
              <input
                type="checkbox"
                checked={systemConfig.autoEscalate}
                onChange={(e) => setSystemConfig({ ...systemConfig, autoEscalate: e.target.checked })}
                className="accent-cyan-500 w-4 h-4 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <div>
                <span className="text-white font-bold block text-xs">Maintenance Window Mode</span>
                <span className="text-[11px] text-slate-400">Suppress non-critical noise alerts during scheduled updates</span>
              </div>
              <input
                type="checkbox"
                checked={systemConfig.maintenanceMode}
                onChange={(e) => setSystemConfig({ ...systemConfig, maintenanceMode: e.target.checked })}
                className="accent-cyan-500 w-4 h-4 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: Platform Security */}
      {activeSubTab === 'security' && (
        <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4 font-mono text-xs">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Operator Access & Defense Hardening
            </h3>
            <p className="text-xs text-slate-400">
              Zero-Trust authentication and compliance controls
            </p>
          </div>

          <div className="space-y-3">
            {[
              { title: 'Enforce Hardware Security Key / 2FA OTP', desc: 'Require TOTP or FIDO2 key on every operator authentication', key: 'twoFactor' as const },
              { title: 'Automatic Inactivity Session Expire (30m)', desc: 'Terminate inactive console sessions to prevent unattended terminal misuse', key: 'sessionTimeout' as const },
              { title: 'Immutable Audit Trail Logging', desc: 'Ship all analyst actions to tamper-proof S3 WORM storage', key: 'auditLogging' as const },
              { title: 'Strict Management IP Allowlist', desc: 'Restrict SOC Dashboard ingress strictly to corporate VPN subnets', key: 'ipAllowlist' as const },
              { title: 'Enterprise Single Sign-On (SAML 2.0)', desc: 'Delegate identity assertion to Okta / Azure AD tenant', key: 'ssoEnabled' as const },
            ].map(({ title, desc, key }) => (
              <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <div>
                  <span className="text-white font-bold block text-xs">{title}</span>
                  <span className="text-[11px] text-slate-400">{desc}</span>
                </div>
                <input
                  type="checkbox"
                  checked={securitySettings[key]}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, [key]: e.target.checked })}
                  className="accent-cyan-500 w-4 h-4 rounded cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="pt-2 flex items-center justify-between">
        {savedFeedback ? (
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings successfully committed to CyberShield SOC cluster.</span>
          </span>
        ) : (
          <span className="text-xs font-mono text-slate-500">
            Last modified: Today at 02:10 PKT
          </span>
        )}

        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold font-mono text-xs flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all ml-auto"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
};
