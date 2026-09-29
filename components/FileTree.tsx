'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  ChevronRight, Folder, FolderOpen, FileText, Image as ImageIcon, Table2, File,
  Download, Lock, Clock, RefreshCw, Search, X, ChevronsUpDown, Eye,
} from 'lucide-react';
import { formatFileSize, formatDate, formatDateTime, getFileIcon } from '@/lib/utils';

interface FileItem {
  name: string;
  path: string;
  relPath?: string;
  size: number;
  modified: string;
  category: string;
}

type TreeNode =
  | { type: 'folder'; name: string; key: string; children: TreeNode[]; fileCount: number }
  | { type: 'file'; name: string; key: string; file: FileItem };

const PREVIEWABLE = ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'txt', 'csv'];

const extOf = (name: string) => name.split('.').pop()?.toLowerCase() ?? '';

function buildTree(files: FileItem[], folders: string[] = []): TreeNode[] {
  const root: TreeNode[] = [];
  // Empty folders are added as file-less paths; a placeholder tail segment is dropped below.
  const entries: { parts: string[]; file?: FileItem }[] = [
    ...folders.map((f) => ({ parts: [...f.split('/').filter(Boolean), ''] })),
    ...files.map((file) => ({ parts: (file.relPath ?? file.name).split('/').filter(Boolean), file })),
  ];
  for (const { parts, file } of entries) {
    let level = root;
    let key = '';
    parts.slice(0, -1).forEach((part) => {
      key += `/${part}`;
      let folder = level.find((n) => n.type === 'folder' && n.name === part) as
        | Extract<TreeNode, { type: 'folder' }> | undefined;
      if (!folder) {
        folder = { type: 'folder', name: part, key, children: [], fileCount: 0 };
        level.push(folder);
      }
      if (file) folder.fileCount++;
      level = folder.children;
    });
    if (file) level.push({ type: 'file', name: file.name, key: file.path, file });
  }
  const sort = (nodes: TreeNode[]) => {
    nodes.sort((a, b) => (a.type === b.type ? a.name.localeCompare(b.name) : a.type === 'folder' ? -1 : 1));
    nodes.forEach((n) => n.type === 'folder' && sort(n.children));
  };
  sort(root);
  return root;
}

function collectFolderKeys(nodes: TreeNode[], out: string[] = []): string[] {
  nodes.forEach((n) => {
    if (n.type === 'folder') {
      out.push(n.key);
      collectFolderKeys(n.children, out);
    }
  });
  return out;
}

function filterTree(nodes: TreeNode[], q: string): TreeNode[] {
  return nodes.flatMap((n): TreeNode[] => {
    if (n.type === 'file') return n.name.toLowerCase().includes(q) ? [n] : [];
    const children = filterTree(n.children, q);
    return children.length ? [{ ...n, children }] : [];
  });
}

function FileGlyph({ name, className = 'w-4 h-4' }: { name: string; className?: string }) {
  const type = getFileIcon(name);
  if (type === 'pdf') return <FileText className={`${className} text-red-500`} />;
  if (type === 'excel') return <Table2 className={`${className} text-green-600`} />;
  if (type === 'image') return <ImageIcon className={`${className} text-blue-500`} />;
  if (type === 'word') return <FileText className={`${className} text-blue-700`} />;
  return <File className={`${className} text-gray-500`} />;
}

export default function FileTree({
  refreshKey = 0,
  endpoint = '/api/files',
  layout = 'split',
  canDownload = true,
  selectedFolder,
  onFolderSelect,
  onUpgradeClick,
}: {
  refreshKey?: number;
  /** API that returns `{ files }`; staff views pass the per-customer admin endpoint. */
  endpoint?: string;
  /** `stacked` puts the preview under the tree, for narrow panels. */
  layout?: 'split' | 'stacked';
  /** false = free plan: preview only, downloads show an upgrade notice. */
  canDownload?: boolean;
  /** Backup mode: clicking a folder selects it (relative path, '' = top level), e.g. as an upload destination. */
  selectedFolder?: string;
  onFolderSelect?: (relPath: string) => void;
  /** Called from the free-plan sync warning's upgrade link. */
  onUpgradeClick?: () => void;
}) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [folders, setFolders] = useState<string[]>([]);
  const [sync, setSync] = useState<{ mode: 'live' | 'delayed'; syncedAt: string; nextSyncAt?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<FileItem | null>(null);
  const [query, setQuery] = useState('');
  const [previewError, setPreviewError] = useState(false);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error('Failed to load files');
      const data = await res.json();
      const list: FileItem[] = data.files ?? [];
      const dirs: string[] = data.folders ?? [];
      setFiles(list);
      setFolders(dirs);
      setSync(data.sync ?? null);
      setExpanded(new Set(collectFolderKeys(buildTree(list, dirs)))); // start fully expanded
      setSelected((cur) => (cur && list.some((f) => f.path === cur.path) ? cur : null));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles, refreshKey]);

  useEffect(() => setPreviewError(false), [selected?.path]);

  const tree = useMemo(() => buildTree(files, folders), [files, folders]);
  const q = query.trim().toLowerCase();
  const visibleTree = useMemo(() => (q ? filterTree(tree, q) : tree), [tree, q]);
  const allFolderKeys = useMemo(() => collectFolderKeys(tree), [tree]);
  const allExpanded = allFolderKeys.length > 0 && allFolderKeys.every((k) => expanded.has(k));

  const toggle = (key: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  const handleDownload = async (file: FileItem) => {
    if (!canDownload) {
      alert('Downloads are available on the Backup plan ($25/month). Ask us to upgrade your account.');
      return;
    }
    try {
      const res = await fetch(`/api/files/download?path=${encodeURIComponent(file.path)}`);
      if (!res.ok) throw new Error();
      const { url } = await res.json();
      window.open(url, '_blank', 'noopener');
    } catch {
      alert('Could not generate download link. Please try again.');
    }
  };

  const renderNodes = (nodes: TreeNode[], depth: number): React.ReactNode =>
    nodes.map((node) => {
      const pad = { paddingLeft: `${depth * 16 + 8}px` };
      if (node.type === 'folder') {
        const open = q ? true : expanded.has(node.key);
        return (
          <div key={node.key} role="treeitem" aria-expanded={open}>
            <button
              onClick={() => {
                toggle(node.key);
                onFolderSelect?.(node.key.slice(1));
              }}
              style={pad}
              className={`w-full flex items-center gap-2 py-1.5 pr-2 rounded-lg text-left ${
                onFolderSelect && selectedFolder === node.key.slice(1) ? 'bg-gold-50 ring-1 ring-gold-200' : 'hover:bg-gray-50'
              }`}
            >
              <ChevronRight className={`w-3.5 h-3.5 text-gray-400 shrink-0 transition-transform ${open ? 'rotate-90' : ''}`} />
              {open ? <FolderOpen className="w-4 h-4 text-gold-500 shrink-0" /> : <Folder className="w-4 h-4 text-gold-500 shrink-0" />}
              <span className="text-sm font-medium text-navy-800 truncate">{node.name}</span>
              <span className="text-[10px] text-gray-400 ml-auto shrink-0">{node.fileCount}</span>
            </button>
            {open && <div role="group">{renderNodes(node.children, depth + 1)}</div>}
          </div>
        );
      }
      const active = selected?.path === node.file.path;
      return (
        <button
          key={node.key}
          role="treeitem"
          aria-selected={active}
          onClick={() => setSelected(node.file)}
          style={{ paddingLeft: `${depth * 16 + 26}px` }}
          className={`w-full flex items-center gap-2 py-1.5 pr-2 rounded-lg text-left transition-colors ${
            active ? 'bg-gold-50 ring-1 ring-gold-200' : 'hover:bg-gray-50'
          }`}
        >
          <FileGlyph name={node.name} />
          <span className="text-sm text-navy-800 truncate">{node.name}</span>
        </button>
      );
    });

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
        <button onClick={fetchFiles} className="text-gold-500 hover:text-gold-600 text-sm font-medium">Try again</button>
      </div>
    );
  }

  if (files.length === 0 && folders.length === 0) {
    return (
      <div className="text-center py-14">
        <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FolderOpen className="w-7 h-7 text-gray-300" />
        </div>
        <p className="text-navy-800 font-semibold text-sm">No documents yet</p>
        <p className="text-gray-400 text-xs mt-1">No documents have been uploaded yet.</p>
      </div>
    );
  }

  const ext = selected ? extOf(selected.name) : '';
  const canPreview = PREVIEWABLE.includes(ext);
  const previewUrl = selected ? `/api/files/preview?path=${encodeURIComponent(selected.path)}` : '';

  return (
    <div>
      {sync?.mode === 'delayed' && (
        <div className="mb-4 flex items-start gap-2.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-4 py-3 text-xs">
          <Clock className="w-4 h-4 shrink-0 mt-0.5" />
          <p>
            <span className="font-semibold">Free plan: slow sync.</span> Changes in Dropbox can take up to 24 hours to
            show here. Last synced {formatDateTime(sync.syncedAt)}; next sync {sync.nextSyncAt ? formatDateTime(sync.nextSyncAt) : 'within 24 hours'}.{' '}
            <span className="font-semibold">Upgrade to the Backup plan ($25/month) for fast, live sync.</span>
            {onUpgradeClick && (
              <>
                {' '}
                <button onClick={onUpgradeClick} className="underline font-semibold hover:text-amber-900">Upgrade</button>
              </>
            )}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <p className="text-sm text-gray-500">
          {files.length} document{files.length !== 1 ? 's' : ''}
          {sync?.mode === 'live' && <span className="text-gray-400"> · live, synced {formatDateTime(sync.syncedAt)}</span>}
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setExpanded(allExpanded ? new Set() : new Set(allFolderKeys))}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-navy-700 transition-colors"
          >
            <ChevronsUpDown className="w-3.5 h-3.5" />
            {allExpanded ? 'Collapse all' : 'Expand all'}
          </button>
          <button
            onClick={fetchFiles}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-navy-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>
      </div>

      <div className={`grid gap-5 ${layout === 'split' ? 'lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]' : ''}`}>
        {/* Tree */}
        <div className="border border-gray-100 rounded-xl p-2 max-h-[560px] overflow-y-auto">
          <div className="relative mb-2">
            <Search className="w-3.5 h-3.5 text-gray-300 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search files…"
              className="w-full text-xs border border-gray-200 rounded-lg pl-8 pr-7 py-2 focus:outline-none focus:ring-2 focus:ring-gold-400/20"
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500" aria-label="Clear search">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          {onFolderSelect && (
            <button
              onClick={() => onFolderSelect('')}
              className={`w-full flex items-center gap-2 py-1.5 px-2 mb-1 rounded-lg text-left text-sm font-medium text-navy-800 ${
                selectedFolder === '' ? 'bg-gold-50 ring-1 ring-gold-200' : 'hover:bg-gray-50'
              }`}
            >
              <FolderOpen className="w-4 h-4 text-gold-500 shrink-0" />
              Backup (top level)
            </button>
          )}
          <div role="tree">
            {visibleTree.length ? renderNodes(visibleTree, 0) : (
              <p className="text-xs text-gray-400 text-center py-6">No files match “{query}”.</p>
            )}
          </div>
        </div>

        {/* Preview */}
        <div className="border border-gray-100 rounded-xl overflow-hidden flex flex-col min-h-[320px] lg:max-h-[560px]">
          {!selected ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 py-16 px-4 text-center">
              <Eye className="w-8 h-8 mb-2 opacity-40" />
              <p className="text-sm">Select a file to preview it</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 p-3 border-b border-gray-100 bg-gray-50">
                <FileGlyph name={selected.name} className="w-5 h-5" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-navy-800 truncate">{selected.name}</p>
                  <p className="text-xs text-gray-400">
                    {formatFileSize(selected.size)} · {selected.category} · {formatDate(selected.modified)}
                  </p>
                </div>
                <button
                  onClick={() => handleDownload(selected)}
                  className={`flex items-center gap-1.5 text-xs font-medium shrink-0 ${
                    canDownload ? 'text-gold-500 hover:text-gold-600' : 'text-gray-400 hover:text-gray-500'
                  }`}
                  title={canDownload ? 'Download' : 'Upgrade to the Backup plan to download'}
                >
                  {canDownload ? <Download className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  {canDownload ? 'Download' : 'Upgrade to download'}
                </button>
              </div>
              <div className="flex-1 bg-gray-100 min-h-[280px] flex items-center justify-center overflow-auto">
                {!canPreview || previewError ? (
                  <div className="text-center text-gray-400 p-6">
                    <FileGlyph name={selected.name} className="w-10 h-10 mx-auto mb-2 opacity-60" />
                    <p className="text-sm">{previewError ? 'Preview failed to load.' : 'Preview isn’t available for this file type.'}</p>
                    <p className="text-xs mt-1">{canDownload ? 'Use Download to open it.' : 'Upgrade to download this file.'}</p>
                  </div>
                ) : ['pdf', 'txt', 'csv'].includes(ext) ? (
                  <iframe key={selected.path} src={previewUrl} title={selected.name} className="w-full h-[480px] bg-white" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={selected.path} src={previewUrl} alt={selected.name} onError={() => setPreviewError(true)} className="max-w-full max-h-[480px] object-contain" />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
