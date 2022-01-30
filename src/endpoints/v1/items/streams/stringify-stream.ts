import { Transform, TransformCallback } from 'stream';

export class StringifyStream extends Transform {

  constructor() {
    super({ encoding: 'utf8' });
  }

  _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback) {
    callback(null, chunk.toString());
  }
}
