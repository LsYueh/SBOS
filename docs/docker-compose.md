# Docker Compose 常用指令速查表
| 類別          | 指令                                          | 說明            |
| ----------- | ------------------------------------------- | ------------- |
| **啟動 / 停止** | `docker compose up -d`                      | 背景啟動所有服務      |
|             | `docker compose down`                       | 停止並刪除容器、網路    |
|             | `docker compose stop`                       | 停止服務          |
|             | `docker compose start`                      | 啟動已存在但停止的服務   |
|             | `docker compose restart`                    | 重新啟動服務        |
| **狀態 / 日誌** | `docker compose ps`                         | 查看服務狀態        |
|             | `docker compose logs -f`                    | 持續追蹤所有服務日誌    |
|             | `docker compose logs -f web`                | 追蹤指定服務日誌      |
|             | `docker compose top`                        | 查看服務內執行的程序    |
| **建置 / 更新** | `docker compose build`                      | 建置服務映像        |
|             | `docker compose up --build`                 | 啟動前自動重建映像     |
|             | `docker compose pull`                       | 拉取最新映像        |
| **除錯 / 執行** | `docker compose exec web sh`                | 進入指定服務容器      |
|             | `docker compose exec -it db bash`           | 互動模式進入容器      |
|             | `docker compose run --rm web node index.js` | 執行一次性命令       |
| **設定 / 版本** | `docker compose config`                     | 驗證並顯示展開後的設定   |
|             | `docker compose version`                    | 查看 Compose 版本 |

<br>

## 日常最常用 TOP 3
1. `docker compose up -d`  
2. `docker compose logs -f`  
3. `docker compose down`  
