"use client";
import { AddCharacterButton } from "@/components/AddCharacterButton";
import { CharacterFiltersBar, filterCharacters, DEFAULT_FILTERS } from "@/components/CharacterFilters";
import { CharacterCard } from "@/components/MemberCard";
import { CharacterWithProfessions } from "@/lib/types";
import { useState } from "react";

interface CharactersTabProps {
  characters: CharacterWithProfessions[];
  addCharacter: (data: any) => Promise<void>;
  setEditingCharacter: (character: CharacterWithProfessions) => void;
  characterFilters: any;
  setCharacterFilters: (filters: any) => void;
}

export function CharactersTab({
  characters,
  addCharacter,
  setEditingCharacter,
  characterFilters,
  setCharacterFilters,
}: CharactersTabProps) {
  return (
    <div className="space-y-4">
      <AddCharacterButton onAdd={addCharacter} />
      {characters.length > 0 && (
        <CharacterFiltersBar
          filters={characterFilters}
          onChange={setCharacterFilters}
          characterCount={characters.length}
          filteredCount={filterCharacters(characters, characterFilters).length}
        />
      )}
      {characters.length === 0 ? (
        <div className="text-slate-400 text-center py-8">No characters found.</div>
      ) : filterCharacters(characters, characterFilters).length === 0 ? (
        <div className="text-slate-400 text-center py-8">No characters match the filters.</div>
      ) : (
        filterCharacters(characters, characterFilters).map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            onUpdate={async () => {}}
            onDelete={async () => {}}
            onSetProfessionRank={async () => {}}
            onEdit={() => setEditingCharacter(character)}
          />
        ))
      )}
    </div>
  );
}
