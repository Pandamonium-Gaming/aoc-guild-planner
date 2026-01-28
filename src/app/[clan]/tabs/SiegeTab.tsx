import { SiegeTabContent } from '@/components/SiegeTabContent';
import { CharacterWithProfessions } from '@/lib/types';

interface SiegeTabProps {
  clanId: string;
  characters: CharacterWithProfessions[];
  userId: string;
}

export function SiegeTab({ clanId, characters, userId }: SiegeTabProps) {
  return (
    <SiegeTabContent
      clanId={clanId}
      characters={characters}
      userId={userId}
    />
  );
}
