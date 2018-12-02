import * as fs from 'fs';
import * as path from 'path';

function compareIds(first: string, second: string) {
  let numberDifferent = 0;

  first.split('')
    .forEach((c: string, i: number) => {
      const secondC = second.charAt(i);

      if (c !== secondC) {
        numberDifferent++;
      }
    });
  return numberDifferent;
}

function checkIds([first, ...rest]: string[]): [string, string] {
  let count = -1;
  while (++count < rest.length) {
    const n = compareIds(first, rest[count]);

    if (n === 1) {
      break;
    }
  }

  if (count !== rest.length) {
    return [first, rest[count]];
  }

  return checkIds(rest);
}

function filterMismatches(first: string, second: string) {
  const firstChars = first.split('');
  const secondChars = second.split('');

  return firstChars
    .filter((c: string, i: number) => c === secondChars[i])
    .join('');
}

function run() {
  const stream = fs.createReadStream(path.join(__dirname, 'inputs.txt'));

  stream.on('data', (chunk: Buffer) => {
    const data = chunk.toString().split('\n');

    const differingIds = checkIds(data);

    console.log('=========');
    console.log('IDS:');
    console.log(differingIds.join('\n'));
    console.log('CONFIRM:', compareIds(...differingIds));
    console.log(filterMismatches(...differingIds));
    console.log('=========');

  });

}

run();
