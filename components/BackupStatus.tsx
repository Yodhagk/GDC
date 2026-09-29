'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { RefreshCw, Search, AlertTriangle, CheckCircle2, CircleDashed } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatFileSize, formatDateTime } from '@/lib/utils';
import DropboxStatus from '@/components/DropboxStatus';

type Row = {
  id: string;
  name: string;
  email: string;
  customerId: string;
  backupPlan: boolean;
  isActive: boolean;
  backup: {
    fileCount: number;
    folderCount: number;
    totalSize: number;
    lastModified: string | null;
    syncedAt: string;
  } | null;
};

const DAY = 24 * 60 * 60 * 1000;

function statusOf(r: Row): { label: string; cls: string; Icon: typeof CheckCircle2 } {
  if (!r.backup) return { label: 'Never synced', cls: 'bg-gray-100 text-gray-500', Icon: CircleDashed };
  const age = Date.now() - new Date(r.backup.syncedAt).getTime();
  // Plan clients are live whenever they open the tab; a snapshot older than a day is worth a refresh
  if (age > DAY) return { label: 'Stale (>24h)', cls: 'bg-amber-100 text-amber-700', Icon: AlertTriangle };
  return { label: 'Up to date', cls: 'bg-green-100 text-green-700', Icon: CheckCircle2 };
}

/** Staff-only: last Dropbox sync and backup-folder details per customer. */
export default function BackupStatus() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null); // customerId, or 'all'
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/backup-status');
      if (!res.ok) throw new Error();
      setRows((await res.json()).rows);
    } catch {
      toast.error('Could not load backup status');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const sync = async (body: { customerId: string } | { all: true }) => {
    const key = 'all' in body ? 'all' : body.customerId;
    setBusy(key);
    try {
      const res = await fetch('/api/admin/backup-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      if (d.failed?.length) toast.error(`Sync failed for ${d.failed.join(', ')}`);
      else toast.success(`Synced ${d.synced} backup folder${d.synced !== 1 ? 's' : ''} from Dropbox`);
      await load();
    } catch (err: any) {
      toast.error(err.message || 'Sync failed');
    } finally {
      setBusy(null);
    }
  };

  const q = search.trim().toLowerCase();
  const visible = useMemo(
    () =>
      rows.filter(
        (r) =>
          !q || r.customerId.toLowerCase().includes(q) || r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q)
      ),
    [rows, q]
  );

  return (
    <div className="space-y-4">
      <DropboxStatus />

      <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-4 py-3 text-sm">
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
        <p>
          <span className="font-semibold">Sync speed depends on the plan.</span> Free-plan clients see Dropbox changes
          only after up to <strong>24 hours</strong>. Clients on the <strong>$25/month Backup plan</strong> get fast,
          live sync. Staff always see live data.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-3 flex-wrap">
          <h2 className="font-serif font-bold text-navy-800 mr-auto">Backup status</h2>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-300 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer ID, name or email…"
              className="text-xs border border-gray-200 rounded-lg pl-8 pr-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-gold-400/20"
            />
          </div>
          <button
            onClick={() => sync({ all: true })}
            disabled={busy !== null}
            className="flex items-center gap-1.5 bg-navy-800 hover:bg-navy-700 text-white text-xs font-semibold px-4 py-2 rounded-lg disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${busy === 'all' ? 'animate-spin' : ''}`} />
            Sync all plan clients
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wide text-gray-400 border-b border-gray-50">
                <th className="px-5 py-3 font-semibold">Customer</th>
                <th className="px-3 py-3 font-semibold">Plan</th>
                <th className="px-3 py-3 font-semibold">Backup folder</th>
                <th className="px-3 py-3 font-semibold">Last file change in Dropbox</th>
                <th className="px-3 py-3 font-semibold">Last sync</th>
                <th className="px-3 py-3 font-semibold">Status</th>
                <th className="px-3 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading && (
                <tr><td colSpan={7} className="text-center text-gray-400 text-xs py-10">Loading…</td></tr>
              )}
              {!loading && visible.length === 0 && (
                <tr><td colSpan={7} className="text-center text-gray-400 text-xs py-10">No matching clients.</td></tr>
              )}
              {visible.map((r) => {
                const st = statusOf(r);
                return (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <p className="font-medium text-navy-800">{r.name}</p>
                      <p className="font-mono text-xs text-gray-400">{r.customerId}</p>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${r.backupPlan ? 'bg-gold-100 text-gold-700' : 'bg-gray-100 text-gray-500'}`}>
                        {r.backupPlan ? '$25 Backup' : 'Free'}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-xs text-gray-600">
                      {r.backup ? `${r.backup.fileCount} files · ${r.backup.folderCount} folders · ${formatFileSize(r.backup.totalSize)}` : '—'}
                    </td>
                    <td className="px-3 py-3 text-xs text-gray-600">
                      {r.backup?.lastModified ? formatDateTime(r.backup.lastModified) : '—'}
                    </td>
                    <td className="px-3 py-3 text-xs text-gray-600">{r.backup ? formatDateTime(r.backup.syncedAt) : '—'}</td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${st.cls}`}>
                        <st.Icon className="w-3 h-3" />
                        {st.label}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <button
                        onClick={() => sync({ customerId: r.customerId })}
                        disabled={busy !== null}
                        className="text-xs text-gold-600 hover:text-gold-700 font-medium disabled:opacity-40"
                      >
                        {busy === r.customerId ? 'Syncing…' : 'Sync now'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
