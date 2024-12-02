import { assertEquals } from 'jsr:@std/assert';
import * as aoc from './lib.ts';

if (import.meta.main) {
    main();
}

Deno.test('[11, 9, 9, 7] is safe with dampening', () => {
    assertEquals(isSafe([11, 9, 9, 7]), false);
    assertEquals(isSafeWithDampening([11, 9, 9, 7]), true);
});

function main(): void {
    const reports = aoc
        .inputLines(2)
        .map((line) => line.split(/\s+/).map(Number));
    const numberOfSafeReports = reports.filter((report) => isSafe(report)).length;
    const numberOfSafeReportsWithDampening = reports.filter((report) => isSafeWithDampening(report)).length;

    console.log(numberOfSafeReports);
    console.log(numberOfSafeReportsWithDampening);
}

function isSafeWithDampening(report: number[]): boolean {
    if (isSafe(report)) {
        return true;
    }

    for (let i = 0; i < report.length; i++) {
        if (isSafe([...report.slice(0, i), ...report.slice(i + 1)])) {
            return true;
        }
    }

    return false;
}

function isSafe(report: number[]): boolean {
    let previousLevel = undefined;
    let maxDiff = undefined;
    let minDiff = undefined;

    for (const level of report) {
        if (previousLevel === undefined) {
            previousLevel = level;
            continue;
        }

        const diff = level - previousLevel;
        if (maxDiff === undefined || diff > maxDiff) {
            maxDiff = diff;
        }
        if (minDiff === undefined || diff < minDiff) {
            minDiff = diff;
        }

        previousLevel = level;
    }

    const minDiffNegSafe = minDiff === -1 || minDiff === -2 || minDiff === -3;
    const maxDiffNegSafe = maxDiff === -1 || maxDiff === -2 || maxDiff === -3;
    if (minDiffNegSafe && maxDiffNegSafe) {
        return true;
    }

    const minDiffPosSafe = minDiff === 1 || minDiff === 2 || minDiff === 3;
    const maxDiffPosSafe = maxDiff === 1 || maxDiff === 2 || maxDiff === 3;
    if (minDiffPosSafe && maxDiffPosSafe) {
        return true;
    }

    return false;
}
