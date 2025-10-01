CREATE TABLE IF NOT EXISTS sbos.hld (
	created_by varchar(255) NOT NULL, -- 建立人員
	created_at timestamp DEFAULT now() NULL,
	modified_by varchar(255) NOT NULL, -- 異動人員
	updated_at timestamp DEFAULT now() NULL,
	"year" int2 NOT NULL, -- 年
	country_code varchar(3) NOT NULL, -- ISO 3166-1 alpha-3
	flag_set varchar(372) NOT NULL, -- N: 工作日, Y: 假日(國定假日), V: 非正常假日, L:假日延長交易
	CONSTRAINT hld_pk PRIMARY KEY (year, country_code)
);
COMMENT ON TABLE sbos.hld IS '假日檔';
COMMENT ON COLUMN sbos.hld.created_by IS '建立人員';
COMMENT ON COLUMN sbos.hld.modified_by IS '異動人員';
COMMENT ON COLUMN sbos.hld."year" IS '年';
COMMENT ON COLUMN sbos.hld.country_code IS 'ISO 3166-1 alpha-3';
COMMENT ON COLUMN sbos.hld.flag_set IS 'N: 工作日, Y: 假日(國定假日), V: 非正常假日, L:假日延長交易';