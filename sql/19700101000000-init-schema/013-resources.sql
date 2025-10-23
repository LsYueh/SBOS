CREATE TABLE IF NOT EXISTS sbos.resources (
  created_by varchar(255) NOT NULL, -- 建立人員
  created_at timestamp DEFAULT now() NULL,
  modified_by varchar(255) NOT NULL, -- 異動人員
  updated_at timestamp DEFAULT now() NULL,
  deleted_at timestamp NULL,
  id uuid DEFAULT uuid_generate_v1() NOT NULL, -- UUIDv1
  "key" VARCHAR(100) NOT NULL UNIQUE, -- ex: "PAGE_DASHBOARD_VIEW"
  description text NULL, -- 說明
  resource VARCHAR(255), -- 資源 ex: "/admin/dashboard"
  "action" VARCHAR(16),  -- 操作 (BitSet)
  CONSTRAINT resources_pkey PRIMARY KEY (id),
  CONSTRAINT resources_unique_01 UNIQUE ("key")
);
COMMENT ON TABLE sbos.resources IS '資源表';
COMMENT ON COLUMN sbos.resources.created_by IS '建立人員';
COMMENT ON COLUMN sbos.resources.modified_by IS '異動人員';
COMMENT ON COLUMN sbos.resources.id IS 'UUIDv1';
COMMENT ON COLUMN sbos.resources."key" IS 'ex: "PAGE_DASHBOARD_VIEW"';
COMMENT ON COLUMN sbos.resources.description IS '說明';
COMMENT ON COLUMN sbos.resources.resource IS '資源 ex: "/admin/dashboard"';
COMMENT ON COLUMN sbos.resources."action" IS '操作 (BitSet)';