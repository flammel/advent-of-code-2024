import { assertEquals } from 'jsr:@std/assert';
import * as aoc from './lib.ts';

const DAY = 4;

enum Direction {
    North,
    East,
    South,
    West,
    NorthEast,
    SouthEast,
    SouthWest,
    NorthWest,
}

class Coordinates {
    constructor(public readonly x: number, public readonly y: number) {}

    public to(direction: Direction, distance: number): Coordinates {
        switch (direction) {
            case Direction.North:
                return new Coordinates(this.x, this.y - distance);
            case Direction.East:
                return new Coordinates(this.x + distance, this.y);
            case Direction.South:
                return new Coordinates(this.x, this.y + distance);
            case Direction.West:
                return new Coordinates(this.x - distance, this.y);
            case Direction.NorthEast:
                return this.to(Direction.North, distance).to(Direction.East, distance);
            case Direction.SouthEast:
                return this.to(Direction.South, distance).to(Direction.East, distance);
            case Direction.SouthWest:
                return this.to(Direction.South, distance).to(Direction.West, distance);
            case Direction.NorthWest:
                return this.to(Direction.North, distance).to(Direction.West, distance);
        }
    }
}

class Puzzle {
    constructor(private readonly puzzle: string[]) {}

    public xmasCount(): number {
        let result = 0;

        for (let row = 0; row < this.puzzle.length; row++) {
            for (let column = 0; column < this.puzzle[0].length; column++) {
                result = result + this.xmasCountAt(new Coordinates(column, row));
            }
        }

        return result;
    }

    public masCount(): number {
        let result = 0;

        for (let row = 0; row < this.puzzle.length; row++) {
            for (let column = 0; column < this.puzzle[0].length; column++) {
                result = result + this.masCountAt(new Coordinates(column, row));
            }
        }

        return result;
    }

    private at(coordinates: Coordinates): string | undefined {
        const row = this.puzzle[coordinates.y];
        if (row === undefined) {
            return undefined;
        }

        return row[coordinates.x];
    }

    private xmasCountAt(coords: Coordinates): number {
        if (this.at(coords) !== 'X') {
            return 0;
        }

        let count = 0;

        const directions = [
            Direction.North,
            Direction.East,
            Direction.South,
            Direction.West,
            Direction.NorthEast,
            Direction.SouthEast,
            Direction.SouthWest,
            Direction.NorthWest,
        ];

        for (const direction of directions) {
            if (
                this.at(coords.to(direction, 1)) === 'M' &&
                this.at(coords.to(direction, 2)) === 'A' &&
                this.at(coords.to(direction, 3)) === 'S'
            ) {
                count++;
            }
        }

        return count;
    }

    private masCountAt(coords: Coordinates): number {
        if (this.at(coords) !== 'A') {
            return 0;
        }

        const ne = this.at(coords.to(Direction.NorthEast, 1));
        const se = this.at(coords.to(Direction.SouthEast, 1));
        const sw = this.at(coords.to(Direction.SouthWest, 1));
        const nw = this.at(coords.to(Direction.NorthWest, 1));

        const neSw = (ne === 'M' && sw === 'S') || (ne === 'S' && sw === 'M');
        const nwSe = (nw === 'M' && se === 'S') || (nw === 'S' && se === 'M');

        return neSw && nwSe ? 1 : 0;
    }
}

if (import.meta.main) {
    main();
}

Deno.test('vertical and horizontal', () => {
    const testInput = [
        'S.XMAS',
        'A.X...',
        'M.M...',
        'X.A...',
        '..S...',
        'SAMX..',
    ];
    assertEquals(4, new Puzzle(testInput).xmasCount());
});

Deno.test('overlap and diagonal', () => {
    const testInput = [
        '.XMAS.',
        '.MM...',
        '.A.A..',
        '.S..S.',
    ];
    assertEquals(3, new Puzzle(testInput).xmasCount());
});

Deno.test('no wrap around', () => {
    const testInput = [
        'S.XMA',
        'X.SAM',
    ];
    assertEquals(0, new Puzzle(testInput).xmasCount());
});

Deno.test('mas simple', () => {
    const testInput = [
        'S.M',
        '.A.',
        'S.M',
    ];
    assertEquals(1, new Puzzle(testInput).masCount());
});

function main(): void {
    const lines = aoc.inputLines(DAY);
    const xmasCount = new Puzzle(lines).xmasCount();
    const masCount = new Puzzle(lines).masCount();
    console.log(xmasCount);
    console.log(masCount);
}
