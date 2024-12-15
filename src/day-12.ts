import { assertEquals } from 'jsr:@std/assert';
import * as aoc from './lib.ts';

const DAY = 12;

if (import.meta.main) {
    main();
}

Deno.test('day 12 1 a', () => {
    const testInput = ['AAAA', 'BBCD', 'BBCC', 'EEEC'];
    assertEquals(part1(testInput), 140);
});

Deno.test('day 12 1 b', () => {
    const testInput = [
        'OOOOO',
        'OXOXO',
        'OOOOO',
        'OXOXO',
        'OOOOO',
    ];
    assertEquals(part1(testInput), 772);
});

Deno.test('day 12 1 c', () => {
    const testInput = [
        'RRRRIICCFF',
        'RRRRIICCCF',
        'VVRRRCCFFF',
        'VVRCCCJFFF',
        'VVVVCJJCFE',
        'VVIVCCJJEE',
        'VVIIICJJEE',
        'MIIIIIJJEE',
        'MIIISIJEEE',
        'MMMISSJEEE',
    ];
    assertEquals(part1(testInput), 1930);
});

Deno.test('day 12 1 d', () => {
    const testInput = [
        'RRRRIICCFF',
        'RRRRIICCCF',
        'VVRRRCCFFF',
        'VVRCCCJFFF',
        'VVVVCJJCFE',
        'VVIVCCJJEE',
        'VVIIICJJEE',
        'MIIIIIJJEE',
        'MIIISIJEEE',
        'MMMISSJEEE',
    ];
    assertEquals(part1(testInput), 1930);
});

Deno.test('day 12 2 a', () => {
    const testInput = ['AAAA', 'BBCD', 'BBCC', 'EEEC'];
    assertEquals(part2(testInput), 80);
});

Deno.test('day 12 2 b', () => {
    const testInput = [
        'OOOOO',
        'OXOXO',
        'OOOOO',
        'OXOXO',
        'OOOOO',
    ];
    assertEquals(part2(testInput), 436);
});

Deno.test('day 12 2 c', () => {
    const testInput = [
        'EEEEE',
        'EXXXX',
        'EEEEE',
        'EXXXX',
        'EEEEE',
    ];
    assertEquals(part2(testInput), 236);
});

Deno.test('day 12 2 d', () => {
    const testInput = [
        'AAAAAA',
        'AAABBA',
        'AAABBA',
        'ABBAAA',
        'ABBAAA',
        'AAAAAA',
    ];
    assertEquals(part2(testInput), 368);
});

Deno.test('day 12 2 e', () => {
    const testInput = [
        'RRRRIICCFF',
        'RRRRIICCCF',
        'VVRRRCCFFF',
        'VVRCCCJFFF',
        'VVVVCJJCFE',
        'VVIVCCJJEE',
        'VVIIICJJEE',
        'MIIIIIJJEE',
        'MIIISIJEEE',
        'MMMISSJEEE',
    ];
    assertEquals(part2(testInput), 1206);
});

function main(): void {
    const lines = aoc.inputLines(DAY);
    console.log(part1(lines));
    console.log(part2(lines));
}

type Region1 = {
    typeOfPlant: string;
    fields: [number, number][];
    perimeter: number;
};

function part1(map: string[]): number {
    const regions: Region1[] = [];
    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
            const typeOfPlant = map[row][col];
            const regionAbove = regions.find(
                (region) =>
                    region.typeOfPlant === typeOfPlant &&
                    region.fields.some(([r, c]) => r === row - 1 && c === col),
            );
            const regionLeft = regions.find(
                (region) =>
                    region.typeOfPlant === typeOfPlant &&
                    region.fields.some(([r, c]) => r === row && c === col - 1),
            );

            if (regionAbove === undefined && regionLeft === undefined) {
                regions.push({
                    typeOfPlant,
                    fields: [[row, col]],
                    perimeter: 4,
                });
            } else if (regionAbove !== undefined && regionLeft !== undefined) {
                if (regionAbove === regionLeft) {
                    regionAbove.fields.push([row, col]);
                    // No change in perimeter
                } else {
                    regionAbove.fields.push(...regionLeft.fields);
                    regionAbove.fields.push([row, col]);
                    regionAbove.perimeter += regionLeft.perimeter;
                    regions.splice(regions.indexOf(regionLeft), 1);
                }
            } else if (regionAbove === undefined && regionLeft !== undefined) {
                regionLeft.fields.push([row, col]);
                regionLeft.perimeter += 2;
            } else if (regionAbove !== undefined && regionLeft === undefined) {
                regionAbove.fields.push([row, col]);
                regionAbove.perimeter += 2;
            }
        }
    }

    return regions.reduce((acc, region) => acc + region.fields.length * region.perimeter, 0);
}

type Region2 = {
    typeOfPlant: string;
    fields: [number, number][];
    sides: number;
};

function part2(map: string[]): number {
    const regions: Region2[] = [];
    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
            const typeOfPlant = map[row][col];
            const left = regions.find(
                (region) =>
                    region.typeOfPlant === typeOfPlant &&
                    region.fields.some(([r, c]) => r === row && c === col - 1),
            );
            const aboveLeft = regions.find(
                (region) =>
                    region.typeOfPlant === typeOfPlant &&
                    region.fields.some(([r, c]) => r === row - 1 && c === col - 1),
            );
            const above = regions.find(
                (region) =>
                    region.typeOfPlant === typeOfPlant &&
                    region.fields.some(([r, c]) => r === row - 1 && c === col),
            );
            const aboveRight = regions.find(
                (region) =>
                    region.typeOfPlant === typeOfPlant &&
                    region.fields.some(([r, c]) => r === row - 1 && c === col + 1),
            );

            if (above === undefined && left === undefined) {
                // OOO and XOO and OOX
                // OX.     OX.     OX.
                regions.push({
                    typeOfPlant,
                    fields: [[row, col]],
                    sides: 4,
                });
            } else if (above === undefined && left !== undefined) {
                left.fields.push([row, col]);

                if (aboveLeft === undefined) {
                    // OO?
                    // XX.
                    // Number of sides does not change.
                } else {
                    // XO?
                    // XX.
                    left.sides += 2;
                }
            } else if (above !== undefined && left === undefined) {
                above.fields.push([row, col]);

                if (aboveLeft === undefined && aboveRight === undefined) {
                    // OXO
                    // OX.
                    // Number of sides does not change.
                } else if (aboveLeft !== undefined && aboveRight !== undefined) {
                    // XXX
                    // OX.
                    above.sides += 4;
                } else if (aboveLeft === undefined && aboveRight !== undefined) {
                    // OXX
                    // OX.
                    above.sides += 2;
                } else if (aboveLeft !== undefined && aboveRight === undefined) {
                    // XXO
                    // OX.
                    above.sides += 2;
                }
            } else if (above !== undefined && left !== undefined) {
                if (above !== left) {
                    above.fields.push(...left.fields);
                    above.sides += left.sides;
                    regions.splice(regions.indexOf(left), 1);
                }

                above.fields.push([row, col]);

                if (aboveLeft === undefined && aboveRight === undefined) {
                    // OXO
                    // XX.
                    // SUBTRACT
                    above.sides -= 2;
                } else if (aboveLeft !== undefined && aboveRight !== undefined) {
                    // XXX
                    // XX.
                    // Number of sides does not change.
                } else if (aboveLeft === undefined && aboveRight !== undefined) {
                    // OXX
                    // XX.
                    // Number of sides does not change.
                } else if (aboveLeft !== undefined && aboveRight === undefined) {
                    // XXO
                    // XX.
                    // SUBTRACT
                    above.sides -= 2;
                }
            }
        }
    }

    return regions.reduce((acc, region) => acc + region.fields.length * region.sides, 0);
}
