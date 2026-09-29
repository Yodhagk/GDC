'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Users, FileText, Shield, TrendingUp, LogOut, RefreshCw,
  Trash2, Eye, ChevronDown, DollarSign, UserCheck, Wrench,
  Search, Download, X, CheckCircle, AlertCircle, MailCheck,
  UserX, UserCheck2, Send, ExternalLink,
} from 'lucide-react';
import { formatDate, formatFileSize, getFileIcon } from '@/lib/utils';
import toast from 'react-hot-toast';
import CustomerFiles from '@/components/CustomerFiles';
import BackupRootPicker from '@/components/BackupRootPicker';
import BackupStatus from '@/components/BackupStatus';

type UserRow = {
  id: string;
  name: string;
  email: string;
  customerId: string;
  role: string;
  isActive: boolean;
  backupPlan: boolean;
  emailVerified: string | null;
  createdAt: string;
};


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
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'backup'>('overview');
  const [loading, setLoading] = useState(true);

  // Document viewer state
  const [viewingUser, setViewingUser] = useState<UserRow | null>(null);

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

  const patchUser = async (id: string, body: Record<string, unknown>) => {
    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...body }),
    });
    if (res.ok) {
      await fetchUsers();
    } else {
      const d = await res.json().catch(() => ({}));
      toast.error(d.error ?? 'Update failed');
    }
    return res.ok;
  };

  const toggleActive = async (u: UserRow) => {
    const next = !u.isActive;
    if (next === false && !confirm(`Deactivate "${u.name}"? They will be signed out and unable to log in until reactivated.`)) return;
    if (await patchUser(u.id, { isActive: next })) {
      toast.success(next ? `${u.name} reactivated` : `${u.name} deactivated`);
    }
  };

  const forceVerify = async (u: UserRow) => {
    if (await patchUser(u.id, { forceVerify: true })) toast.success(`${u.name}'s email marked as verified`);
  };

  const resendVerification = async (u: UserRow) => {
    if (await patchUser(u.id, { resendVerification: true })) toast.success(`Verification email resent to ${u.email}`);
  };

  const viewDocuments = (u: UserRow) => setViewingUser(u);

  const [openingDropbox, setOpeningDropbox] = useState(false);
  const openInDropbox = async (customerId: string) => {
    setOpeningDropbox(true);
    try {
      const res = await fetch(`/api/admin/documents/dropbox-link?customerId=${customerId}`);
      if (!res.ok) throw new Error();
      const { url } = await res.json();
      window.open(url, '_blank');
    } catch {
      toast.error('Could not open Dropbox folder');
    } finally {
      setOpeningDropbox(false);
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
          {(['overview', 'users', 'backup'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                activeTab === tab
                  ? 'bg-navy-800 text-white shadow'
                  : 'text-gray-500 hover:text-navy-800'
              }`}
            >
              {tab === 'overview' ? '📊 Overview' : tab === 'users' ? '👥 Users' : '☁️ Backup Status'}
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

            <BackupRootPicker />

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

        {activeTab === 'backup' && <BackupStatus />}

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
                        <th className="text-left px-4 py-3 text-xs text-gray-400 font-semibold uppercase tracking-wider">Status</th>
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
                          <td className="px-4 py-3">
                            <div className="flex flex-col gap-1 items-start">
                              <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                u.isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${u.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                                {u.isActive ? 'Active' : 'Deactivated'}
                              </span>
                              {u.emailVerified ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-gray-400">
                                  <MailCheck className="w-3 h-3 text-green-500" /> Verified
                                </span>
                              ) : (
                                <button
                                  onClick={() => forceVerify(u)}
                                  className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-600 hover:text-amber-700"
                                  title="Click to mark verified without waiting for the email link"
                                >
                                  <AlertCircle className="w-3 h-3" /> Unverified — force verify
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-xs hidden lg:table-cell">
                            {formatDate(u.createdAt)}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2 justify-end">
                              {!u.emailVerified && (
                                <button
                                  onClick={() => resendVerification(u)}
                                  className="text-gray-300 hover:text-blue-500 transition-colors"
                                  title="Resend verification email"
                                >
                                  <Send className="w-4 h-4" />
                                </button>
                              )}
                              {u.role !== 'admin' && (
                                <button
                                  onClick={() => toggleActive(u)}
                                  className={`transition-colors ${u.isActive ? 'text-gray-300 hover:text-red-500' : 'text-gray-300 hover:text-green-500'}`}
                                  title={u.isActive ? 'Deactivate account' : 'Reactivate account'}
                                >
                                  {u.isActive ? <UserX className="w-4 h-4" /> : <UserCheck2 className="w-4 h-4" />}
                                </button>
                              )}
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
                <div className="w-[28rem] shrink-0 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                  <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-navy-800 text-sm">{viewingUser.name}</p>
                      <p className="font-mono text-xs text-gray-400">{viewingUser.customerId}</p>
                    </div>
                    <button onClick={() => setViewingUser(null)} className="text-gray-300 hover:text-gray-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="px-4 pt-3">
                    <button
                      onClick={() => openInDropbox(viewingUser.customerId)}
                      disabled={openingDropbox}
                      className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg py-2 transition-colors disabled:opacity-60"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      {openingDropbox ? 'Opening…' : 'Open Folder in Dropbox'}
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4">
                    <CustomerFiles
                      key={viewingUser.id}
                      customerId={viewingUser.customerId}
                      backupPlan={!!(allUsers.find((x) => x.id === viewingUser.id) ?? viewingUser).backupPlan}
                      onToggleBackup={(next) => patchUser(viewingUser.id, { backupPlan: next }).then((ok) => ok && toast.success(next ? 'Backup plan activated' : 'Backup plan turned off'))}
                    />
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
