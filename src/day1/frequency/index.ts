import * as fs from 'fs';
import * as path from 'path';

function parseSignedInt(n: string): number {
  const sign = n.charAt(0);
  const num = n.slice(1);

  return parseInt(num, 10) * (sign === '-' ? -1 : 1);
}

function foldFrequencies(total: number, frequency: number): number {
  return total + frequency;
}

const parseChunks = (chunk: Buffer): string[] => chunk
  .toString()
  .split('\n');

function run() {
  const stream = fs.createReadStream(path.join(__dirname, 'inputs.txt'));

  stream.on('data', (chunk: Buffer) => {
    const data = parseChunks(chunk);

    const total = data
      .reduce<number>((acc, val) => foldFrequencies(acc, parseSignedInt(val)), 0);

    console.log(total);
  });

}

run();
