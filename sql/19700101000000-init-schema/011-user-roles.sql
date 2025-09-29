CREATE TABLE IF NOT EXISTS sbos.user_roles (
  created_by varchar(255) NOT NULL, -- 建立人員
	created_at timestamp DEFAULT now() NULL,
	modified_by varchar(255) NOT NULL, -- 異動人員
	updated_at timestamp DEFAULT now() NULL,
	deleted_at timestamp NULL,
	id uuid DEFAULT uuid_generate_v1() NOT NULL, -- UUIDv1
  title varchar(255) NOT NULL, -- 名稱
  CONSTRAINT user_roles_pkey PRIMARY KEY (id),
	CONSTRAINT user_roles_unique UNIQUE (title)
);
COMMENT ON TABLE sbos.user_roles IS '使用者角色';
COMMENT ON COLUMN sbos.user_roles.created_by IS '建立人員';
COMMENT ON COLUMN sbos.user_roles.modified_by IS '異動人員';
COMMENT ON COLUMN sbos.user_roles.id IS 'UUIDv1';
COMMENT ON COLUMN sbos.user_roles.title IS '名稱';