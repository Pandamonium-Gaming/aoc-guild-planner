"use client";

import { useBuilds } from '@/hooks/useBuilds';
import { BuildLibrary } from '@/components/BuildLibrary';

interface BuildsTabProps {
  clanId: string;
}

export function BuildsTab({ clanId }: BuildsTabProps) {
  const {
    guildBuilds,
    createBuild,
    likeBuild,
    copyBuild,
    loading,
    error,
  } = useBuilds(clanId);

  if (loading) return <div className="text-slate-400">Loading builds...</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <BuildLibrary
      builds={guildBuilds}
      onCreateBuild={createBuild}
      onLike={likeBuild}
      onCopy={copyBuild}
    />
  );
}
