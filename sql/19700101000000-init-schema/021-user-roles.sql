CREATE TABLE IF NOT EXISTS sbos.user_roles (
  created_by varchar(255) NOT NULL,  -- 建立人員
	created_at timestamp DEFAULT now() NULL,
	modified_by varchar(255) NOT NULL, -- 異動人員
	updated_at timestamp DEFAULT now() NULL,
	deleted_at timestamp NULL,
  user_id uuid NOT NULL, -- UUIDv1
  role_id uuid NOT NULL, -- UUIDv1
	CONSTRAINT user_roles_pkey PRIMARY KEY (user_id, role_id),
	CONSTRAINT user_roles_fk_01 FOREIGN KEY (user_id) REFERENCES sbos.users(id) ON DELETE RESTRICT ON UPDATE RESTRICT,
	CONSTRAINT user_roles_fk_02 FOREIGN KEY (role_id) REFERENCES sbos.roles(id) ON DELETE RESTRICT ON UPDATE RESTRICT
);
COMMENT ON COLUMN sbos.user_roles.created_by IS '建立人員';
COMMENT ON COLUMN sbos.user_roles.modified_by IS '異動人員';
COMMENT ON COLUMN sbos.user_roles.user_id IS 'UUIDv1';
COMMENT ON COLUMN sbos.user_roles.role_id IS 'UUIDv1';