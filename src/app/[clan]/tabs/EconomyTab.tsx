"use client";

import { EconomyTabContent } from '@/components/EconomyTabContent';

export interface EconomyTabProps {
  clanId: string;
  isOfficer: boolean;
}

export function EconomyTab({ clanId, isOfficer }: EconomyTabProps) {
  return <EconomyTabContent clanId={clanId} isOfficer={isOfficer} />;
}
