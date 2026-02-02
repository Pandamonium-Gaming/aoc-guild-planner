"use client";

import { EconomyTabContent } from '@/components/EconomyTabContent';

export interface EconomyTabProps {
  groupId: string;
  isOfficer: boolean;
}

export function EconomyTab({ groupId, isOfficer }: EconomyTabProps) {
  return <EconomyTabContent clanId={clanId} isOfficer={isOfficer} />;
}
