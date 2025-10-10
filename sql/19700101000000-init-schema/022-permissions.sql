CREATE TABLE IF NOT EXISTS sbos.permissions (
  created_by varchar(255) NOT NULL,  -- 建立人員
	created_at timestamp DEFAULT now() NULL,
	modified_by varchar(255) NOT NULL, -- 異動人員
	updated_at timestamp DEFAULT now() NULL,
	deleted_at timestamp NULL,
  role_id     uuid NOT NULL, -- UUIDv1
  resource_id uuid NOT NULL, -- UUIDv1
	"action" VARCHAR(16),  -- (BitSet)
	CONSTRAINT permissions_pkey PRIMARY KEY (role_id, resource_id),
	CONSTRAINT permissions_fk_01 FOREIGN KEY (role_id) REFERENCES sbos.roles(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
	CONSTRAINT permissions_fk_02 FOREIGN KEY (resource_id) REFERENCES sbos.resources(id) ON DELETE RESTRICT ON UPDATE RESTRICT
);
COMMENT ON COLUMN sbos.permissions.created_by IS '建立人員';
COMMENT ON COLUMN sbos.permissions.modified_by IS '異動人員';
COMMENT ON COLUMN sbos.permissions.role_id IS 'UUIDv1';
COMMENT ON COLUMN sbos.permissions.resource_id IS 'UUIDv1';
COMMENT ON COLUMN sbos.permissions."action" IS '操作 (BitSet)';