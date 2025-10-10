CREATE TABLE IF NOT EXISTS sbos.role_permissions (
  created_by varchar(255) NOT NULL,  -- 建立人員
	created_at timestamp DEFAULT now() NULL,
	modified_by varchar(255) NOT NULL, -- 異動人員
	updated_at timestamp DEFAULT now() NULL,
	deleted_at timestamp NULL,
  role_id       uuid NOT NULL, -- UUIDv1
  permission_id uuid NOT NULL, -- UUIDv1
	"action" VARCHAR(16),  -- (BitSet)
	CONSTRAINT role_permissions_pkey PRIMARY KEY (role_id, permission_id),
	CONSTRAINT role_permissions_fk_01 FOREIGN KEY (role_id) REFERENCES sbos.roles(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
	CONSTRAINT role_permissions_fk_02 FOREIGN KEY (permission_id) REFERENCES sbos.permissions(id) ON DELETE RESTRICT ON UPDATE RESTRICT
);
COMMENT ON COLUMN sbos.role_permissions.created_by IS '建立人員';
COMMENT ON COLUMN sbos.role_permissions.modified_by IS '異動人員';
COMMENT ON COLUMN sbos.role_permissions.role_id IS 'UUIDv1';
COMMENT ON COLUMN sbos.role_permissions.permission_id IS 'UUIDv1';
COMMENT ON COLUMN sbos.permissions."action" IS '(BitSet)';