"use client";
import { useState } from 'react';
import { useAuthContext } from '@/components/AuthProvider';
import { supabase } from '@/lib/supabase';
import { updateClanIconUrl } from '@/lib/auth';

// Use env var for bucket name, fallback to 'guild-icons'
const GUILD_ICON_BUCKET = process.env.NEXT_PUBLIC_GUILD_ICON_BUCKET || 'guild-icons';

interface GuildIconUploaderProps {
  clanId: string;
  currentUrl?: string;
  onUploaded?: (url: string) => void;
}

export function GuildIconUploader({ clanId, currentUrl, onUploaded }: GuildIconUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [iconUrl, setIconUrl] = useState(currentUrl || '');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { user, session } = useAuthContext();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccess(null);
    const file = e.target.files?.[0];
    if (!file) return;
    if (!user || !session) {
      setError('You must be logged in to upload a guild icon.');
      return;
    }
    setUploading(true);
    const filePath = `${clanId}/icon.png`;
    const { error } = await supabase.storage
      .from(GUILD_ICON_BUCKET)
      .upload(filePath, file, { upsert: true });
    if (error) {
      setError('Upload failed! ' + (error.message || ''));
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from(GUILD_ICON_BUCKET).getPublicUrl(filePath);
    if (data?.publicUrl) {
      await updateClanIconUrl(clanId, data.publicUrl);
      setIconUrl(data.publicUrl);
      setSuccess('Icon uploaded successfully!');
      if (onUploaded) onUploaded(data.publicUrl);
    }
    setUploading(false);
    // Reset file input
    if (e.target) e.target.value = '';
  };

  return (
    <div className="flex flex-col items-start gap-2">
      {iconUrl && (
        <img src={iconUrl} alt="Guild Icon" className="w-16 h-16 rounded-full border border-slate-700" />
      )}
      <label className={`inline-block px-4 py-2 rounded bg-blue-600 text-white font-semibold cursor-pointer hover:bg-blue-700 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        style={{ position: 'relative' }}>
        {uploading ? 'Uploading...' : 'Choose File'}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          style={{ display: 'none' }}
        />
      </label>
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
      {success && <div className="text-green-500 text-sm mt-1">{success}</div>}
    </div>
  );
}
