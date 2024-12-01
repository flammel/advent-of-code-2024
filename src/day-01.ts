import * as aoc from './lib.ts';

const input = aoc.inputLines(1).map((line) => line.split(/\s+/).map(Number));
const columnA = input.map((line) => line[0]).toSorted();
const columnB = input.map((line) => line[1]).toSorted();
const totalDistance = aoc
    .zip(columnA, columnB)
    .reduce((sum, [a, b]) => sum + Math.abs(a - b), 0);

console.log(totalDistance);

const occurrenceCounts = columnB.reduce((map, b) => map.set(b, (map.get(b) ?? 0) + 1), new Map<number, number>());
const similarityScore = columnA.reduce((sum, a) => sum + a * (occurrenceCounts.get(a) ?? 0), 0);

console.log(similarityScore);
