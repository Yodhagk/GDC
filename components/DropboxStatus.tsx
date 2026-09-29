'use client';

import { useEffect, useState, useCallback } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

type Health = {
  credentials: 'refresh_token' | 'access_token' | 'missing';
  missingEnv: string[];
  connected: boolean;
  account?: { name: string; email: string };
  documentsRoot: { path: string; exists: boolean };
  backupRoot: { path: string; exists: boolean };
  error?: string;
  checkedAt: string;
};

/** Live Dropbox connection check for staff, so a broken link is visible instead of an empty tree. */
export default function DropboxStatus() {
  const [h, setH] = useState<Health | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const check = useCallback(async () => {
    setLoading(true);
    setFailed(false);
    try {
      const res = await fetch('/api/admin/dropbox-status');
      if (!res.ok) throw new Error();
      setH((await res.json()).health);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    check();
  }, [check]);

  const ok = !!h?.connected;
  const Icon = loading ? RefreshCw : ok ? CheckCircle2 : XCircle;

  return (
    <div className={`rounded-2xl border px-5 py-4 text-sm ${
      loading ? 'bg-gray-50 border-gray-200 text-gray-600' : ok ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
    }`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${loading ? 'animate-spin' : ''}`} />
        <div className="flex-1 min-w-0 space-y-1">
          <p className="font-semibold">
            {loading ? 'Checking Dropbox connection…' : ok ? 'Dropbox connected' : 'Dropbox is NOT connected'}
            {h?.account && <span className="font-normal"> · {h.account.name} ({h.account.email})</span>}
          </p>
          {failed && <p>Could not run the check. Sign in again or try later.</p>}
          {h?.error && <p>{h.error}</p>}
          {h && h.missingEnv.length > 0 && (
            <p>Set on the server: <span className="font-mono">{h.missingEnv.join(', ')}</span> (then restart the app).</p>
          )}
          {h?.connected && (
            <ul className="text-xs space-y-0.5">
              <li className="flex items-center gap-1.5">
                {h.documentsRoot.exists ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}
                <span className="font-mono">{h.documentsRoot.path}</span>
                {h.documentsRoot.exists ? 'found' : 'not found yet (created on the first client upload)'}
              </li>
              <li className="flex items-center gap-1.5">
                {h.backupRoot.exists ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}
                <span className="font-mono">{h.backupRoot.path}</span>
                {h.backupRoot.exists ? 'backup root found' : 'backup root not found (admin: pick one on Overview, or it is created on first backup upload)'}
              </li>
            </ul>
          )}
          {h && <p className="text-[11px] opacity-70">Checked {formatDateTime(h.checkedAt)}</p>}
        </div>
        <button onClick={check} disabled={loading} className="text-xs font-semibold underline disabled:opacity-40 shrink-0">
          Re-check
        </button>
      </div>
    </div>
  );
}
