CREATE TABLE IF NOT EXISTS sbos.permissions (
  created_by varchar(255) NOT NULL, -- 建立人員
  created_at timestamp DEFAULT now() NULL,
  modified_by varchar(255) NOT NULL, -- 異動人員
  updated_at timestamp DEFAULT now() NULL,
  deleted_at timestamp NULL,
  id uuid DEFAULT uuid_generate_v1() NOT NULL, -- UUIDv1
  "key" VARCHAR(100) NOT NULL UNIQUE, -- ex: "PAGE_DASHBOARD_VIEW"
  description text NULL, -- 說明
  resource VARCHAR(255), -- ex: "/admin/dashboard"
  "action" VARCHAR(50),  -- ex: "READ", "WRITE", "DELETE"
  CONSTRAINT permissions_pkey PRIMARY KEY (id),
  CONSTRAINT permissions_unique_01 UNIQUE ("key")
);
COMMENT ON TABLE sbos.permissions IS '權限表';
COMMENT ON COLUMN sbos.permissions.created_by IS '建立人員';
COMMENT ON COLUMN sbos.permissions.modified_by IS '異動人員';
COMMENT ON COLUMN sbos.permissions.id IS 'UUIDv1';
COMMENT ON COLUMN sbos.permissions."key" IS 'ex: "PAGE_DASHBOARD_VIEW"';
COMMENT ON COLUMN sbos.permissions.description IS '說明';
COMMENT ON COLUMN sbos.permissions.resource IS 'ex: "/admin/dashboard"';
COMMENT ON COLUMN sbos.permissions."action" IS 'ex: "READ", "WRITE", "DELETE"';