CREATE TABLE IF NOT EXISTS sbos.users (
	created_by varchar(255) NOT NULL,  -- 建立人員
	created_at timestamp DEFAULT now() NULL,
	modified_by varchar(255) NOT NULL, -- 異動人員
	updated_at timestamp DEFAULT now() NULL,
	deleted_at timestamp NULL,
	id      uuid DEFAULT uuid_generate_v1() NOT NULL, -- UUIDv1
	account varchar(255) NOT NULL, -- 帳號
	"name"  varchar(255) NOT NULL, -- 姓名
	description text NULL, -- 說明
	CONSTRAINT users_pkey PRIMARY KEY (id),
	CONSTRAINT users_unique_01 UNIQUE (account)
);
COMMENT ON TABLE sbos.users IS '使用者';
COMMENT ON COLUMN sbos.users.created_by IS '建立人員';
COMMENT ON COLUMN sbos.users.modified_by IS '異動人員';
COMMENT ON COLUMN sbos.users.id IS 'UUIDv1';
COMMENT ON COLUMN sbos.users.account IS '帳號';
COMMENT ON COLUMN sbos.users."name" IS '姓名';
COMMENT ON COLUMN sbos.users.description IS '說明';