'use client';

import { useState, useEffect } from 'react';
import { Party, PARTY_ROLES, PartyRole } from '@/lib/types';
import { X, Users } from 'lucide-react';

interface PartyFormProps {
  initialData?: Partial<Party>;
  onSubmit: (data: Omit<Party, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onCancel: () => void;
  clanId: string;
  userId: string;
}

export function PartyForm({
  initialData,
  onSubmit,
  onCancel,
  clanId,
  userId,
}: PartyFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [tanks, setTanks] = useState(initialData?.tanks_needed || 1);
  const [healers, setHealers] = useState(initialData?.healers_needed || 2);
  const [dps, setDps] = useState(initialData?.dps_needed || 4);
  const [support, setSupport] = useState(initialData?.support_needed || 1);
  const [saving, setSaving] = useState(false);

  const total = tanks + healers + dps + support;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    try {
      await onSubmit({
        clan_id: clanId,
        created_by: userId,
        name: name.trim(),
        description: description.trim() || undefined,
        tanks_needed: tanks,
        healers_needed: healers,
        dps_needed: dps,
        support_needed: support,
      });
    } finally {
      setSaving(false);
    }
  };

  // Keyboard escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-md w-full p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Users size={20} className="text-orange-400" />
            {initialData ? 'Edit Party' : 'New Party'}
          </h2>
          <button
            onClick={onCancel}
            className="p-1 text-slate-400 hover:text-white cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Party Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Main Raid Group"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Tuesday/Thursday raids"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Role requirements */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Role Requirements
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['tank', 'healer', 'dps', 'support'] as PartyRole[]).map(role => {
                const config = PARTY_ROLES[role];
                const value = role === 'tank' ? tanks : 
                              role === 'healer' ? healers : 
                              role === 'dps' ? dps : support;
                const setValue = role === 'tank' ? setTanks : 
                                 role === 'healer' ? setHealers : 
                                 role === 'dps' ? setDps : setSupport;
                
                return (
                  <div key={role} className="flex items-center gap-2">
                    <span className="text-lg">{config.icon}</span>
                    <span className={`text-sm ${config.color} flex-1`}>{config.name}</span>
                    <input
                      type="number"
                      min="0"
                      max="40"
                      value={value}
                      onChange={(e) => setValue(parseInt(e.target.value) || 0)}
                      className="w-16 px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white text-center focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                );
              })}
            </div>
            <p className="text-sm text-slate-500 mt-2">
              Total: {total} {total === 1 ? 'member' : 'members'}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !name.trim() || total === 0}
              className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
            >
              {saving ? 'Saving...' : initialData ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
