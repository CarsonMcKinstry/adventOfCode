import * as fs from 'fs';
import * as path from 'path';

// #1 @ 53,238: 26x24

interface Coord {
  x: number;
  y: number;
}

interface Claim {
  number: string;
  position: Coord;
  size: Coord;
}

interface GridSize {
  numColumns: number;
  numRows: number;
}

function parseDimension(i: string) {
  return parseInt(i.replace(':', ''), 10);
}

function parseClaim(claim: string): Claim {
  const [
    claimNumber,
    atSymbol,
    position,
    size,
  ] = claim.split(' ');

  const [sizeX, sizeY] = size
    .split('x')
    .map(parseDimension);

  const [posX, posY] = position
    .split(',')
    .map(parseDimension);

  return {
    number: claimNumber,
    position: {
      x: posX,
      y: posY,
    },
    size: {
      x: sizeX,
      y: sizeY,
    },
  };
}

function run() {
  const stream = fs.createReadStream(path.join(__dirname, '..', 'inputs.txt'));

  stream.on('data', (chunk: Buffer) => {
    const data = chunk.toString().split('\n');

    const parsedClaims: Claim[] = data.map(parseClaim);

    // const { numColumns, numRows }: GridSize = getPatternArray(parsedClaims);

    const pattern = Array.from(Array(1000 * 1000)).map(() => 0);

    parsedClaims.forEach((claim) => {
      for (let i = claim.position.y; i < claim.position. y + claim.size.y; i++) {
        for (let j = claim.position.x; j < claim.position.x + claim.size.x; j++) {
          // this is the calculation of a magic index
          pattern[i + j * 1000] += 1;
        }
      }
    });

    parsedClaims.forEach((claim) => {
      const pieces: number[] = [];
      for (let i = claim.position.y; i < claim.position. y + claim.size.y; i++) {
        for (let j = claim.position.x; j < claim.position.x + claim.size.x; j++) {
          // this is the calculation of a magic index
          pieces.push(pattern[i + j * 1000]);
        }
      }

      if (pieces.every((piece) => piece === 1)) {
        throw new Error(`claim ${claim.number}`);
      }
    });

  });
}

run();
