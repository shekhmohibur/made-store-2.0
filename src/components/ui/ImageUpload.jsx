'use client';

import { useState, useRef } from 'react';
import { UploadCloud, X, Loader2 } from 'lucide-react';

export function ImageUpload({
  label = 'Upload Image',
  value,
  onChange,
  multiple = false,
  required = false,
}) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');

  // Normalize value into an array for consistent preview rendering
  const previews = multiple
    ? Array.isArray(value)
      ? value
      : []
    : value
    ? [value]
    : [];

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList || []);
    if (files.length === 0) return;

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      const filesToSend = multiple ? files : [files[0]];
      filesToSend.forEach((f) => formData.append('files', f));

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Upload failed.');
        setUploading(false);
        return;
      }

      if (multiple) {
        onChange([...previews, ...data.urls]);
      } else {
        onChange(data.urls[0] || '');
      }
    } catch {
      setError('Network error during file upload.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleRemove = (indexToRemove) => {
    if (multiple) {
      onChange(previews.filter((_, idx) => idx !== indexToRemove));
    } else {
      onChange('');
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Dropzone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-5 text-center transition-colors ${
          dragActive
            ? 'border-zinc-900 bg-zinc-100'
            : 'border-zinc-300 bg-zinc-50/70 hover:border-zinc-900 hover:bg-zinc-50'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-1.5 py-2 text-zinc-600">
            <Loader2 className="h-6 w-6 animate-spin text-zinc-900" />
            <span className="text-xs font-medium">Uploading image...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-2xs ring-1 ring-zinc-200">
              <UploadCloud className="h-5 w-5 text-zinc-700" />
            </div>
            <p className="text-xs font-semibold text-zinc-800">
              Click to upload or drag & drop
            </p>
            <p className="text-[11px] text-zinc-400">
              {multiple
                ? 'JPG, PNG, WebP or AVIF (multiple allowed, up to 5MB each)'
                : 'JPG, PNG, WebP or AVIF (up to 5MB)'}
            </p>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      {/* Image Previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-3 pt-1 sm:grid-cols-4">
          {previews.map((url, idx) => (
            <div
              key={`${url}-${idx}`}
              className="group relative aspect-square overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100"
            >
              <img
                src={url}
                alt={`Uploaded preview ${idx + 1}`}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(idx);
                }}
                className="absolute right-1.5 top-1.5 rounded-full bg-zinc-900/80 p-1 text-white opacity-90 transition-opacity hover:bg-red-600"
                title="Remove image"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              {multiple && idx === 0 && (
                <span className="absolute bottom-1.5 left-1.5 rounded bg-zinc-900/80 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  Main
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}