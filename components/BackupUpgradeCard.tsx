'use client';

import { useState } from 'react';
import { HardDriveUpload, Check, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const PERKS = [
  'Upload documents from the website',
  'Download any of your files',
  'Your own Dropbox Backup folders, viewable as a tree',
];

/** Shown to clients without the Backup plan. Upgrades are billed offline, so this raises a support ticket. */
export default function BackupUpgradeCard({ feature }: { feature: string }) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const requestUpgrade = async () => {
    setSending(true);
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: 'Upgrade to Backup plan ($25/month)',
          category: 'General',
          priority: 'medium',
          message: `Please upgrade my account to the Backup plan ($25/month). I want to: ${feature}.`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSent(true);
      toast.success(`Request sent (${data.ticket.ticketNo}). We'll contact you about billing.`);
    } catch (err: any) {
      toast.error(err.message || 'Could not send request');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-md mx-auto text-center py-10">
      <div className="w-14 h-14 bg-gold-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <HardDriveUpload className="w-7 h-7 text-gold-500" />
      </div>
      <h3 className="font-serif font-bold text-navy-800 text-lg">Backup plan · $25 / month</h3>
      <p className="text-gray-500 text-sm mt-1 mb-5">Upgrade to {feature}.</p>
      <ul className="text-left inline-block space-y-2 mb-6">
        {PERKS.map((p) => (
          <li key={p} className="flex items-start gap-2 text-sm text-gray-700">
            <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
            {p}
          </li>
        ))}
      </ul>
      <div>
        <button
          onClick={requestUpgrade}
          disabled={sending || sent}
          className="inline-flex items-center gap-2 bg-gold-400 hover:bg-gold-500 text-navy-900 font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors disabled:opacity-60"
        >
          <Send className="w-4 h-4" />
          {sent ? 'Request sent' : sending ? 'Sending…' : 'Request upgrade'}
        </button>
        <p className="text-gray-400 text-xs mt-3">Our team activates your plan after billing is arranged.</p>
      </div>
    </div>
  );
}
