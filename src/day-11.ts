import { assertEquals, assertGreater } from 'jsr:@std/assert';
import * as aoc from './lib.ts';

const DAY = 11;

if (import.meta.main) {
    main();
}

Deno.test('day 11', () => {
    const testInput = '125 17';
    assertEquals(part1(testInput), 55312);
});

Deno.test('day 11', () => {
    const testInput = '1';
    assertGreater(part1(testInput), 0);
});

function main(): void {
    const lines = aoc.inputLines(DAY);
    console.log(part1(lines[0]));
    console.log(part2(lines[0]));
}

function part1(initialArrangement: string): number {
    return ticks(initialArrangement.split(' '), 25).length;
}

function part2(initialArrangement: string): number {
    const cache = new Map<string, number>();
    return initialArrangement.split(' ').reduce((acc, value) => acc + countRecursive(cache, value, 75), 0);
}

function countRecursive(cache: Map<string, number>, arrangement: string, count: number): number {
    const cacheKey = `${arrangement}-${count}`;
    const cached = cache.get(cacheKey);
    if (cached !== undefined) {
        return cached;
    }

    if (count === 0) {
        return 1;
    }

    if (arrangement === '0') {
        const result = countRecursive(cache, '1', count - 1);
        cache.set(cacheKey, result);
        return result;
    }

    if (arrangement.length % 2 === 0) {
        const left = countRecursive(cache, arrangement.substring(0, arrangement.length / 2), count - 1);
        const right = countRecursive(
            cache,
            Number(arrangement.substring(arrangement.length / 2)).toString(10),
            count - 1,
        );
        const result = left + right;
        cache.set(cacheKey, result);
        return result;
    }

    const result = countRecursive(cache, (Number(arrangement) * 2024).toString(10), count - 1);
    cache.set(cacheKey, result);
    return result;
}

function ticks(arrangement: string[], count: number): string[] {
    for (let i = 0; i < count; i++) {
        arrangement = tick(arrangement);
    }

    return arrangement;
}

function tick(arrangement: string[]): string[] {
    const newArrangement = [];
    for (let i = 0; i < arrangement.length; i++) {
        const value = arrangement[i];
        if (value === '0') {
            newArrangement.push('1');
            continue;
        }

        if (value.length % 2 === 0) {
            newArrangement.push(value.substring(0, value.length / 2));
            newArrangement.push(Number(value.substring(value.length / 2)).toString(10));
            continue;
        }

        newArrangement.push((Number(value) * 2024).toString(10));
    }

    return newArrangement;
}
