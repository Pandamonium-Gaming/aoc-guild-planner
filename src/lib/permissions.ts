// Permission system for the Guild Planner
// Defines all available permissions and their configuration

export type ClanRole = 'admin' | 'officer' | 'member' | 'trial' | 'pending';

export type PermissionCategory = 'characters' | 'guild_bank' | 'events' | 'parties' | 'siege' | 'announcements' | 'recruitment' | 'settings';

export interface Permission {
  id: string;
  category: PermissionCategory;
  name: string;
  description: string;
}

// All available permissions
export const PERMISSIONS = {
  // Characters
  'characters:add': {
    id: 'characters:add',
    category: 'characters' as PermissionCategory,
    name: 'Add Character',
    description: 'Create a new character'
  },
  'characters:edit_own': {
    id: 'characters:edit_own',
    category: 'characters' as PermissionCategory,
    name: 'Edit Own Character',
    description: 'Edit character details they created'
  },
  'characters:edit_any': {
    id: 'characters:edit_any',
    category: 'characters' as PermissionCategory,
    name: 'Edit Any Character',
    description: 'Edit any character in the guild'
  },
  'characters:delete_own': {
    id: 'characters:delete_own',
    category: 'characters' as PermissionCategory,
    name: 'Delete Own Character',
    description: 'Delete character they created'
  },
  'characters:delete_any': {
    id: 'characters:delete_any',
    category: 'characters' as PermissionCategory,
    name: 'Delete Any Character',
    description: 'Delete any character in the guild'
  },

  // Guild Bank
  'guild_bank:deposit': {
    id: 'guild_bank:deposit',
    category: 'guild_bank' as PermissionCategory,
    name: 'Deposit Items',
    description: 'Deposit items into guild bank'
  },
  'guild_bank:withdraw': {
    id: 'guild_bank:withdraw',
    category: 'guild_bank' as PermissionCategory,
    name: 'Withdraw Items',
    description: 'Withdraw items from guild bank'
  },
  'guild_bank:manage': {
    id: 'guild_bank:manage',
    category: 'guild_bank' as PermissionCategory,
    name: 'Manage Bank',
    description: 'Manage guild bank contents and logs'
  },

  // Events
  'events:create': {
    id: 'events:create',
    category: 'events' as PermissionCategory,
    name: 'Create Event',
    description: 'Create a new event'
  },
  'events:edit_own': {
    id: 'events:edit_own',
    category: 'events' as PermissionCategory,
    name: 'Edit Own Event',
    description: 'Edit events they created'
  },
  'events:edit_any': {
    id: 'events:edit_any',
    category: 'events' as PermissionCategory,
    name: 'Edit Any Event',
    description: 'Edit any event'
  },
  'events:cancel_own': {
    id: 'events:cancel_own',
    category: 'events' as PermissionCategory,
    name: 'Cancel Own Event',
    description: 'Cancel events they created'
  },
  'events:cancel_any': {
    id: 'events:cancel_any',
    category: 'events' as PermissionCategory,
    name: 'Cancel Any Event',
    description: 'Cancel any event'
  },
  'events:delete_any': {
    id: 'events:delete_any',
    category: 'events' as PermissionCategory,
    name: 'Delete Any Event',
    description: 'Delete any event'
  },

  // Parties
  'parties:create': {
    id: 'parties:create',
    category: 'parties' as PermissionCategory,
    name: 'Create Party',
    description: 'Create a new party'
  },
  'parties:edit_own': {
    id: 'parties:edit_own',
    category: 'parties' as PermissionCategory,
    name: 'Edit Own Party',
    description: 'Edit parties they created'
  },
  'parties:edit_any': {
    id: 'parties:edit_any',
    category: 'parties' as PermissionCategory,
    name: 'Edit Any Party',
    description: 'Edit any party'
  },
  'parties:delete_own': {
    id: 'parties:delete_own',
    category: 'parties' as PermissionCategory,
    name: 'Delete Own Party',
    description: 'Delete parties they created'
  },
  'parties:delete_any': {
    id: 'parties:delete_any',
    category: 'parties' as PermissionCategory,
    name: 'Delete Any Party',
    description: 'Delete any party'
  },

  // Siege
  'siege:create': {
    id: 'siege:create',
    category: 'siege' as PermissionCategory,
    name: 'Create Siege',
    description: 'Create a new siege event'
  },
  'siege:edit_own': {
    id: 'siege:edit_own',
    category: 'siege' as PermissionCategory,
    name: 'Edit Own Siege',
    description: 'Edit siege events they created'
  },
  'siege:edit_any': {
    id: 'siege:edit_any',
    category: 'siege' as PermissionCategory,
    name: 'Edit Any Siege',
    description: 'Edit any siege event'
  },

  // Announcements
  'announcements:create': {
    id: 'announcements:create',
    category: 'announcements' as PermissionCategory,
    name: 'Create Announcement',
    description: 'Create a new announcement'
  },
  'announcements:edit_own': {
    id: 'announcements:edit_own',
    category: 'announcements' as PermissionCategory,
    name: 'Edit Own Announcement',
    description: 'Edit announcements they created'
  },
  'announcements:edit_any': {
    id: 'announcements:edit_any',
    category: 'announcements' as PermissionCategory,
    name: 'Edit Any Announcement',
    description: 'Edit any announcement'
  },
  'announcements:delete_any': {
    id: 'announcements:delete_any',
    category: 'announcements' as PermissionCategory,
    name: 'Delete Any Announcement',
    description: 'Delete any announcement'
  },

  // Recruitment
  'recruitment:manage': {
    id: 'recruitment:manage',
    category: 'recruitment' as PermissionCategory,
    name: 'Manage Recruitment',
    description: 'Review and manage recruitment applications'
  },

  // Settings
  'settings:manage_permissions': {
    id: 'settings:manage_permissions',
    category: 'settings' as PermissionCategory,
    name: 'Manage Permissions',
    description: 'Configure role permissions'
  },
  'settings:manage_roles': {
    id: 'settings:manage_roles',
    category: 'settings' as PermissionCategory,
    name: 'Manage Member Roles',
    description: 'Change member roles and statuses'
  },
  'settings:manage_clan': {
    id: 'settings:manage_clan',
    category: 'settings' as PermissionCategory,
    name: 'Manage Guild',
    description: 'Edit guild information and settings'
  },
} as const;

// Get all permissions for a category
export function getPermissionsForCategory(category: PermissionCategory): Permission[] {
  return Object.values(PERMISSIONS).filter(p => p.category === category);
}

// Get all permission categories
export function getAllPermissionCategories(): PermissionCategory[] {
  const categories = new Set<PermissionCategory>();
  Object.values(PERMISSIONS).forEach(p => categories.add(p.category));
  return Array.from(categories);
}

// Default permissions for each role
// Admin gets all permissions, Officer gets most, Member gets basic, Trial gets very limited
export const DEFAULT_ROLE_PERMISSIONS: Record<ClanRole, Set<string>> = {
  admin: new Set([
    // All permissions for admins
    ...Object.keys(PERMISSIONS),
  ]),
  
  officer: new Set([
    // Characters
    'characters:add',
    'characters:edit_any',
    'characters:delete_any',
    // Guild Bank
    'guild_bank:deposit',
    'guild_bank:withdraw',
    'guild_bank:manage',
    // Events
    'events:create',
    'events:edit_any',
    'events:cancel_any',
    'events:delete_any',
    // Parties
    'parties:create',
    'parties:edit_any',
    'parties:delete_any',
    // Siege
    'siege:create',
    'siege:edit_any',
    // Announcements
    'announcements:create',
    'announcements:edit_any',
    'announcements:delete_any',
    // Recruitment
    'recruitment:manage',
    // Settings
    'settings:manage_roles',
  ]),
  
  member: new Set([
    // Characters
    'characters:add',
    'characters:edit_own',
    'characters:delete_own',
    // Guild Bank
    'guild_bank:deposit',
    'guild_bank:withdraw',
    // Events
    'events:create',
    'events:edit_own',
    'events:cancel_own',
    // Parties
    'parties:create',
    'parties:edit_own',
    'parties:delete_own',
    // Siege
    'siege:create',
    'siege:edit_own',
    // Announcements
    'announcements:create',
    'announcements:edit_own',
  ]),
  
  trial: new Set([
    // Characters
    'characters:add',
    // Events
    // Can RSVP but not create
    // Guild Bank - read only
  ]),
  
  pending: new Set([
    // No permissions until approved
  ]),
};

// Check if a role has a permission
export function roleHasPermission(role: ClanRole, permission: string): boolean {
  return DEFAULT_ROLE_PERMISSIONS[role]?.has(permission) ?? false;
}

// Get all permissions for a role
export function getRolePermissions(role: ClanRole): Permission[] {
  const permIds = DEFAULT_ROLE_PERMISSIONS[role] ?? new Set();
  return Object.values(PERMISSIONS).filter(p => permIds.has(p.id));
}

// Role hierarchy: admin > officer > member > trial > pending
export function getRoleHierarchy(): Record<ClanRole, number> {
  return {
    admin: 5,
    officer: 4,
    member: 3,
    trial: 2,
    pending: 1,
  };
}

export function canManageRole(userRole: ClanRole, targetRole: ClanRole): boolean {
  const hierarchy = getRoleHierarchy();
  return hierarchy[userRole] > hierarchy[targetRole];
}

// Role display configuration
export const ROLE_CONFIG: Record<ClanRole, { label: string; color: string; description: string }> = {
  admin: {
    label: 'Admin',
    color: 'text-red-400',
    description: 'Full control over the guild',
  },
  officer: {
    label: 'Officer',
    color: 'text-purple-400',
    description: 'Can manage events, members, and announcements',
  },
  member: {
    label: 'Member',
    color: 'text-blue-400',
    description: 'Can create events and manage own content',
  },
  trial: {
    label: 'Trial',
    color: 'text-yellow-400',
    description: 'Limited access while being evaluated',
  },
  pending: {
    label: 'Pending',
    color: 'text-slate-400',
    description: 'Application awaiting approval',
  },
};
