import { useParties } from '@/hooks/useParties';
import { PartiesList } from '@/components/PartiesList';
import { CharacterWithProfessions } from '@/lib/types';

interface PartiesTabProps {
  clanId: string;
  characters: CharacterWithProfessions[];
  userId: string;
  canManage: boolean;
}

export function PartiesTab({ clanId, characters, userId, canManage }: PartiesTabProps) {
  const {
    parties,
    createParty,
    updateParty,
    deleteParty,
    assignCharacter,
    removeFromRoster,
    toggleConfirmed,
  } = useParties(clanId, characters);

  return (
    <PartiesList
      parties={parties}
      characters={characters}
      clanId={clanId}
      userId={userId}
      canManage={canManage}
      onCreateParty={createParty}
      onUpdateParty={updateParty}
      onDeleteParty={deleteParty}
      onAssignCharacter={assignCharacter}
      onRemoveFromRoster={removeFromRoster}
      onToggleConfirmed={toggleConfirmed}
    />
  );
}
