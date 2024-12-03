import { assertEquals } from 'jsr:@std/assert';
import * as aoc from './lib.ts';

if (import.meta.main) {
    main();
}

Deno.test('day-03', () => {
    assertEquals(6, runMultiplications('mul(2,3)'));
    assertEquals(6, runMultiplicationsWithConditionals(`mul(2,3)don't()mul(7,9)`));
    assertEquals(7, runMultiplicationsWithConditionals(`mul(2,3)don't()mul(7,9)do()mul(1,1)`));
});

function main(): void {
    const input = aoc.inputLines(3).join('').replace(/\s/g, '');
    const resultPart1 = runMultiplications(input);
    const resultPart2 = runMultiplicationsWithConditionals(input);

    console.log(resultPart1);
    console.log(resultPart2);
}

function runMultiplications(input: string): number {
    const matches = input.matchAll(/mul\((\d+),(\d+)\)/g);
    let sum = 0;
    for (const match of matches) {
        sum += parseInt(match[1]) * parseInt(match[2]);
    }
    return sum;
}

function runMultiplicationsWithConditionals(input: string): number {
    const matches = input.matchAll(/do\(\)|don't\(\)|mul\((\d+),(\d+)\)/g);
    let enabled = true;
    let sum = 0;
    for (const match of matches) {
        if (match[0].startsWith('mul(')) {
            if (enabled) {
                sum += parseInt(match[1]) * parseInt(match[2]);
            }
        } else if (match[0].startsWith('do(')) {
            enabled = true;
        } else if (match[0].startsWith("don't(")) {
            enabled = false;
        }
    }
    return sum;
}
