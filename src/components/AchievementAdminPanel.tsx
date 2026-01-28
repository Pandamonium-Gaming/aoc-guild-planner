'use client';

import { useState } from 'react';
import { Edit2, Save, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ClanAchievementWithDefinition } from '@/lib/types';
import { supabase } from '@/lib/supabase';

interface AchievementAdminPanelProps {
  achievements: ClanAchievementWithDefinition[];
  clanId: string;
  onRefresh: () => Promise<void>;
}

export function AchievementAdminPanel({
  achievements,
  clanId,
  onRefresh,
}: AchievementAdminPanelProps) {
  const { t } = useLanguage();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);

  const handleEdit = (achievement: ClanAchievementWithDefinition) => {
    setEditingId(achievement.id);
    setEditValues({
      [achievement.id]: achievement.current_value,
    });
  };

  const handleSave = async (achievement: ClanAchievementWithDefinition) => {
    setSaving(true);
    try {
      const newValue = editValues[achievement.id] ?? achievement.current_value;
      const isUnlocked = newValue >= achievement.definition.requirement_value;

      const { error } = await supabase
        .from('clan_achievements')
        .upsert({
          clan_id: clanId,
          achievement_id: achievement.achievement_id,
          current_value: newValue,
          is_unlocked: isUnlocked,
          unlocked_at: isUnlocked && !achievement.is_unlocked ? new Date().toISOString() : achievement.unlocked_at,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'clan_id,achievement_id',
        });

      if (error) throw error;
      setEditingId(null);
      await onRefresh();
    } catch (err) {
      console.error('Error saving achievement:', err);
      alert('Error saving achievement: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues({});
  };

  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-4">Achievement Admin</h3>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className="flex items-center justify-between p-3 bg-slate-700/50 rounded border border-slate-600 hover:border-slate-500 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-lg">{achievement.definition.icon}</span>
                <span className="font-medium text-white truncate">
                  {achievement.definition.name}
                </span>
                {achievement.is_unlocked && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-500/20 text-green-300">
                    Unlocked
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {achievement.current_value} / {achievement.definition.requirement_value}
              </p>
            </div>

            <div className="flex items-center gap-2 ml-4">
              {editingId === achievement.id ? (
                <>
                  <input
                    type="number"
                    min="0"
                    max={achievement.definition.requirement_value}
                    value={editValues[achievement.id] ?? achievement.current_value}
                    onChange={(e) =>
                      setEditValues({
                        ...editValues,
                        [achievement.id]: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-16 px-2 py-1 bg-slate-600 border border-slate-500 rounded text-white text-sm"
                  />
                  <button
                    onClick={() => handleSave(achievement)}
                    disabled={saving}
                    className="p-1 rounded hover:bg-green-500/20 text-green-400 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="p-1 rounded hover:bg-red-500/20 text-red-400 disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleEdit(achievement)}
                  className="p-1 rounded hover:bg-blue-500/20 text-blue-400"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded text-sm text-blue-300">
        <p>Click Edit to change achievement progress. Values will automatically unlock when reaching the requirement.</p>
      </div>
    </div>
  );
}
