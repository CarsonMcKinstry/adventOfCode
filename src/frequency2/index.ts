import * as fs from 'fs';
import * as path from 'path';

function parseSignedInt(n: string): number {
  const sign = n.charAt(0);
  const num = n.slice(1);

  return parseInt(num, 10) * (sign === '-' ? -1 : 1);
}

const parseChunks = (chunk: Buffer): string[] => chunk
  .toString()
  .split('\n');

function run() {
  const stream = fs.createReadStream(path.join(__dirname, 'inputs.txt'));

  stream.on('data', (chunk: Buffer) => {
    const data = parseChunks(chunk).map(parseSignedInt);
    const frequencies: number[] = [];

    let count = 0;
    let total = 0;
    while (true) {

      const f = data[count];
      total = total + f;

      if (frequencies.includes(total)) {
        break;
      }

      frequencies.push(total);
      count++;
      if (count === data.length) {
        count = 0;
      }
    }
    console.log(total);
  });

}

run();
