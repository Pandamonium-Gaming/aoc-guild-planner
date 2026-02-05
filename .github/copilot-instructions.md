# GitHub Copilot Instructions

Quick reference for developing on Guild Planner. See [.AI-INSTRUCTIONS.md](../.AI-INSTRUCTIONS.md) for the comprehensive guide.

> **IMPORTANT**: Use PowerShell cmdlets instead of Unix commands (e.g., `Get-ChildItem` instead of `ls`). See the **PowerShell Commands Reference** section below.

## Code Patterns

### Permission Checks

```typescript
// ✅ Correct
const canEdit = hasPermission('settings_edit_roles');  // Check src/lib/permissions.ts for valid names

// ❌ Wrong
const canEdit = hasPermission('settings_edit_permissions');  // This permission doesn't exist
```

### New Components

```typescript
interface ComponentProps {
  groupId: string;
  userRole: GroupRole;  // Always include for permission checks
  onSave?: (data: any) => Promise<void>;
}

// In settings pages, always check permissions first
const { hasPermission } = usePermissions(group?.id);
const canDoX = hasPermission('permission_name');  // Verify permission exists in src/lib/permissions.ts
if (!canDoX) return <AccessDenied />;
```

### Async Operations

```typescript
// Always wrap fetches in try/catch with user feedback
try {
  setLoading(true);
  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(await response.text());
  
  const data = await response.json();
  setMessage({ type: 'success', text: 'Success!' });
} catch (error) {
  setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed' });
  console.error('Operation failed:', error);
} finally {
  setLoading(false);
}
```

### External APIs

**Before implementing code for a new external API:**

1. Test the API request first using a tool like Postman or curl
2. Verify the response format and status codes work as expected
3. Check for rate limits, authentication requirements, and error responses
4. **Only then** write the integration code

This prevents wasting time on code that can't work due to API issues or incorrect assumptions.

```typescript
// Example: Test the API endpoint first before writing client code
const testApiCall = async () => {
  try {
    const response = await fetch('https://api.example.com/data', {
      headers: { 'Authorization': 'Bearer token' }
    });
    const data = await response.json();
    console.log('API Response:', data);  // Verify structure
  } catch (error) {
    console.error('API Test Failed:', error);
  }
};

// Once verified, write production code
```

## Version Management

### Changelog

Update `CHANGELOG.md` when:

* ✅ Adding features
* ✅ Fixing bugs (especially permission/auth)
* ✅ Database schema changes
* ❌ Internal refactors without user-facing changes

Format:

```markdown
## [Unreleased]

### Added
- Feature description

### Fixed
- Bug fix description

### Changed
- Breaking change description
```

### Database Migrations

```powershell
# Create new migration (sequential 3-digit number)
New-Item -Path "supabase/migrations/001_feature_name.sql" -ItemType File

# Test locally first
npx supabase db reset --linked  # in dev

# Apply to production
npx supabase db push
```

**Rules:**

* ✅ Always create NEW migrations, never edit existing ones
* ✅ Migrations must be reversible (UP/DOWN)
* ✅ Test in dev first with `.env.local.dev`
* ❌ Don't edit `000_baseline.sql` unless squashing old migrations

## Logging

### Console Usage

```typescript
// ✅ Keep these - helps with debugging
console.error('User auth failed:', error);
console.warn('Deprecated API called');

// ❌ Remove before merging
console.log('Debug message');
console.log('currentUser:', user);
```

### Error Messages

```typescript
// Show user-facing messages via state
setMessage({ 
  type: 'error', 
  text: 'Failed to update permissions: Access denied' 
});

// Log technical details for debugging
console.error('API error:', { status, code, message });
```

## Critical Checks

* \[ ] **Permissions**: Valid name from `src/lib/permissions.ts`?
* \[ ] **Role Hierarchy**: Using `getRoleHierarchy()` for comparisons?
* \[ ] **Auth**: User identity verified before database changes?
* \[ ] **Types**: No `any` types unless impossible to avoid
* \[ ] **Logging**: Removed debug console.log statements?
* \[ ] **CHANGELOG**: Updated if feature/bug fix/breaking change?
* \[ ] **Migrations**: Tested in dev with `.env.local.dev` first?

## Common Issues

| Problem | Fix |
|---------|-----|
| "user is not an admin" after backup | Run `scripts/restore-admin-role.ps1` |
| Permissions section not showing | Check permission name typo - should be `settings_edit_roles` |
| Type errors with `GroupRole` | Import from `src/lib/permissions.ts` |
| Database migration fails | Create NEW file, don't edit existing migrations |

## Key Files

| File | Purpose |
|------|---------|
| `src/lib/permissions.ts` | Single source of truth for all permissions |
| `src/app/api/group/permissions/route.ts` | Backend permission API (admin req'd) |
| `supabase/migrations/000_baseline.sql` | Complete database schema |
| `src/components/settings/PermissionsSettings.tsx` | Permission editor UI |

## Environment

```powershell
# Development
npm run dev              # Start dev server
# Uses .env.local.dev + dev Supabase project

# Production requires .env.local
# Never test permission changes on prod without approval
```

## Before Committing

```powershell
npm run lint       # Fix style issues
npm run type-check # Verify types
```

## PowerShell Commands Reference

**Prefer these PowerShell cmdlets over Unix-style commands:**

```powershell
# ✅ PowerShell - CORRECT
Get-ChildItem                  # ls, dir
Get-Content                    # cat
Remove-Item                    # rm, del
Copy-Item                      # cp
Move-Item                      # mv
New-Item -ItemType File        # touch
Test-Path                      # test -f
Select-Object -First 10        # head -n 10
Select-Object -Last 10         # tail -n 10
Get-Content | Select-Object -Last 10  # tail

# ❌ Unix commands - AVOID (don't use)
ls, dir, cat, rm, cp, mv, touch, tail, head
```

***

**For detailed information**, see [.AI-INSTRUCTIONS.md](../.AI-INSTRUCTIONS.md) in the project root.
