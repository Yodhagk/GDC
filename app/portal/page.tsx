'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import FileUpload from '@/components/FileUpload';
import FileList from '@/components/FileList';
import { Copy, LogOut, UploadCloud, FolderOpen, Shield, User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PortalDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState<'upload' | 'files'>('upload');

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/portal/login');
  }, [status, router]);

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

  const handleUploadSuccess = () => {
    setRefreshKey((k) => k + 1);
    setActiveTab('files');
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
                <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                  Your Customer ID
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-serif text-3xl font-bold text-navy-800 tracking-wider">
                  {customerId}
                </span>
                <button
                  onClick={copyId}
                  className="text-gray-300 hover:text-gold-400 transition-colors"
                  title="Copy ID"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <p className="text-gray-400 text-xs mt-1">
                Use this ID when communicating with your consultant.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-green-50 border border-green-100 text-green-700 text-xs px-3 py-1.5 rounded-full">
              <Shield className="w-3.5 h-3.5" />
              Encrypted & Secure
            </div>
          </div>
        </div>

        {/* Document section */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'upload'
                  ? 'text-gold-500 border-b-2 border-gold-400 -mb-px'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              Upload Documents
            </button>
            <button
              onClick={() => setActiveTab('files')}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'files'
                  ? 'text-gold-500 border-b-2 border-gold-400 -mb-px'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <FolderOpen className="w-4 h-4" />
              My Documents
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'upload' ? (
              <div>
                <p className="text-sm text-gray-500 mb-5">
                  Upload your tax documents securely. Files are stored in your private Dropbox folder
                  under <span className="font-mono text-navy-700 bg-gray-100 px-1.5 py-0.5 rounded">/GoldenDollarConsultancy/{customerId}/</span>
                </p>
                <FileUpload onUploadSuccess={handleUploadSuccess} />
              </div>
            ) : (
              <FileList refreshKey={refreshKey} />
            )}
          </div>
        </div>

        {/* Document checklist */}
        <div className="bg-gold-50 border border-gold-200 rounded-2xl p-6">
          <h3 className="font-serif font-bold text-navy-800 mb-4">Tax Document Checklist</h3>
          <div className="grid sm:grid-cols-2 gap-2">
            {[
              'W-2 Form(s) from employer(s)',
              '1099 Forms (freelance/interest/dividends)',
              'Last year\'s tax return',
              'Social Security numbers (all household)',
              'Mortgage interest statement (1098)',
              'Charitable donation receipts',
              'Business expense receipts',
              'Health insurance documents (1095)',
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
