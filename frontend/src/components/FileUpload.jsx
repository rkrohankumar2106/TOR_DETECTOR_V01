import React, { useState } from 'react';
import { UploadCloud, File, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { uploadPCAP } from '../services/traffic';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setError(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setResult(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);
    setResult(null);

    try {
      const data = await uploadPCAP(file);
      setResult(data);
    } catch (err) {
      setError('Upload failed. Please try again.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-center transition-colors duration-300">
      <div
        className={`border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center transition-colors ${isDragging
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
            : 'border-gray-300 dark:border-gray-600'
          }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <UploadCloud className={`h-12 w-12 mb-4 ${isDragging ? 'text-indigo-500' : 'text-gray-400 dark:text-gray-500'}`} />
        <p className="text-gray-600 dark:text-gray-300 mb-2">Drag and drop your PCAP file here</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">or click to browse</p>

        <input
          type="file"
          accept=".pcap,.pcapng,.cap"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 cursor-pointer transition-colors"
        >
          Browse Files
        </label>

        {file && (
          <div className="mt-6 flex items-center gap-2 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded-lg">
            <File size={16} />
            <span className="text-sm font-medium">{file.name}</span>
          </div>
        )}
      </div>

      {file && !result && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className={`mt-6 w-full py-3 rounded-lg font-medium text-white transition-colors flex items-center justify-center gap-2 ${uploading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
        >
          {uploading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5" />
              Analyzing...
            </>
          ) : (
            'Upload & Analyze'
          )}
        </button>
      )}

      {result && (
        <div className="mt-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
          <div className="text-left">
            <h4 className="text-sm font-semibold text-green-800 dark:text-green-300">Analysis Complete</h4>
            <p className="text-sm text-green-700 dark:text-green-400 mt-1">
              Detected {result.threat_count} Tor threats
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
          <div className="text-left">
            <h4 className="text-sm font-semibold text-red-800 dark:text-red-300">Error</h4>
            <p className="text-sm text-red-700 dark:text-red-400 mt-1">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
