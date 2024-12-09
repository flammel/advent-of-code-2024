import { assertEquals } from 'jsr:@std/assert';
import * as aoc from './lib.ts';

const DAY = 9;

class Block {
    public length: number;
    public fileId: number | undefined;

    constructor(length: number, fileId: number | undefined) {
        this.length = length;
        this.fileId = fileId;
    }

    public isFull(): boolean {
        return this.length === 0 || this.fileId !== undefined;
    }
}

class Disk {
    private firstEmptyIndex = 1;
    private blocks: Block[] = [];

    constructor() {}

    public addBlock(length: number, fileId: number | undefined): void {
        this.blocks.push(new Block(length, fileId));
    }

    public compact(): void {
        while (!this.isCompacted()) {
            this.compactOnce();
        }
    }

    public compactWholeFiles(): void {
        let nextMoveIndex = 0;
        while (this.blocks.length > nextMoveIndex) {
            this.compactWholeFile(nextMoveIndex);
            nextMoveIndex++;
        }
    }

    public checksum(): number {
        let sum = 0;
        let multiplier = 0;

        for (let blockIndex = 0; blockIndex < this.blocks.length; blockIndex++) {
            for (let positionInBlock = 0; positionInBlock < this.blocks[blockIndex].length; positionInBlock++) {
                sum = sum + multiplier * (this.blocks[blockIndex].fileId ?? 0);
                multiplier++;
            }
        }

        return sum;
    }

    private isCompacted(): boolean {
        return this.blocks.every((block) => block.isFull());
    }

    private compactWholeFile(index: number): void {
        const fileBlock = this.blocks[this.blocks.length - 1 - index];
        if (fileBlock === undefined || fileBlock.fileId === undefined || fileBlock.length === 0) {
            return;
        }

        for (let targetIndex = 0; targetIndex < this.blocks.length - 1 - index; targetIndex++) {
            const target = this.blocks[targetIndex];
            if (target.fileId !== undefined) {
                continue;
            }

            if (target.length < fileBlock.length) {
                continue;
            }

            if (target.length === fileBlock.length) {
                target.fileId = fileBlock.fileId;
                fileBlock.fileId = undefined;
                return;
            }

            this.blocks.splice(targetIndex + 1, 0, new Block(target.length - fileBlock.length, undefined));

            target.fileId = fileBlock.fileId;
            target.length = fileBlock.length;
            fileBlock.fileId = undefined;
            return;
        }
    }

    private compactOnce(): void {
        const block = this.blocks.pop();
        if (block === undefined || block.fileId === undefined) {
            return;
        }

        let remainingLength = block.length;

        while (remainingLength > 0) {
            const target = this.blocks[this.firstEmptyIndex];

            if (target === undefined) {
                this.blocks.push(new Block(remainingLength, block.fileId));
                return;
            }

            if (target.isFull()) {
                this.firstEmptyIndex++;
                continue;
            }

            const availableLength = target.length;

            if (availableLength === 0) {
                this.firstEmptyIndex++;
                continue;
            }

            if (availableLength > remainingLength) {
                target.fileId = block.fileId;
                target.length = remainingLength;
                this.blocks.splice(
                    this.firstEmptyIndex + 1,
                    0,
                    new Block(availableLength - remainingLength, undefined),
                );
                return;
            }

            target.fileId = block.fileId;
            remainingLength -= availableLength;
        }
    }
}

if (import.meta.main) {
    main();
}

Deno.test('day 9', () => {
    const testInput = '2333133121414131402';
    assertEquals(part1(testInput), 1928);
    assertEquals(part2(testInput), 2858);
});

function main(): void {
    const lines = aoc.inputLines(DAY);
    console.log(part1(lines[0]));
    console.log(part2(lines[0]));
}

function part1(diskMap: string): number {
    const disk = new Disk();

    for (let index = 0; index < diskMap.length; index++) {
        if (index % 2 === 0) {
            disk.addBlock(parseInt(diskMap[index]), index / 2);
        } else {
            disk.addBlock(parseInt(diskMap[index]), undefined);
        }
    }

    disk.compact();

    return disk.checksum();
}

function part2(diskMap: string): number {
    const disk = new Disk();

    for (let index = 0; index < diskMap.length; index++) {
        if (index % 2 === 0) {
            disk.addBlock(parseInt(diskMap[index]), index / 2);
        } else {
            disk.addBlock(parseInt(diskMap[index]), undefined);
        }
    }

    disk.compactWholeFiles();

    return disk.checksum();
}
