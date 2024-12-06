import { assertEquals } from 'jsr:@std/assert';
import * as aoc from './lib.ts';

const DAY = 6;

if (import.meta.main) {
    main();
}

Deno.test('day 6 straight', () => {
    const testInput = ['>..'];
    assertEquals(part1(testInput), 3);
});

Deno.test('day 6 one turn', () => {
    const testInput = ['>.#', '...'];
    assertEquals(part1(testInput), 3);
});

Deno.test('day 6 example', () => {
    const testInput = [
        '....#.....',
        '.........#',
        '..........',
        '..#.......',
        '.......#..',
        '..........',
        '.#..^.....',
        '........#.',
        '#.........',
        '......#...',
    ];
    assertEquals(part1(testInput), 41);
});

Deno.test('day 6 example part 2', () => {
    const testInput = [
        '....#.....',
        '.........#',
        '..........',
        '..#.......',
        '.......#..',
        '..........',
        '.#..^.....',
        '........#.',
        '#.........',
        '......#...',
    ];
    assertEquals(part2(testInput), 6);
});

Deno.test('causes loop', () => {
    const testInput = ['>.#', '...'];
    assertEquals(causesLoop(testInput, findStartState(testInput)), false);
});

function main(): void {
    const lines = aoc.inputLines(DAY);
    console.log(part1(lines));
    console.log(part2(lines));
}

type Direction = '<' | '>' | '^' | 'v';
type Column = number;
type Row = number;
type GuardState = readonly [Direction, Column, Row];

function part1(map: string[]): number {
    let guardState = findStartState(map);
    const visitedPositions = new Set<string>();

    while (isOnMap(map, guardState)) {
        visitPosition(visitedPositions, guardState);
        guardState = moveGuard(map, guardState);
    }

    return visitedPositions.size;
}

function part2(map: string[]): number {
    const startGuardState = findStartState(map);
    const visitedPositions = new Set<string>();

    let currentGuardState = startGuardState;
    while (isOnMap(map, currentGuardState)) {
        visitPosition(visitedPositions, currentGuardState);
        currentGuardState = moveGuard(map, currentGuardState);
    }

    unvisitPosition(visitedPositions, startGuardState);
    let loopCount = 0;
    for (const visitedPosition of visitedPositions.values()) {
        const [col, row] = visitedPosition.split(',').map(Number);
        if (causesLoop(addBlock(map, [col, row]), startGuardState)) {
            loopCount++;
        }
    }

    return loopCount;
}

function addBlock(map: string[], position: [Column, Row]): string[] {
    const [col, row] = position;
    const line = map[row];
    const newMap = [...map];
    newMap[row] = line.substring(0, col) + '#' + line.substring(col + 1);
    return newMap;
}

function causesLoop(map: string[], startGuardState: GuardState): boolean {
    const visitedPositions = new Set<string>();

    const add = (s: GuardState) => visitedPositions.add(`${s[0]},${s[1]},${s[2]}`);
    const isNew = (s: GuardState) => !visitedPositions.has(`${s[0]},${s[1]},${s[2]}`);

    let currentGuardState = startGuardState;
    while (isOnMap(map, currentGuardState) && isNew(currentGuardState)) {
        add(currentGuardState);
        currentGuardState = moveGuard(map, currentGuardState);
    }

    if (isOnMap(map, currentGuardState)) {
        return true;
    }

    return false;
}

function isOnMap(map: string[], guardState: GuardState): boolean {
    const [_, col, row] = guardState;
    return col >= 0 && row >= 0 && row < map.length && col < map[row].length;
}

function findStartState(map: string[]): GuardState {
    for (let row = 0; row < map.length; row++) {
        const line = map[row];
        for (let col = 0; col < line.length; col++) {
            const c = line[col];
            if (c === '<' || c === '>' || c === '^' || c === 'v') {
                return [c, col, row];
            }
        }
    }

    throw new Error('No guard found');
}

function visitPosition(
    visitedPositions: Set<string>,
    guardState: GuardState,
): void {
    const [_, col, row] = guardState;
    visitedPositions.add(`${col},${row}`);
}

function unvisitPosition(
    visitedPositions: Set<string>,
    guardState: GuardState,
): void {
    const [_, col, row] = guardState;
    visitedPositions.delete(`${col},${row}`);
}

function moveGuard(map: string[], guardState: GuardState): GuardState {
    const nextGuardState = moveForward(guardState);

    if (isOnMap(map, nextGuardState) && isBlocked(map, nextGuardState)) {
        return turnRight(guardState);
    }

    return nextGuardState;
}

function isBlocked(map: string[], guardState: GuardState): boolean {
    const [_, col, row] = guardState;
    return map[row][col] === '#';
}

function moveForward(guardState: GuardState): GuardState {
    const [direction, col, row] = guardState;
    switch (direction) {
        case '<':
            return ['<', col - 1, row];
        case '>':
            return ['>', col + 1, row];
        case '^':
            return ['^', col, row - 1];
        case 'v':
            return ['v', col, row + 1];
    }
}

function turnRight(guardState: GuardState): GuardState {
    const [direction, col, row] = guardState;
    switch (direction) {
        case '<':
            return ['^', col, row];
        case '>':
            return ['v', col, row];
        case '^':
            return ['>', col, row];
        case 'v':
            return ['<', col, row];
    }
}
