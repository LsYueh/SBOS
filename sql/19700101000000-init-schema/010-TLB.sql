CREATE TABLE IF NOT EXISTS sbos.tlb (
	id uuid DEFAULT uuid_generate_v1() NOT NULL, -- UUIDv1
	created_by varchar(255) NOT NULL, -- 建立人員
	created_at timestamp DEFAULT now() NULL,
	modified_by varchar(255) NOT NULL, -- 異動人員
	updated_at timestamp DEFAULT now() NULL,
	deleted_at timestamp NULL,
	username varchar(255) NOT NULL, -- 帳號
	"name" varchar(255) NOT NULL, -- 姓名
	"comment" text NULL, -- 說明
	CONSTRAINT tlb_pkey PRIMARY KEY (id),
	CONSTRAINT tlb_unique UNIQUE (username)
);
COMMENT ON TABLE sbos.tlb IS '使用者';
COMMENT ON COLUMN sbos.tlb.id IS 'UUIDv1';
COMMENT ON COLUMN sbos.tlb.created_by IS '建立人員';
COMMENT ON COLUMN sbos.tlb.modified_by IS '異動人員';
COMMENT ON COLUMN sbos.tlb.username IS '帳號';
COMMENT ON COLUMN sbos.tlb."name" IS '姓名';
COMMENT ON COLUMN sbos.tlb."comment" IS '說明';