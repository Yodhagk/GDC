'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Users, Shield, RefreshCw, LogOut, Eye,
  Database, Server, Activity, Search,
  FileText, Download, X, TicketIcon, ChevronDown,
  CheckCircle2, Clock, Send,
} from 'lucide-react';
import { formatFileSize } from '@/lib/utils';
import toast from 'react-hot-toast';

type UserRow = { id: string; name: string; email: string; customerId: string; role: string; createdAt: string };
type FileItem = { name: string; path: string; size: number; modified: string };
type Stats = { totalUsers: number; clientCount: number; adminCount: number; itCount: number };
type Ticket = {
  id: string; ticketNo: string; subject: string; category: string;
  priority: string; status: string; message: string; response: string | null;
  createdAt: string; updatedAt: string;
  user: { name: string; email: string; customerId: string };
};

const ROLE_COLORS: Record<string, string> = {
  client: 'bg-blue-100 text-blue-700',
  admin: 'bg-purple-100 text-purple-700',
  it_support: 'bg-amber-100 text-amber-700',
};
const ROLE_LABELS: Record<string, string> = { client: 'Client', admin: 'Admin', it_support: 'IT Support' };

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

export default function ITSupportDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'users' | 'tickets'>('tickets');
  const [stats, setStats] = useState<Stats | null>(null);
  const [allUsers, setAllUsers] = useState<UserRow[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewingUser, setViewingUser] = useState<UserRow | null>(null);
  const [userFiles, setUserFiles] = useState<FileItem[]>([]);
  const [filesLoading, setFilesLoading] = useState(false);

  // Ticket state
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketSearch, setTicketSearch] = useState('');
  const [ticketFilter, setTicketFilter] = useState<string>('all');
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [updatingTicket, setUpdatingTicket] = useState<string | null>(null);

  const user = session?.user as any;

  useEffect(() => {
    if (status === 'unauthenticated') { router.replace('/portal/login'); return; }
    if (status === 'authenticated' && !['admin', 'it_support'].includes(user?.role)) router.replace('/portal');
  }, [status, user, router]);

  const fetchData = useCallback(async () => {
    const [statsRes, usersRes, ticketsRes] = await Promise.all([
      fetch('/api/admin/stats'),
      fetch('/api/admin/users'),
      fetch('/api/tickets'),
    ]);
    if (statsRes.ok) { const d = await statsRes.json(); setStats(d.stats); }
    if (usersRes.ok) { const d = await usersRes.json(); setAllUsers(d.users); }
    if (ticketsRes.ok) { const d = await ticketsRes.json(); setTickets(d.tickets); }
  }, []);

  useEffect(() => {
    if (status !== 'authenticated') return;
    setLoading(true);
    fetchData().finally(() => setLoading(false));
  }, [status, fetchData]);

  const viewDocuments = async (u: UserRow) => {
    setViewingUser(u);
    setUserFiles([]);
    setFilesLoading(true);
    const res = await fetch(`/api/admin/documents?customerId=${u.customerId}`);
    if (res.ok) { const d = await res.json(); setUserFiles(d.files ?? []); }
    setFilesLoading(false);
  };

  const handleDownload = async (path: string) => {
    try {
      const res = await fetch(`/api/files/download?path=${encodeURIComponent(path)}`);
      if (!res.ok) throw new Error();
      const { url } = await res.json();
      window.open(url, '_blank');
    } catch { toast.error('Could not generate download link'); }
  };

  const updateTicket = async (id: string, status: string, response?: string) => {
    setUpdatingTicket(id);
    try {
      const res = await fetch(`/api/tickets/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, ...(response !== undefined && { response }) }),
      });
      if (!res.ok) throw new Error();
      const { ticket } = await res.json();
      setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, ...ticket } : t)));
      toast.success(`Ticket ${status === 'resolved' ? 'resolved' : 'updated'} successfully`);
      if (status === 'resolved') setExpandedTicket(null);
    } catch { toast.error('Failed to update ticket'); }
    finally { setUpdatingTicket(null); }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-6 h-6 animate-spin text-amber-500" />
      </div>
    );
  }

  const filteredUsers = allUsers.filter(
    (u) => u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.customerId.toLowerCase().includes(search.toLowerCase())
  );

  const filteredTickets = tickets.filter((t) => {
    const matchSearch = t.subject.toLowerCase().includes(ticketSearch.toLowerCase()) ||
      t.ticketNo.toLowerCase().includes(ticketSearch.toLowerCase()) ||
      t.user.name.toLowerCase().includes(ticketSearch.toLowerCase());
    const matchStatus = ticketFilter === 'all' || t.status === ticketFilter;
    return matchSearch && matchStatus;
  });

  const openCount = tickets.filter((t) => t.status === 'open').length;
  const inProgressCount = tickets.filter((t) => t.status === 'in_progress').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-navy-800 text-white px-6 py-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-400 rounded-full flex items-center justify-center">
            <Shield className="w-4 h-4 text-navy-900" />
          </div>
          <div>
            <div className="font-serif font-bold text-lg leading-none">Golden Dollar</div>
            <div className="text-amber-400 text-[9px] tracking-[0.2em] uppercase font-semibold">IT Support Dashboard</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white/60 text-sm hidden sm:block">
            {user?.name} · <span className="text-amber-400">IT Support</span>
          </span>
          <button onClick={() => signOut({ callbackUrl: '/portal/login' })}
            className="flex items-center gap-1.5 text-white/60 hover:text-white text-sm transition-colors">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Users', value: stats?.totalUsers ?? 0, icon: Users, color: 'bg-blue-50 text-blue-600' },
            { label: 'Active Clients', value: stats?.clientCount ?? 0, icon: Activity, color: 'bg-green-50 text-green-600' },
            { label: 'Open Tickets', value: openCount, icon: TicketIcon, color: 'bg-orange-50 text-orange-600' },
            { label: 'In Progress', value: inProgressCount, icon: Server, color: 'bg-amber-50 text-amber-600' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-navy-800 font-serif">{s.value}</div>
              <div className="text-gray-400 text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* System health */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit">
            <div className="flex items-center gap-2 mb-5">
              <Database className="w-4 h-4 text-amber-500" />
              <h2 className="font-serif font-bold text-navy-800">System Health</h2>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Database', status: 'Operational' },
                { label: 'Authentication', status: 'Operational' },
                { label: 'Dropbox Storage', status: 'Operational' },
                { label: 'Next.js Server', status: 'Operational' },
                { label: 'Email Service', status: 'Configure SMTP' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{item.label}</span>
                  <span className={`flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${
                    item.status === 'Operational' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-600'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'Operational' ? 'bg-green-500' : 'bg-amber-400'}`} />
                    {item.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Tab switcher */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex gap-2">
                <button onClick={() => setActiveTab('tickets')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-colors ${
                    activeTab === 'tickets' ? 'bg-amber-400 text-navy-900' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}>
                  Tickets ({tickets.length})
                </button>
                <button onClick={() => setActiveTab('users')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-colors ${
                    activeTab === 'users' ? 'bg-amber-400 text-navy-900' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}>
                  Users ({allUsers.length})
                </button>
              </div>
            </div>
          </div>

          {/* Main panel */}
          <div className="lg:col-span-2 space-y-4">

            {/* ── TICKETS TAB ── */}
            {activeTab === 'tickets' && (
              <>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Search tickets…" value={ticketSearch}
                      onChange={(e) => setTicketSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white" />
                  </div>
                  <select value={ticketFilter} onChange={(e) => setTicketFilter(e.target.value)}
                    className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white">
                    <option value="all">All Status</option>
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-50">
                    <h2 className="font-serif font-bold text-navy-800">
                      Support Tickets ({filteredTickets.length})
                    </h2>
                  </div>

                  {filteredTickets.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <TicketIcon className="w-10 h-10 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">No tickets found.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-50 max-h-[600px] overflow-y-auto">
                      {filteredTickets.map((t) => (
                        <div key={t.id} className="hover:bg-gray-50 transition-colors">
                          <button
                            onClick={() => setExpandedTicket(expandedTicket === t.id ? null : t.id)}
                            className="w-full flex items-start gap-3 px-5 py-4 text-left"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className="text-xs font-mono text-gray-400">{t.ticketNo}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLE[t.status]}`}>
                                  {t.status.replace('_', ' ')}
                                </span>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITY_STYLE[t.priority]}`}>
                                  {t.priority}
                                </span>
                              </div>
                              <p className="font-medium text-navy-800 text-sm truncate">{t.subject}</p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                {t.user.name} · {t.category} · {new Date(t.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 mt-1 transition-transform ${expandedTicket === t.id ? 'rotate-180' : ''}`} />
                          </button>

                          {expandedTicket === t.id && (
                            <div className="px-5 pb-5 space-y-4 border-t border-gray-100 pt-4">
                              {/* Client info */}
                              <div className="flex items-center gap-3 text-xs text-gray-500 bg-gray-50 rounded-xl p-3">
                                <div className="w-7 h-7 bg-amber-100 rounded-full flex items-center justify-center font-bold text-amber-700 text-sm">
                                  {t.user.name[0]}
                                </div>
                                <div>
                                  <p className="font-semibold text-navy-800">{t.user.name}</p>
                                  <p>{t.user.email} · {t.user.customerId}</p>
                                </div>
                              </div>

                              {/* Message */}
                              <div>
                                <p className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide">Issue</p>
                                <p className="text-sm text-gray-700 bg-blue-50 rounded-xl p-3">{t.message}</p>
                              </div>

                              {/* Existing response */}
                              {t.response && (
                                <div className="bg-green-50 border border-green-100 rounded-xl p-3">
                                  <div className="flex items-center gap-2 mb-1">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                                    <span className="text-xs font-semibold text-green-700">Your Response</span>
                                  </div>
                                  <p className="text-sm text-gray-700">{t.response}</p>
                                </div>
                              )}

                              {/* Status actions */}
                              {t.status !== 'resolved' && t.status !== 'closed' && (
                                <div className="space-y-3">
                                  <textarea
                                    value={responses[t.id] || ''}
                                    onChange={(e) => setResponses({ ...responses, [t.id]: e.target.value })}
                                    placeholder="Type your response to the client..."
                                    rows={3}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 resize-none"
                                  />
                                  <div className="flex gap-2 flex-wrap">
                                    {t.status === 'open' && (
                                      <button
                                        onClick={() => updateTicket(t.id, 'in_progress')}
                                        disabled={updatingTicket === t.id}
                                        className="flex items-center gap-1.5 px-3 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 text-xs font-semibold rounded-xl transition-colors disabled:opacity-50"
                                      >
                                        <Clock className="w-3.5 h-3.5" />
                                        Mark In Progress
                                      </button>
                                    )}
                                    <button
                                      onClick={() => updateTicket(t.id, 'resolved', responses[t.id] || t.response || '')}
                                      disabled={updatingTicket === t.id || !responses[t.id]?.trim()}
                                      className="flex items-center gap-1.5 px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50"
                                    >
                                      <Send className="w-3.5 h-3.5" />
                                      {updatingTicket === t.id ? 'Saving...' : 'Resolve & Send'}
                                    </button>
                                    <button
                                      onClick={() => updateTicket(t.id, 'closed')}
                                      disabled={updatingTicket === t.id}
                                      className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold rounded-xl transition-colors disabled:opacity-50"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                      Close
                                    </button>
                                  </div>
                                </div>
                              )}

                              {(t.status === 'resolved' || t.status === 'closed') && (
                                <div className="flex items-center gap-2 text-xs text-green-600 font-medium">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Ticket {t.status} · Client notified via email
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ── USERS TAB ── */}
            {activeTab === 'users' && (
              <>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" placeholder="Search users…" value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white" />
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-50">
                    <h2 className="font-serif font-bold text-navy-800">User Directory ({filteredUsers.length})</h2>
                  </div>
                  <div className="divide-y divide-gray-50 max-h-96 overflow-y-auto">
                    {filteredUsers.map((u) => (
                      <div key={u.id} className="px-5 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-semibold text-gray-600 text-sm shrink-0">
                          {u.name[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-navy-800 truncate">{u.name}</p>
                          <p className="text-xs text-gray-400 truncate">{u.email}</p>
                        </div>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${ROLE_COLORS[u.role] ?? 'bg-gray-100 text-gray-600'}`}>
                          {ROLE_LABELS[u.role] ?? u.role}
                        </span>
                        <button onClick={() => viewDocuments(u)}
                          className="text-amber-500 hover:text-amber-600 transition-colors shrink-0" title="View documents">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {filteredUsers.length === 0 && <p className="text-center text-gray-400 text-sm py-8">No users found.</p>}
                  </div>
                </div>

                {viewingUser && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-navy-800 text-sm">{viewingUser.name}'s Documents</p>
                        <p className="font-mono text-xs text-gray-400">{viewingUser.customerId}</p>
                      </div>
                      <button onClick={() => setViewingUser(null)} className="text-gray-300 hover:text-gray-600">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-4">
                      {filesLoading ? (
                        <div className="flex items-center justify-center py-6 gap-2 text-gray-400">
                          <RefreshCw className="w-4 h-4 animate-spin" /><span className="text-xs">Loading…</span>
                        </div>
                      ) : userFiles.length === 0 ? (
                        <p className="text-gray-400 text-xs text-center py-6">No documents uploaded.</p>
                      ) : (
                        <div className="space-y-2">
                          {userFiles.map((f) => (
                            <div key={f.path} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-amber-50 transition-colors group">
                              <FileText className="w-4 h-4 text-amber-500 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-navy-800 truncate">{f.name}</p>
                                <p className="text-gray-400 text-[10px]">{formatFileSize(f.size)}</p>
                              </div>
                              <button onClick={() => handleDownload(f.path)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-500 hover:text-amber-600">
                                <Download className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
