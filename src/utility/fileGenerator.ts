export function f(...lines: (string | undefined)[]) {
    return lines.filter(lines => lines !== undefined).join("\n");
}