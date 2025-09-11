import { defineEventHandler, readBody, createError } from 'h3'


/**------+---------+---------+---------+---------+---------+---------+----------
 * DAL
---------+---------+---------+---------+---------+---------+---------+--------*/

import { DeleteMHOK } from '../dal/MHOK'


/**------+---------+---------+---------+---------+---------+---------+----------
 * Export Event Handler
---------+---------+---------+---------+---------+---------+---------+--------*/

export default defineEventHandler(async (event) => {
  const body = await readBody(event) // 解析 JSON body
  const { MthTime, BrokerId, RecNo } = body;

  // 基本參數檢查
  if (!MthTime || !BrokerId || !RecNo) {
    throw createError({
      statusCode: 422,
      statusMessage: "Invalid request body"
    });
  }

  const affectedRows = DeleteMHOK({ MthTime, BrokerId, RecNo });

  return {
    success: true,
    message: `資料'${BrokerId}::${RecNo}'刪除完畢`,
    affectedRows,
  };
})
