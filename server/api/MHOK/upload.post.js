import { defineEventHandler } from 'h3'
import fs from 'fs'

import formidable from 'formidable'

const uploadDir = './.temp';

export default defineEventHandler(async (event) => {
  const form = formidable({
    uploadDir,            // 上傳暫存目錄
    keepExtensions: true, // 保留副檔名
    multiples: false      // 單檔
  })

  // 確保目錄存在
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir)
  }

  return await new Promise((resolve, reject) => {
    form.parse(event.node.req, (err, fields, files) => {
      if (err) reject(err)

      // 假設檔案欄位叫 "file"
      const uploadedFile = files.file

      if (!uploadedFile) {
        return resolve({ success: false, message: '沒有收到檔案' })
      }

      // 取出檔案路徑
      const filePath = Array.isArray(uploadedFile)
        ? uploadedFile[0].filepath
        : uploadedFile.filepath

      // 在這裡可以處理檔案，例如讀內容或上傳到雲端
      // const fileBuffer = fs.readFileSync(filePath);

      // TODO: 批次寫入MHIO

      // 刪除檔案
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) console.error('刪除檔案失敗:', unlinkErr)
      })

      resolve({
        success: true
      })
    })
  })
})