'use client';

import { useEffect, useState, useCallback } from 'react';
import { Folder, FolderOpen, ChevronRight, ArrowUp, RefreshCw, Check } from 'lucide-react';
import toast from 'react-hot-toast';

type Sub = { name: string; path: string };

/** Admin-only: browse the real Dropbox folders and choose where client Backup folders live. */
export default function BackupRootPicker() {
  const [root, setRoot] = useState<string | null>(null);
  const [current, setCurrent] = useState('/');
  const [folders, setFolders] = useState<Sub[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch('/api/admin/backup-root')
      .then((r) => r.json())
      .then((d) => setRoot(d.root ?? null))
      .catch(() => {});
  }, []);

  const browse = useCallback(async (path: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/backup-root?browse=${encodeURIComponent(path)}`);
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      setCurrent(d.path);
      setFolders(d.folders);
    } catch (err: any) {
      toast.error(err.message || 'Could not list Dropbox folders');
    } finally {
      setLoading(false);
    }
  }, []);

  const start = () => {
    setOpen(true);
    browse('/');
  };

  const parent = current === '/' ? null : current.replace(/\/[^/]+$/, '') || '/';

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/backup-root', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: current }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      setRoot(d.root);
      setOpen(false);
      toast.success(`Backup root set to ${d.root}`);
    } catch (err: any) {
      toast.error(err.message || 'Could not save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-serif font-bold text-navy-800">Backup folder root</h2>
          <p className="text-gray-400 text-xs mt-0.5">
            Each Backup-plan client gets <span className="font-mono">{root ?? '…'}/&lt;customerId&gt;</span>. Existing backups stay where they are if you change this.
          </p>
        </div>
        {!open && (
          <button onClick={start} className="text-sm font-semibold text-gold-600 hover:text-gold-700">
            Change folder
          </button>
        )}
      </div>

      {open && (
        <div className="mt-4 border border-gray-100 rounded-xl">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100 bg-gray-50 text-xs">
            <button
              onClick={() => parent && browse(parent)}
              disabled={!parent || loading}
              className="text-gray-400 hover:text-navy-700 disabled:opacity-30"
              aria-label="Up one level"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <FolderOpen className="w-4 h-4 text-gold-500" />
            <span className="font-mono text-navy-800 truncate">{current}</span>
            {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin text-gray-400 ml-auto" />}
          </div>
          <div className="max-h-60 overflow-y-auto p-1">
            {!loading && folders.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-6">No sub-folders here.</p>
            )}
            {folders.map((f) => (
              <button
                key={f.path}
                onClick={() => browse(f.path)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 text-left"
              >
                <Folder className="w-4 h-4 text-gold-500 shrink-0" />
                <span className="text-sm text-navy-800 truncate">{f.name}</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-300 ml-auto shrink-0" />
              </button>
            ))}
          </div>
          <div className="flex items-center justify-end gap-3 px-3 py-2 border-t border-gray-100">
            <button onClick={() => setOpen(false)} className="text-xs text-gray-400 hover:text-gray-600">Cancel</button>
            <button
              onClick={save}
              disabled={saving || current === '/'}
              className="flex items-center gap-1.5 bg-navy-800 hover:bg-navy-700 text-white text-xs font-semibold px-4 py-2 rounded-lg disabled:opacity-40"
            >
              <Check className="w-3.5 h-3.5" />
              {saving ? 'Saving…' : 'Use this folder'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
