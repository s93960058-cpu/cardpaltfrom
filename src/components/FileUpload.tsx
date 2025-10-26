import { useState, useRef } from 'react';
import { Upload, X, Loader, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface FileUploadProps {
  bucket: 'logos' | 'covers' | 'media';
  onUploadComplete: (url: string) => void;
  acceptedTypes?: string;
  maxSizeMB?: number;
  label?: string;
  currentImage?: string | null;
}

export function FileUpload({
  bucket,
  onUploadComplete,
  acceptedTypes = 'image/jpeg,image/png,image/webp',
  maxSizeMB = 5,
  label = 'העלה תמונה',
  currentImage
}: FileUploadProps) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setError('');

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`הקובץ גדול מדי. גודל מקסימלי: ${maxSizeMB}MB`);
      return;
    }

    const allowedTypes = acceptedTypes.split(',');
    if (!allowedTypes.includes(file.type)) {
      setError('סוג קובץ לא נתמך. אנא העלה תמונה בפורמט JPG, PNG או WEBP');
      return;
    }

    setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      onUploadComplete(publicUrl);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'שגיאה בהעלאת הקובץ');
      setPreview(currentImage || null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onUploadComplete('');
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
          />
          {!uploading && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
              <Loader className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition cursor-pointer"
        >
          <div className="flex flex-col items-center gap-2">
            {uploading ? (
              <Loader className="w-12 h-12 text-blue-600 animate-spin" />
            ) : (
              <ImageIcon className="w-12 h-12 text-gray-400" />
            )}
            <p className="text-sm text-gray-600">
              {uploading ? 'מעלה קובץ...' : 'לחץ להעלאת תמונה'}
            </p>
            <p className="text-xs text-gray-500">
              JPG, PNG או WEBP (עד {maxSizeMB}MB)
            </p>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes}
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <p className="text-xs text-gray-500">
        התמונה תישמר באחסון מאובטח ותהיה נגישה לציבור
      </p>
    </div>
  );
}
