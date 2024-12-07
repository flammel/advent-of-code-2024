import { assertEquals } from 'jsr:@std/assert';
import * as aoc from './lib.ts';

const DAY = 7;

if (import.meta.main) {
    main();
}

Deno.test('day 7 a', () => {
    const testInput = ['3267: 81 40 27'];
    assertEquals(part1(testInput), 3267);
});

Deno.test('day 7 b', () => {
    const testInput = ['292: 11 6 16 20'];
    assertEquals(part1(testInput), 292);
});

Deno.test('day 7 c', () => {
    const testInput = ['161011: 16 10 13'];
    assertEquals(part1(testInput), 0);
});

function main(): void {
    const lines = aoc.inputLines(DAY);
    console.log(part1(lines));
    console.log(part2(lines));
}

function part1(equations: string[]): number {
    let sum = 0;
    for (const equation of equations) {
        const [testValue, ...operands] = equation.split(/:? /g).map(Number);
        if (canBeTrue(testValue, operands)) {
            sum += testValue;
        }
    }
    return sum;
}

function part2(equations: string[]): number {
    let sum = 0;
    for (const equation of equations) {
        const [testValue, ...operands] = equation.split(/:? /g).map(Number);
        if (canBeTrueConcatenated(testValue, operands)) {
            sum += testValue;
        }
    }
    return sum;
}

function canBeTrue(testValue: number, operands: number[]): boolean {
    for (let state = 0; state < 2 ** (operands.length - 1); state++) {
        if (evaluate(operands, state) === testValue) {
            return true;
        }
    }
    return false;
}

function evaluate(operands: number[], state: number): number {
    let result = operands.at(0) ?? 0;
    for (const [index, operand] of operands.entries()) {
        if (index === 0) {
            continue;
        }
        if (state & (1 << (index - 1))) {
            result += operand;
        } else {
            result *= operand;
        }
    }
    return result;
}

function canBeTrueConcatenated(testValue: number, operands: number[]): boolean {
    for (const operators of generateOperators(operands.length - 1)) {
        if (evaluateWithConcatenation(operands, operators) === testValue) {
            return true;
        }
    }
    return false;
}

function evaluateWithConcatenation(operands: number[], operators: string): number {
    let result = operands.at(0) ?? 0;
    for (const [index, operand] of operands.entries()) {
        if (index === 0) {
            continue;
        }
        if (operators.at(index - 1) === '0') {
            result += operand;
        } else if (operators.at(index - 1) === '1') {
            result *= operand;
        } else {
            result = Number(String(result) + String(operand));
        }
    }
    return result;
}

function* generateOperators(operandsLength: number): Generator<string> {
    for (let state = 0; state < 3 ** operandsLength; state++) {
        yield state.toString(3).padStart(operandsLength, '0');
    }
}
