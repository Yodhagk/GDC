'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Users, FileText, Shield, TrendingUp, LogOut, RefreshCw,
  Trash2, Eye, ChevronDown, DollarSign, UserCheck, Wrench,
  Search, Download, X, CheckCircle, AlertCircle,
} from 'lucide-react';
import { formatDate, formatFileSize, getFileIcon } from '@/lib/utils';
import toast from 'react-hot-toast';

type UserRow = {
  id: string;
  name: string;
  email: string;
  customerId: string;
  role: string;
  createdAt: string;
};

type FileItem = { name: string; path: string; size: number; modified: string };

type Stats = { totalUsers: number; clientCount: number; adminCount: number; itCount: number };

const ROLE_LABELS: Record<string, string> = {
  client: 'Client',
  admin: 'Admin',
  it_support: 'IT Support',
};

const ROLE_COLORS: Record<string, string> = {
  client: 'bg-blue-100 text-blue-700',
  admin: 'bg-purple-100 text-purple-700',
  it_support: 'bg-amber-100 text-amber-700',
};

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [stats, setStats] = useState<Stats | null>(null);
  const [recentUsers, setRecentUsers] = useState<UserRow[]>([]);
  const [allUsers, setAllUsers] = useState<UserRow[]>([]);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'users'>('overview');
  const [loading, setLoading] = useState(true);

  // Document viewer state
  const [viewingUser, setViewingUser] = useState<UserRow | null>(null);
  const [userFiles, setUserFiles] = useState<FileItem[]>([]);
  const [filesLoading, setFilesLoading] = useState(false);

  // Role change state
  const [roleMenu, setRoleMenu] = useState<string | null>(null);

  const user = session?.user as any;

  useEffect(() => {
    if (status === 'unauthenticated') { router.replace('/portal/login'); return; }
    if (status === 'authenticated' && user?.role !== 'admin') { router.replace('/portal'); }
  }, [status, user, router]);

  const fetchStats = useCallback(async () => {
    const res = await fetch('/api/admin/stats');
    if (res.ok) {
      const data = await res.json();
      setStats(data.stats);
      setRecentUsers(data.recentUsers);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    const res = await fetch('/api/admin/users');
    if (res.ok) {
      const data = await res.json();
      setAllUsers(data.users);
    }
  }, []);

  useEffect(() => {
    if (status !== 'authenticated') return;
    setLoading(true);
    Promise.all([fetchStats(), fetchUsers()]).finally(() => setLoading(false));
  }, [status, fetchStats, fetchUsers]);

  const deleteUser = async (id: string, name: string) => {
    if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success(`User "${name}" deleted`);
      await Promise.all([fetchStats(), fetchUsers()]);
    } else {
      const d = await res.json();
      toast.error(d.error ?? 'Delete failed');
    }
  };

  const changeRole = async (id: string, newRole: string) => {
    setRoleMenu(null);
    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, role: newRole }),
    });
    if (res.ok) {
      toast.success('Role updated');
      await Promise.all([fetchStats(), fetchUsers()]);
    } else {
      toast.error('Failed to update role');
    }
  };

  const viewDocuments = async (u: UserRow) => {
    setViewingUser(u);
    setUserFiles([]);
    setFilesLoading(true);
    const res = await fetch(`/api/admin/documents?customerId=${u.customerId}`);
    if (res.ok) {
      const data = await res.json();
      setUserFiles(data.files ?? []);
    }
    setFilesLoading(false);
  };

  const handleDownload = async (path: string) => {
    try {
      const res = await fetch(`/api/files/download?path=${encodeURIComponent(path)}`);
      if (!res.ok) throw new Error();
      const { url } = await res.json();
      window.open(url, '_blank');
    } catch {
      toast.error('Could not generate download link');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-6 h-6 animate-spin text-gold-400" />
      </div>
    );
  }

  const filtered = allUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.customerId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-navy-800 text-white px-6 py-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gold-400 rounded-full flex items-center justify-center">
            <DollarSign className="w-4 h-4 text-navy-900" strokeWidth={2.5} />
          </div>
          <div>
            <div className="font-serif font-bold text-lg leading-none">Golden Dollar</div>
            <div className="text-gold-400 text-[9px] tracking-[0.2em] uppercase font-semibold">Owner Dashboard</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white/60 text-sm hidden sm:block">
            {user?.name} · <span className="text-gold-400">Admin</span>
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
        {/* Tab navigation */}
        <div className="flex gap-1 mb-8 bg-white rounded-xl p-1 shadow-sm border border-gray-100 w-fit">
          {(['overview', 'users'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                activeTab === tab
                  ? 'bg-navy-800 text-white shadow'
                  : 'text-gray-500 hover:text-navy-800'
              }`}
            >
              {tab === 'overview' ? '📊 Overview' : '👥 Users'}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <>
            {/* Stats grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Users', value: stats?.totalUsers ?? 0, icon: Users, color: 'bg-blue-50 text-blue-600' },
                { label: 'Clients', value: stats?.clientCount ?? 0, icon: UserCheck, color: 'bg-green-50 text-green-600' },
                { label: 'Admins', value: stats?.adminCount ?? 0, icon: Shield, color: 'bg-purple-50 text-purple-600' },
                { label: 'IT Support', value: stats?.itCount ?? 0, icon: Wrench, color: 'bg-amber-50 text-amber-600' },
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

            {/* Recent signups */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                <h2 className="font-serif font-bold text-navy-800">Recent Client Registrations</h2>
                <TrendingUp className="w-4 h-4 text-gold-400" />
              </div>
              <div className="divide-y divide-gray-50">
                {recentUsers.length === 0 && (
                  <p className="text-gray-400 text-sm text-center py-8">No clients yet.</p>
                )}
                {recentUsers.map((u) => (
                  <div key={u.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                    <div className="w-9 h-9 bg-gold-100 rounded-full flex items-center justify-center font-serif font-bold text-gold-600 shrink-0">
                      {u.name[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-navy-800 text-sm truncate">{u.name}</p>
                      <p className="text-gray-400 text-xs truncate">{u.email}</p>
                    </div>
                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 shrink-0">
                      {u.customerId}
                    </span>
                    <span className="text-gray-400 text-xs shrink-0 hidden sm:block">
                      {formatDate(u.createdAt)}
                    </span>
                    <button
                      onClick={() => { setActiveTab('users'); viewDocuments(u); }}
                      className="text-gold-500 hover:text-gold-600 transition-colors shrink-0"
                      title="View documents"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'users' && (
          <>
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email or Customer ID…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 bg-white"
              />
            </div>

            <div className="flex gap-6">
              {/* User table */}
              <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${viewingUser ? 'flex-1' : 'w-full'}`}>
                <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                  <h2 className="font-serif font-bold text-navy-800">
                    All Users <span className="text-gray-400 font-sans font-normal text-sm">({filtered.length})</span>
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-50">
                        <th className="text-left px-6 py-3 text-xs text-gray-400 font-semibold uppercase tracking-wider">Name</th>
                        <th className="text-left px-4 py-3 text-xs text-gray-400 font-semibold uppercase tracking-wider hidden md:table-cell">Customer ID</th>
                        <th className="text-left px-4 py-3 text-xs text-gray-400 font-semibold uppercase tracking-wider">Role</th>
                        <th className="text-left px-4 py-3 text-xs text-gray-400 font-semibold uppercase tracking-wider hidden lg:table-cell">Joined</th>
                        <th className="px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filtered.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-3">
                            <div className="font-medium text-navy-800 truncate max-w-[160px]">{u.name}</div>
                            <div className="text-gray-400 text-xs truncate max-w-[160px]">{u.email}</div>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{u.customerId}</span>
                          </td>
                          <td className="px-4 py-3 relative">
                            <button
                              onClick={() => setRoleMenu(roleMenu === u.id ? null : u.id)}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${ROLE_COLORS[u.role] ?? 'bg-gray-100 text-gray-600'}`}
                            >
                              {ROLE_LABELS[u.role] ?? u.role}
                              {u.role !== 'admin' && <ChevronDown className="w-3 h-3" />}
                            </button>
                            {roleMenu === u.id && u.role !== 'admin' && (
                              <div className="absolute z-20 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg py-1 w-36">
                                {['client', 'it_support'].filter((r) => r !== u.role).map((r) => (
                                  <button
                                    key={r}
                                    onClick={() => changeRole(u.id, r)}
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-navy-800 capitalize"
                                  >
                                    {ROLE_LABELS[r]}
                                  </button>
                                ))}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-xs hidden lg:table-cell">
                            {formatDate(u.createdAt)}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2 justify-end">
                              <button
                                onClick={() => viewDocuments(u)}
                                className="text-gold-500 hover:text-gold-600 transition-colors"
                                title="View documents"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              {u.role !== 'admin' && (
                                <button
                                  onClick={() => deleteUser(u.id, u.name)}
                                  className="text-gray-300 hover:text-red-500 transition-colors"
                                  title="Delete user"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filtered.length === 0 && (
                    <p className="text-gray-400 text-sm text-center py-10">No users match your search.</p>
                  )}
                </div>
              </div>

              {/* Document viewer panel */}
              {viewingUser && (
                <div className="w-80 shrink-0 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                  <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-navy-800 text-sm">{viewingUser.name}</p>
                      <p className="font-mono text-xs text-gray-400">{viewingUser.customerId}</p>
                    </div>
                    <button onClick={() => setViewingUser(null)} className="text-gray-300 hover:text-gray-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {filesLoading && (
                      <div className="flex items-center justify-center py-8 gap-2 text-gray-400">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span className="text-xs">Loading…</span>
                      </div>
                    )}
                    {!filesLoading && userFiles.length === 0 && (
                      <p className="text-gray-400 text-xs text-center py-8">
                        No documents uploaded yet.
                      </p>
                    )}
                    {userFiles.map((f) => (
                      <div
                        key={f.path}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gold-50 transition-colors group"
                      >
                        <FileText className="w-4 h-4 text-gold-500 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-navy-800 truncate">{f.name}</p>
                          <p className="text-gray-400 text-[10px]">{formatFileSize(f.size)}</p>
                        </div>
                        <button
                          onClick={() => handleDownload(f.path)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-gold-500 hover:text-gold-600"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
