import * as fs from 'fs';
import * as path from 'path';

// #1 @ 53,238: 26x24

interface Coord {
  x: number;
  y: number;
}

interface Claim {
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

// function getPatternArray(claims: Claim[]): GridSize {
//   const maxX = claims.reduce((max, claim) => {
//     if (claim.position.x > max) {
//       max = claim.position.x;
//     }

//     return max;
//   }, 0);

//   const maxY = claims.reduce((max, claim) => {
//     if (claim.position.y > max) {
//       max = claim.position.y;
//     }

//     return max;
//   }, 0);

//   return {
//     numColumns: maxY + 1,
//     numRows: maxX + 1,
//   };
// }

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

    const totalArea = pattern.reduce((total, cellValue) => {
      if (cellValue > 1) {
        return total + 1;
      }

      return total;
    }, 0);

    console.log(totalArea);
  });
}

run();
