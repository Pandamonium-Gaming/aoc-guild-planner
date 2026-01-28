import { UserPlus } from 'lucide-react';

export function ClanCreateScreen({
  title,
  message,
  onCreate,
  creating,
  createLabel
}: {
  title: string;
  message: string;
  onCreate: () => void;
  creating?: boolean;
  createLabel?: string;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
  adminNote?: string;
  homeLabel?: string;
        <UserPlus className="w-12 h-12 text-amber-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>
        <p className="text-slate-400 mb-6">{message}</p>
        <button
          onClick={onCreate}
          disabled={creating}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        {adminNote && <p className="text-slate-500 text-sm mt-3">{adminNote}</p>}
        <Link
          href="/"
          className="inline-block mt-4 text-slate-400 hover:text-white transition-colors"
        >
          ← {homeLabel || 'Return Home'}
        </Link>
