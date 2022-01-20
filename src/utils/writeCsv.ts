import { Response } from 'express';
import iconv from 'iconv-lite';
import csv from 'csv-stringify';

export function writeCsv(data: string[][], res: Response): void {
  res.setHeader('Content-Type', 'text/csv; charset=windows-1252');

  const stream = iconv.encodeStream('win-1252');

  stream.pipe(res);

  csv(data, {delimiter: ','}, (err, output) => {
    stream.end(output!);
  });
}
