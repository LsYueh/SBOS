-- 建立自訂 schema
CREATE SCHEMA sbos AUTHORIZATION "sbos-db-user";

-- 設定 sbos-db-user 角色的預設 schema
ALTER ROLE "sbos-db-user" SET search_path TO sbos;
