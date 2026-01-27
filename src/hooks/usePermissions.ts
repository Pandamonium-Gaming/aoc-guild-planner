'use client';

import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useClanMembership } from './useClanMembership';
import { ClanRole, roleHasPermission, canManageRole } from '@/lib/permissions';

export interface RolePermissions {
  role: ClanRole;
  permissions: Set<string>;
}

export function usePermissions(clanId?: string) {
  const { user } = useAuth();
  const { membership } = useClanMembership(clanId || null, user?.id || null);
  const [rolePermissions, setRolePermissions] = useState<Map<ClanRole, Set<string>>>(new Map());
  
  // Get current user's role
  const getUserRole = useCallback((): ClanRole => {
    return (membership?.role as ClanRole) ?? 'pending';
  }, [membership]);

  // Check if current user has a specific permission
  const hasPermission = useCallback((permission: string): boolean => {
    if (!user || !membership) return false;
    const userRole = getUserRole();
    return roleHasPermission(userRole, permission);
  }, [user, membership, getUserRole]);

  // Check if user can manage another role
  const canManage = useCallback((targetRole: ClanRole): boolean => {
    const userRole = getUserRole();
    return canManageRole(userRole, targetRole);
  }, [getUserRole]);

  // Check multiple permissions (all must be true)
  const hasAllPermissions = useCallback((permissions: string[]): boolean => {
    return permissions.every(perm => hasPermission(perm));
  }, [hasPermission]);

  // Check multiple permissions (any must be true)
  const hasAnyPermission = useCallback((permissions: string[]): boolean => {
    return permissions.some(perm => hasPermission(perm));
  }, [hasPermission]);

  // Check if user is admin
  const isAdmin = useCallback((): boolean => {
    return getUserRole() === 'admin';
  }, [getUserRole]);

  // Check if user is admin or officer
  const isLeadership = useCallback((): boolean => {
    const role = getUserRole();
    return role === 'admin' || role === 'officer';
  }, [getUserRole]);

  return {
    userRole: getUserRole(),
    hasPermission,
    canManage,
    hasAllPermissions,
    hasAnyPermission,
    isAdmin,
    isLeadership,
    rolePermissions,
    setRolePermissions,
  };
}
