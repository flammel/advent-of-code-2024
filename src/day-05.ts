import { assertEquals } from 'jsr:@std/assert';
import * as aoc from './lib.ts';

const DAY = 5;

if (import.meta.main) {
    main();
}

Deno.test('day 5', () => {
    const testInput = [
        '47|53',
        '97|13',
        '97|61',
        '97|47',
        '75|29',
        '61|13',
        '75|53',
        '29|13',
        '97|29',
        '53|29',
        '61|53',
        '97|53',
        '61|29',
        '47|13',
        '75|47',
        '97|75',
        '47|61',
        '75|61',
        '47|29',
        '75|13',
        '53|13',
        '',
        '75,47,61,53,29',
        '97,61,53,29,13',
        '75,29,13',
        '75,97,47,61,53',
        '61,13,29',
        '97,13,75,29,47',
    ];
    assertEquals(143, part1(testInput));
    assertEquals(123, part2(testInput));
});

function main(): void {
    const lines = aoc.inputLines(DAY);

    console.log(part1(lines));
    console.log(part2(lines));
}

function part1(lines: string[]): number {
    const orderingRules = buildOrderingRules(lines);
    const updates = buildUpdates(lines);

    const correctlyOrderedUpdates = updates.filter((update) => isCorrectlyOrdered(orderingRules, update));
    const sumOfMiddlePagesInCorrectUpdates = sumOfMiddlePages(correctlyOrderedUpdates);

    return sumOfMiddlePagesInCorrectUpdates;
}

function part2(lines: string[]): number {
    const orderingRules = buildOrderingRules(lines);
    const updates = buildUpdates(lines);

    const incorrectlyOrderedUpdates = updates.filter((update) => !isCorrectlyOrdered(orderingRules, update));
    const fixedUpdates = incorrectlyOrderedUpdates.map((update) => fixUpdate(orderingRules, update));
    const sumOfMiddlePagesInCorrectUpdates = sumOfMiddlePages(fixedUpdates);

    return sumOfMiddlePagesInCorrectUpdates;
}

function buildOrderingRules(lines: string[]): [number, number][] {
    return lines.filter((line) => line.includes('|')).map((line) => {
        const parts = line.split('|').map(Number);
        return [parts[0], parts[1]];
    });
}

function buildUpdates(lines: string[]): number[][] {
    return lines.filter((line) => line.includes(',')).map((line) => {
        return line.split(',').map(Number);
    });
}

function isCorrectlyOrdered(orderingRules: [number, number][], update: number[]): unknown {
    return update.every((pageNumber) => isAtCorrectPosition(orderingRules, update, pageNumber));
}

function sumOfMiddlePages(correctlyOrderedUpdates: number[][]): number {
    return correctlyOrderedUpdates.map((update) => update.at(update.length / 2) ?? 0).reduce(
        (acc, curr) => acc + curr,
        0,
    );
}

function isAtCorrectPosition(orderingRules: [number, number][], update: number[], pageNumber: number): boolean {
    const index = update.indexOf(pageNumber);
    for (const [ruleLeft, ruleRight] of orderingRules) {
        if (ruleLeft !== pageNumber) {
            continue;
        }
        const ruleRightIndex = update.indexOf(ruleRight);
        if (ruleRightIndex === -1) {
            continue;
        }
        if (ruleRightIndex < index) {
            return false;
        }
    }

    return true;
}

function fixUpdate(orderingRules: [number, number][], update: number[]): number[] {
    const relevantRules = orderingRules.filter(([l, r]) => update.includes(l) && update.includes(r));

    const result = update.toSorted((a, b) => {
        if (relevantRules.some(([l, r]) => l === a && r === b)) {
            return -1;
        }
        if (relevantRules.some(([l, r]) => l === b && r === a)) {
            return 1;
        }
        return 0;
    });

    return result;
}
