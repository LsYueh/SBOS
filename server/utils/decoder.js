import { Transform } from 'stream'

/**
 * @class 處理斷行符號並回傳`Buffer`
 */
export class Decoder extends Transform {
  constructor(options) {
    super({ ...options, readableObjectMode: true });
    this.leftover = '';
  }

  /**
   * 
   * @param {*} chunk 
   * @param {BufferEncoding} encoding 
   * @param {*} callback 
   */
  _transform(chunk, encoding, callback) {
    const buffer = this.leftover ? Buffer.concat([this.leftover, chunk]) : chunk;
    let start = 0;

    for (let i = 0; i < buffer.length; i++) {
      if (buffer[i] === 0x0a) { // \n
        // 判斷前一個字元是不是 \r
        const end = (i > 0 && buffer[i - 1] === 0x0d) ? i - 1 : i;
        const line = buffer.slice(start, end);
        this.push(line);
        start = i + 1;
      }
    }

    this.leftover = start < buffer.length ? buffer.slice(start) : null;
    callback();
  }

  _flush(callback) {
    if (this.leftover) {
      this.push(this.leftover);
    }
    callback();
  }
}
