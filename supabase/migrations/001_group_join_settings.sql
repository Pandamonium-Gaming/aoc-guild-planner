-- Add approval requirement flag and default role for group membership
ALTER TABLE groups
  ADD COLUMN approval_required BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN default_role VARCHAR(20) NOT NULL DEFAULT 'trial'
    CHECK (default_role IN ('trial', 'member'));

-- Allow auto-approved joins when approval is disabled
-- The role must match the group's configured default_role
CREATE POLICY "clan_members_insert_auto_approved"
  ON group_members FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND user_id = auth.uid()
    AND role IN ('trial', 'member')
    AND EXISTS (
      SELECT 1 FROM groups g
      WHERE g.id = group_members.group_id
        AND g.approval_required = false
        AND g.default_role = group_members.role
    )
  );
