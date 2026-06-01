'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import FileUpload from '@/components/FileUpload';
import FileList from '@/components/FileList';
import {
  Copy, LogOut, UploadCloud, FolderOpen, Shield, User,
  TicketIcon, Plus, X, ChevronDown, Clock, CheckCircle2, AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['Tax', 'Immigration', 'Company Registration', 'Technical', 'General'];
const PRIORITIES = ['low', 'medium', 'high', 'urgent'];

const STATUS_STYLE: Record<string, string> = {
  open: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  resolved: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-500',
};

const PRIORITY_STYLE: Record<string, string> = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-blue-100 text-blue-600',
  high: 'bg-orange-100 text-orange-600',
  urgent: 'bg-red-100 text-red-600',
};

type Ticket = {
  id: string; ticketNo: string; subject: string; category: string;
  priority: string; status: string; message: string; response: string | null;
  createdAt: string;
};

export default function PortalDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState<'upload' | 'files' | 'tickets'>('upload');

  // Ticket state
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketsLoaded, setTicketsLoaded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);
  const [form, setForm] = useState({ subject: '', category: 'Tax', priority: 'medium', message: '' });

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/portal/login');
  }, [status, router]);

  useEffect(() => {
    if (activeTab === 'tickets' && !ticketsLoaded) loadTickets();
  }, [activeTab]);

  const loadTickets = async () => {
    try {
      const res = await fetch('/api/tickets');
      const data = await res.json();
      setTickets(data.tickets || []);
      setTicketsLoaded(true);
    } catch { toast.error('Failed to load tickets'); }
  };

  const submitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subject.trim() || !form.message.trim()) {
      toast.error('Subject and message are required');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(`Ticket ${data.ticket.ticketNo} raised! We'll respond shortly.`);
      setShowForm(false);
      setForm({ subject: '', category: 'Tax', priority: 'medium', message: '' });
      setTickets((prev) => [data.ticket, ...prev]);
    } catch (err: any) {
      toast.error(err.message || 'Failed to raise ticket');
    } finally {
      setSubmitting(false);
    }
  };

  if (status === 'loading' || !session) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="w-6 h-6 border-2 border-gold-400/30 border-t-gold-400 rounded-full animate-spin" />
      </div>
    );
  }

  const user = session.user as any;
  const customerId: string = user.customerId ?? '';

  const copyId = () => {
    navigator.clipboard.writeText(customerId);
    toast.success('Customer ID copied!');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Welcome card */}
        <div className="bg-navy-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gold-400 rounded-full flex items-center justify-center font-serif font-bold text-navy-900 text-lg">
              {user.name?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div>
              <p className="text-white/55 text-xs uppercase tracking-wide">Welcome back</p>
              <h1 className="text-white font-serif font-bold text-xl">{user.name}</h1>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/portal/login' })}
            className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {/* Customer ID card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <User className="w-4 h-4 text-gold-400" />
                <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Your Customer ID</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-serif text-3xl font-bold text-navy-800 tracking-wider">{customerId}</span>
                <button onClick={copyId} className="text-gray-300 hover:text-gold-400 transition-colors" title="Copy ID">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <p className="text-gray-400 text-xs mt-1">Use this ID when communicating with your consultant.</p>
            </div>
            <div className="flex items-center gap-2 bg-green-50 border border-green-100 text-green-700 text-xs px-3 py-1.5 rounded-full">
              <Shield className="w-3.5 h-3.5" />
              Encrypted & Secure
            </div>
          </div>
        </div>

        {/* Main tabbed panel */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-100 overflow-x-auto">
            {([
              { key: 'upload', icon: UploadCloud, label: 'Upload Documents' },
              { key: 'files', icon: FolderOpen, label: 'My Documents' },
              { key: 'tickets', icon: TicketIcon, label: 'Support Tickets' },
            ] as const).map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === key
                    ? 'text-gold-500 border-b-2 border-gold-400 -mb-px'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'upload' && (
              <div>
                <p className="text-sm text-gray-500 mb-5">
                  Upload your documents securely. Files stored under{' '}
                  <span className="font-mono text-navy-700 bg-gray-100 px-1.5 py-0.5 rounded">
                    /GoldenDollarConsultancy/{customerId}/
                  </span>
                </p>
                <FileUpload onUploadSuccess={() => { setRefreshKey((k) => k + 1); setActiveTab('files'); }} />
              </div>
            )}

            {activeTab === 'files' && <FileList refreshKey={refreshKey} />}

            {activeTab === 'tickets' && (
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="font-serif font-bold text-navy-800 text-lg">Support Tickets</h3>
                    <p className="text-gray-400 text-xs mt-0.5">Raise an issue — IT support will respond via email</p>
                  </div>
                  <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 bg-gold-400 hover:bg-gold-500 text-navy-900 font-semibold text-sm px-4 py-2 rounded-xl transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Raise Ticket
                  </button>
                </div>

                {/* New ticket form */}
                {showForm && (
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 mb-5">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-navy-800">New Support Ticket</h4>
                      <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <form onSubmit={submitTicket} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Subject *</label>
                        <input
                          value={form.subject}
                          onChange={(e) => setForm({ ...form, subject: e.target.value })}
                          placeholder="Brief description of your issue"
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-300"
                        />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
                          <select
                            value={form.category}
                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-300"
                          >
                            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">Priority</label>
                          <select
                            value={form.priority}
                            onChange={(e) => setForm({ ...form, priority: e.target.value })}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-300"
                          >
                            {PRIORITIES.map((p) => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Message *</label>
                        <textarea
                          value={form.message}
                          onChange={(e) => setForm({ ...form, message: e.target.value })}
                          placeholder="Describe your issue in detail..."
                          rows={4}
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-300 resize-none"
                        />
                      </div>
                      <div className="flex gap-3 justify-end">
                        <button type="button" onClick={() => setShowForm(false)}
                          className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                          Cancel
                        </button>
                        <button type="submit" disabled={submitting}
                          className="px-5 py-2 bg-navy-800 hover:bg-navy-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50">
                          {submitting ? 'Submitting...' : 'Submit Ticket'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Ticket list */}
                {tickets.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <TicketIcon className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No tickets yet. Raise one if you need help!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tickets.map((t) => (
                      <div key={t.id} className="border border-gray-100 rounded-2xl overflow-hidden">
                        <button
                          onClick={() => setExpandedTicket(expandedTicket === t.id ? null : t.id)}
                          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="text-xs font-mono text-gray-400 shrink-0">{t.ticketNo}</span>
                            <span className="font-medium text-navy-800 text-sm truncate">{t.subject}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${STATUS_STYLE[t.status]}`}>
                              {t.status.replace('_', ' ')}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${PRIORITY_STYLE[t.priority]}`}>
                              {t.priority}
                            </span>
                          </div>
                          <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${expandedTicket === t.id ? 'rotate-180' : ''}`} />
                        </button>
                        {expandedTicket === t.id && (
                          <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">
                            <div className="flex gap-4 text-xs text-gray-400">
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(t.createdAt).toLocaleDateString()}</span>
                              <span>Category: {t.category}</span>
                            </div>
                            <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-3">{t.message}</p>
                            {t.response && (
                              <div className="bg-green-50 border border-green-100 rounded-xl p-3">
                                <div className="flex items-center gap-2 mb-1">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                                  <span className="text-xs font-semibold text-green-700">IT Support Response</span>
                                </div>
                                <p className="text-sm text-gray-700">{t.response}</p>
                              </div>
                            )}
                            {!t.response && t.status === 'open' && (
                              <div className="flex items-center gap-2 text-xs text-amber-600">
                                <AlertCircle className="w-3.5 h-3.5" />
                                Awaiting response from IT support
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Checklist */}
        <div className="bg-gold-50 border border-gold-200 rounded-2xl p-6">
          <h3 className="font-serif font-bold text-navy-800 mb-4">Tax Document Checklist</h3>
          <div className="grid sm:grid-cols-2 gap-2">
            {[
              'W-2 Form(s) from employer(s)', '1099 Forms (freelance/interest/dividends)',
              'Last year\'s tax return', 'Social Security numbers (all household)',
              'Mortgage interest statement (1098)', 'Charitable donation receipts',
              'Business expense receipts', 'Health insurance documents (1095)',
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 text-sm text-gray-700">
                <div className="w-4 h-4 border-2 border-gold-300 rounded mt-0.5 shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
