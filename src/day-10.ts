import { assertEquals } from 'jsr:@std/assert';
import * as aoc from './lib.ts';

const DAY = 10;

if (import.meta.main) {
    main();
}

Deno.test('day 10', () => {
    const testInput = [
        '10..9..',
        '2...8..',
        '3...7..',
        '4567654',
        '...8..3',
        '...9..2',
        '.....01',
    ];
    assertEquals(part1(testInput.map((line) => line.split('').map(Number))), 3);
});

Deno.test('day 10', () => {
    const testInput = [
        '89010123',
        '78121874',
        '87430965',
        '96549874',
        '45678903',
        '32019012',
        '01329801',
        '10456732',
    ];
    assertEquals(part1(testInput.map((line) => line.split('').map(Number))), 36);
});

function main(): void {
    const lines = aoc.inputLines(DAY);
    console.log(part1(lines.map((line) => line.split('').map(Number))));
    console.log(part2(lines.map((line) => line.split('').map(Number))));
}

function part1(topoMap: number[][]): number {
    let sum = 0;
    for (let row = 0; row < topoMap.length; row++) {
        for (let column = 0; column < topoMap[row].length; column++) {
            if (mapAt(topoMap, column, row) === 0) {
                sum += trailheadScore(topoMap, [column, row]);
            }
        }
    }

    return sum;
}

function part2(topoMap: number[][]): number {
    let sum = 0;
    for (let row = 0; row < topoMap.length; row++) {
        for (let column = 0; column < topoMap[row].length; column++) {
            if (mapAt(topoMap, column, row) === 0) {
                sum += trailheadRating(topoMap, [column, row]);
            }
        }
    }

    return sum;
}

function trailheadScore(topoMap: number[][], trailhead: [number, number]): number {
    const ends = new Set<string>();

    const stack = [[trailhead[0], trailhead[1], topoMap[trailhead[1]][trailhead[0]]]];
    while (stack.length > 0) {
        const head = stack.pop();
        if (head === undefined) {
            break;
        }

        const [col, row, height] = head;

        if (height === 9) {
            ends.add(`${col},${row}`);
            continue;
        }

        if (mapAt(topoMap, col + 1, row) === height + 1) {
            stack.push([col + 1, row, height + 1]);
        }
        if (mapAt(topoMap, col - 1, row) === height + 1) {
            stack.push([col - 1, row, height + 1]);
        }
        if (mapAt(topoMap, col, row + 1) === height + 1) {
            stack.push([col, row + 1, height + 1]);
        }
        if (mapAt(topoMap, col, row - 1) === height + 1) {
            stack.push([col, row - 1, height + 1]);
        }
    }

    return ends.size;
}

function trailheadRating(topoMap: number[][], trailhead: [number, number]): number {
    let rating = 0;

    const stack = [[trailhead[0], trailhead[1], topoMap[trailhead[1]][trailhead[0]]]];
    while (stack.length > 0) {
        const head = stack.pop();
        if (head === undefined) {
            break;
        }

        const [col, row, height] = head;

        if (height === 9) {
            rating++;
            continue;
        }

        if (mapAt(topoMap, col + 1, row) === height + 1) {
            stack.push([col + 1, row, height + 1]);
        }
        if (mapAt(topoMap, col - 1, row) === height + 1) {
            stack.push([col - 1, row, height + 1]);
        }
        if (mapAt(topoMap, col, row + 1) === height + 1) {
            stack.push([col, row + 1, height + 1]);
        }
        if (mapAt(topoMap, col, row - 1) === height + 1) {
            stack.push([col, row - 1, height + 1]);
        }
    }

    return rating;
}

function mapAt(topoMap: number[][], column: number, row: number): number | undefined {
    if (column < 0 || row < 0 || row >= topoMap.length || column >= topoMap[row].length) {
        return undefined;
    }

    return topoMap[row][column];
}
