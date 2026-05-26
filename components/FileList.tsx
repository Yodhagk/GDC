'use client';

import { useEffect, useState, useCallback } from 'react';
import { FileText, Image as ImageIcon, Table2, File, Download, RefreshCw, FolderOpen } from 'lucide-react';
import { formatFileSize, formatDate, getFileIcon } from '@/lib/utils';

interface FileItem {
  name: string;
  path: string;
  size: number;
  modified: string;
}

function FileIcon({ type }: { type: string }) {
  const base = 'w-8 h-8 rounded-lg flex items-center justify-center shrink-0';
  if (type === 'pdf') return <div className={`${base} bg-red-100`}><FileText className="w-4 h-4 text-red-500" /></div>;
  if (type === 'excel') return <div className={`${base} bg-green-100`}><Table2 className="w-4 h-4 text-green-600" /></div>;
  if (type === 'image') return <div className={`${base} bg-blue-100`}><ImageIcon className="w-4 h-4 text-blue-500" /></div>;
  return <div className={`${base} bg-gray-100`}><File className="w-4 h-4 text-gray-500" /></div>;
}

export default function FileList({ refreshKey }: { refreshKey: number }) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/files');
      if (!res.ok) throw new Error('Failed to load files');
      const data = await res.json();
      setFiles(data.files ?? []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles, refreshKey]);

  const handleDownload = async (path: string, name: string) => {
    try {
      const res = await fetch(`/api/files/download?path=${encodeURIComponent(path)}`);
      if (!res.ok) throw new Error();
      const { url } = await res.json();
      window.open(url, '_blank');
    } catch {
      alert('Could not generate download link. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 gap-3 text-gray-400">
        <RefreshCw className="w-5 h-5 animate-spin" />
        <span className="text-sm">Loading your documents…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-sm mb-3">{error}</p>
        <button onClick={fetchFiles} className="text-gold-500 hover:text-gold-600 text-sm font-medium">
          Try again
        </button>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-14">
        <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FolderOpen className="w-7 h-7 text-gray-300" />
        </div>
        <p className="text-navy-800 font-semibold text-sm">No documents yet</p>
        <p className="text-gray-400 text-xs mt-1">Upload your first document using the area above.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">{files.length} document{files.length !== 1 ? 's' : ''}</p>
        <button
          onClick={fetchFiles}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-navy-700 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      <div className="space-y-2">
        {files.map((file) => (
          <div
            key={file.path}
            className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-gold-50 border border-gray-100 hover:border-gold-200 rounded-xl transition-all duration-200 group"
          >
            <FileIcon type={getFileIcon(file.name)} />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-navy-800 text-sm truncate">{file.name}</p>
              <p className="text-gray-400 text-xs mt-0.5">
                {formatFileSize(file.size)} · Uploaded {formatDate(file.modified)}
              </p>
            </div>
            <button
              onClick={() => handleDownload(file.path, file.name)}
              className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 text-xs text-gold-500 hover:text-gold-600 font-medium"
              title="Download"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
