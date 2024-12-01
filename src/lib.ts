export function zip<A, B>(as: A[], bs: B[]): [A, B][] {
    return as.map((a, i) => [a, bs[i]]);
}

export function inputLines(day: number): string[] {
    return Deno.readTextFileSync(`./.inputs/day-${day.toString().padStart(2, '0')}.txt`)
        .split('\n')
        .map((line) => line.trim());
}
