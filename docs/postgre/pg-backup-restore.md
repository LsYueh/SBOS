# 使用 `pg_dump` 備份資指定料庫

`.env` 設定：
```
POSTGRES_PASSWORD=db-passwd
POSTGRES_DB=postgres
```

<br>

# 備份單一資料庫

```bash
docker exec -e PGPASSWORD=db-passwd -t sbos-postgres-17 pg_dump -U sbos-db-user postgres > ./backups/postgres_backup.sql
```

**說明：**

* `-e PGPASSWORD=db-passwd` → 容器內設置密碼，避免互動輸入。
* `-t` → 保持 STDOUT 連線。
* `>` → 將備份導出到主機的 `./backups`。

<br>

# 備份所有資料庫

```bash
docker exec -e PGPASSWORD=db-passwd -t sbos-postgres-17 pg_dumpall -U sbos-db-user > ./backups/all_databases_backup.sql
```

* 適合整個 PostgreSQL instance 的完整備份。

<br>

# 確認資料庫是否存在

```bash
docker exec -i -e PGPASSWORD=db-passwd my_postgres psql -U sbos-db-user -l
```

* `-l` 會列出 PostgreSQL 中所有資料庫。
* 檢查列表中是否有 `postgres`（你的目標資料庫）。

<br>

# 建立資料庫（如果不存在）

```bash
docker exec -i -e PGPASSWORD=db-passwd my_postgres psql -U sbos-db-user -c "CREATE DATABASE postgres;"
```

**說明：**

* `-c` → 執行 SQL 指令後退出。
* `(慎用)` 如果資料庫已存在，這行會報錯，可忽略或先刪除再重建：

  ```bash
  docker exec -i -e PGPASSWORD=db-passwd my_postgres psql -U sbos-db-user -c "DROP DATABASE IF EXISTS postgres;"
  docker exec -i -e PGPASSWORD=db-passwd my_postgres psql -U sbos-db-user -c "CREATE DATABASE postgres;"
  ```

<br>

# 還原單一資料庫

```bash
docker exec -i -e PGPASSWORD=db-passwd sbos-postgres-17 psql -U sbos-db-user -d postgres < ./backups/postgres_backup.sql
```

**說明：**

* `-i` → 將備份檔案透過 STDIN 導入。
* `-d postgres` → 指定目標資料庫。

<br>

# 還原所有資料庫（pg\_dumpall）

```bash
cat ./backups/all_databases_backup.sql | docker exec -i -e PGPASSWORD=db-passwd sbos-postgres-17 psql -U sbos-db-user
```

<br>

# 可選：壓縮備份（建議大型資料庫）

```bash
# 生成壓縮備份
docker exec -e PGPASSWORD=db-passwd -t sbos-postgres-17 pg_dump -U sbos-db-user -Fc postgres > ./backups/postgres_backup.dump

# 還原壓縮備份
docker exec -i -e PGPASSWORD=db-passwd sbos-postgres-17 pg_restore -U sbos-db-user -d postgres < ./backups/postgres_backup.dump
```

* `-Fc` → 自訂壓縮格式，支援增量恢復與部分還原。
* `pg_restore` → 對壓縮檔還原。

<br>
