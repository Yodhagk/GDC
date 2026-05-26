'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Users, Shield, RefreshCw, LogOut, DollarSign, Eye,
  CheckCircle, Database, Server, Activity, Search,
  FileText, Download, X,
} from 'lucide-react';
import { formatDate, formatFileSize } from '@/lib/utils';
import toast from 'react-hot-toast';

type UserRow = { id: string; name: string; email: string; customerId: string; role: string; createdAt: string };
type FileItem = { name: string; path: string; size: number; modified: string };
type Stats = { totalUsers: number; clientCount: number; adminCount: number; itCount: number };

const ROLE_COLORS: Record<string, string> = {
  client: 'bg-blue-100 text-blue-700',
  admin: 'bg-purple-100 text-purple-700',
  it_support: 'bg-amber-100 text-amber-700',
};

const ROLE_LABELS: Record<string, string> = {
  client: 'Client', admin: 'Admin', it_support: 'IT Support',
};

export default function ITSupportDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [stats, setStats] = useState<Stats | null>(null);
  const [allUsers, setAllUsers] = useState<UserRow[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewingUser, setViewingUser] = useState<UserRow | null>(null);
  const [userFiles, setUserFiles] = useState<FileItem[]>([]);
  const [filesLoading, setFilesLoading] = useState(false);

  const user = session?.user as any;

  useEffect(() => {
    if (status === 'unauthenticated') { router.replace('/portal/login'); return; }
    if (status === 'authenticated' && !['admin', 'it_support'].includes(user?.role)) {
      router.replace('/portal');
    }
  }, [status, user, router]);

  const fetchData = useCallback(async () => {
    const [statsRes, usersRes] = await Promise.all([
      fetch('/api/admin/stats'),
      fetch('/api/admin/users'),
    ]);
    if (statsRes.ok) { const d = await statsRes.json(); setStats(d.stats); }
    if (usersRes.ok) { const d = await usersRes.json(); setAllUsers(d.users); }
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

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-6 h-6 animate-spin text-amber-500" />
      </div>
    );
  }

  const filtered = allUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.customerId.toLowerCase().includes(search.toLowerCase())
  );

  const systemChecks = [
    { label: 'Database connection', ok: true },
    { label: 'Authentication service', ok: true },
    { label: 'Dropbox API configured', ok: !!process.env.DROPBOX_ACCESS_TOKEN },
    { label: 'Email service', ok: false },
  ];

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
          <button
            onClick={() => signOut({ callbackUrl: '/portal/login' })}
            className="flex items-center gap-1.5 text-white/60 hover:text-white text-sm transition-colors"
          >
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
            { label: 'Admin Accounts', value: stats?.adminCount ?? 0, icon: Shield, color: 'bg-purple-50 text-purple-600' },
            { label: 'IT Support Staff', value: stats?.itCount ?? 0, icon: Server, color: 'bg-amber-50 text-amber-600' },
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
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
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
                { label: 'Email Service', status: 'Not configured' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{item.label}</span>
                  <span className={`flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${
                    item.status === 'Operational'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      item.status === 'Operational' ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                    {item.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <h3 className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-3">Quick Info</h3>
              <div className="space-y-2 text-xs text-gray-500">
                <div className="flex justify-between"><span>Framework</span><span className="font-medium text-navy-800">Next.js 14</span></div>
                <div className="flex justify-between"><span>Database</span><span className="font-medium text-navy-800">SQLite (dev)</span></div>
                <div className="flex justify-between"><span>Auth</span><span className="font-medium text-navy-800">NextAuth v4</span></div>
                <div className="flex justify-between"><span>Storage</span><span className="font-medium text-navy-800">Dropbox SDK v10</span></div>
              </div>
            </div>
          </div>

          {/* Users + document viewer */}
          <div className="lg:col-span-2 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
              />
            </div>

            <div className={`flex gap-4 ${viewingUser ? '' : ''}`}>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex-1">
                <div className="px-5 py-4 border-b border-gray-50">
                  <h2 className="font-serif font-bold text-navy-800">User Directory ({filtered.length})</h2>
                </div>
                <div className="divide-y divide-gray-50 max-h-96 overflow-y-auto">
                  {filtered.map((u) => (
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
                      <button
                        onClick={() => viewDocuments(u)}
                        className="text-amber-500 hover:text-amber-600 transition-colors shrink-0"
                        title="View documents"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {filtered.length === 0 && (
                    <p className="text-center text-gray-400 text-sm py-8">No users found.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Document viewer */}
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
                          <button
                            onClick={() => handleDownload(f.path)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-500 hover:text-amber-600"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
