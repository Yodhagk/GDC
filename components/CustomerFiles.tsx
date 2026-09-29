'use client';

import { useState } from 'react';
import FileTree from '@/components/FileTree';

/**
 * Staff view of one customer's Dropbox: switch between Documents and Backup
 * folders, and turn the customer's $25/mo Backup plan on or off.
 */
export default function CustomerFiles({
  customerId,
  backupPlan,
  onToggleBackup,
}: {
  customerId: string;
  backupPlan: boolean;
  onToggleBackup: (next: boolean) => void;
}) {
  const [area, setArea] = useState<'documents' | 'backup'>('documents');

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
        <div className="inline-flex bg-gray-100 rounded-lg p-0.5 text-xs font-medium">
          {(['documents', 'backup'] as const).map((a) => (
            <button
              key={a}
              onClick={() => setArea(a)}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                area === a ? 'bg-white text-navy-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {a === 'documents' ? 'Documents' : 'Backup folders'}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={backupPlan}
            onChange={(e) => onToggleBackup(e.target.checked)}
            className="accent-amber-500"
          />
          Backup plan ($25/mo) {backupPlan ? 'active' : 'off'}
        </label>
      </div>
      <FileTree
        layout="stacked"
        endpoint={`/api/admin/documents?customerId=${customerId}${area === 'backup' ? '&area=backup' : ''}`}
      />
    </div>
  );
}
