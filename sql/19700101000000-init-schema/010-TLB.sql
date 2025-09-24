CREATE TABLE IF NOT EXISTS "TLB" (
	id uuid DEFAULT uuid_generate_v4() NOT NULL, -- UUIDv4
	username varchar(255) NOT NULL,
	created_by varchar(255) NOT NULL,
	created_at timestamp DEFAULT now() NULL,
	updated_at timestamp DEFAULT now() NULL,
	deleted_at timestamp NULL,
	CONSTRAINT tlb_pkey PRIMARY KEY (id),
	CONSTRAINT tlb_unique UNIQUE (username)
);
COMMENT ON TABLE "TLB" IS '使用者';
COMMENT ON COLUMN "TLB".id IS 'UUIDv4';