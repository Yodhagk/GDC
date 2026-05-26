'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File, CheckCircle, XCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatFileSize, MAX_FILE_SIZE } from '@/lib/utils';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

interface FileUploadProps {
  onUploadSuccess: () => void;
}

export default function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const onDrop = useCallback((accepted: File[], rejected: any[]) => {
    if (rejected.length > 0) {
      const code = rejected[0].errors[0]?.code;
      if (code === 'file-too-large') {
        toast.error('File exceeds 10 MB limit.');
      } else {
        toast.error('File type not supported. Upload PDF, Excel, Word, or image files.');
      }
      return;
    }
    if (accepted.length > 0) {
      setSelectedFile(accepted[0]);
      setStatus('idle');
      setErrorMsg('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
  });

  const handleUpload = () => {
    if (!selectedFile) return;

    setStatus('uploading');
    setProgress(0);

    const formData = new FormData();
    formData.append('file', selectedFile);

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        setProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        setStatus('success');
        setProgress(100);
        toast.success('Document uploaded successfully!');
        setTimeout(() => {
          setSelectedFile(null);
          setStatus('idle');
          setProgress(0);
          onUploadSuccess();
        }, 2000);
      } else {
        let msg = 'Upload failed. Please try again.';
        try {
          msg = JSON.parse(xhr.responseText).error ?? msg;
        } catch {}
        setStatus('error');
        setErrorMsg(msg);
        toast.error(msg);
      }
    });

    xhr.addEventListener('error', () => {
      setStatus('error');
      setErrorMsg('Network error. Please check your connection and try again.');
      toast.error('Network error.');
    });

    xhr.open('POST', '/api/upload');
    xhr.send(formData);
  };

  const reset = () => {
    setSelectedFile(null);
    setStatus('idle');
    setProgress(0);
    setErrorMsg('');
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      {!selectedFile && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 ${
            isDragActive
              ? 'border-gold-400 bg-gold-50'
              : 'border-gray-200 hover:border-gold-300 hover:bg-gray-50'
          }`}
        >
          <input {...getInputProps()} />
          <div className="w-14 h-14 bg-gold-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UploadCloud className="w-7 h-7 text-gold-500" />
          </div>
          <p className="font-semibold text-navy-800 mb-1">
            {isDragActive ? 'Drop your file here' : 'Drag & drop your document'}
          </p>
          <p className="text-gray-400 text-sm mb-3">or click to browse from your computer</p>
          <p className="text-gray-300 text-xs">
            PDF, Excel, Word, JPG, PNG · Max 10 MB
          </p>
        </div>
      )}

      {/* Selected file preview */}
      {selectedFile && status !== 'success' && (
        <div className="border border-gray-200 rounded-2xl p-5 bg-gray-50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-navy-100 rounded-xl flex items-center justify-center shrink-0">
              <File className="w-5 h-5 text-navy-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-navy-800 text-sm truncate">{selectedFile.name}</p>
              <p className="text-gray-400 text-xs">{formatFileSize(selectedFile.size)}</p>
            </div>
            {status === 'idle' && (
              <button onClick={reset} className="text-gray-300 hover:text-gray-500 transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Progress bar */}
          {status === 'uploading' && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Uploading…</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold-400 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Error */}
          {status === 'error' && (
            <div className="mt-3 flex items-center gap-2 text-red-500 text-xs">
              <XCircle className="w-4 h-4 shrink-0" />
              {errorMsg}
            </div>
          )}

          {/* Upload button */}
          {(status === 'idle' || status === 'error') && (
            <div className="flex gap-3 mt-4">
              <button onClick={handleUpload} className="btn-gold text-sm py-2.5 px-6 flex items-center gap-2">
                <UploadCloud className="w-4 h-4" />
                Upload Document
              </button>
              <button onClick={reset} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {/* Success state */}
      {status === 'success' && (
        <div className="border border-green-200 bg-green-50 rounded-2xl p-5 flex items-center gap-4">
          <CheckCircle className="w-8 h-8 text-green-500 shrink-0" />
          <div>
            <p className="font-semibold text-green-800 text-sm">Upload complete!</p>
            <p className="text-green-600 text-xs mt-0.5">
              {selectedFile?.name} has been securely saved to your Dropbox folder.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
