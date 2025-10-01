CREATE TABLE IF NOT EXISTS sbos.roles (
  created_by varchar(255) NOT NULL, -- 建立人員
	created_at timestamp DEFAULT now() NULL,
	modified_by varchar(255) NOT NULL, -- 異動人員
	updated_at timestamp DEFAULT now() NULL,
	deleted_at timestamp NULL,
	id uuid DEFAULT uuid_generate_v1() NOT NULL, -- UUIDv1
  title varchar(255) NOT NULL, -- 名稱
	description text NULL, -- 說明
  CONSTRAINT roles_pkey PRIMARY KEY (id),
	CONSTRAINT roles_unique_01 UNIQUE (title)
);
COMMENT ON TABLE sbos.roles IS '角色表';
COMMENT ON COLUMN sbos.roles.created_by IS '建立人員';
COMMENT ON COLUMN sbos.roles.modified_by IS '異動人員';
COMMENT ON COLUMN sbos.roles.id IS 'UUIDv1';
COMMENT ON COLUMN sbos.roles.title IS '名稱';
COMMENT ON COLUMN sbos.roles.description IS '說明';