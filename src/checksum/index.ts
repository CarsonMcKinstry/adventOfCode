import * as fs from 'fs';
import * as path from 'path';

interface Acc {
  [key: string]: number;
}

function countCharacters(acc: Acc, idArray: string[]): any {
  const char = idArray[0];

  if (idArray.length === 0) {
    return Object.values(acc);
  }

  const nextAcc: Acc = {
    ...acc,
  };

  if (nextAcc[char]) {
    nextAcc[char]++;
  } else {
    nextAcc[char] = 1;
  }

  return countCharacters(
    nextAcc,
    idArray.slice(1),
  );
}

function run() {
  const stream = fs.createReadStream(path.join(__dirname, 'inputs.txt'));

  stream.on('data', (chunk: Buffer) => {
    const data = chunk.toString().split('\n');

    let doublesCount: number = 0;
    let tripplesCount: number = 0;

    data.forEach((id) => {
      const counts = countCharacters({}, id.split(''));

      if (counts.some((i: number) => i === 2)) {
        doublesCount++;
      }

      if (counts.some((i: number) => i === 3)) {
        tripplesCount++;
      }
    });

    console.log(doublesCount * tripplesCount);
  });

}

run();
