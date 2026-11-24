// Entry program for make.fun "Ridiculous at First Glance, Real by the Second".
// Reads the one-sentence pitch from entry.txt next to this file and
// writes it verbatim to $MAKEFUN_OUTPUT_DIR/entry.txt (default /output).
// Node 22, standard library only, deterministic: the same input always
// produces the same output bytes.
import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, "entry.txt");
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// The gate only accepts one line of UTF-8 text of 1 to 200 characters,
// not only whitespace, so refuse to emit anything outside that range
// instead of shipping an entry the scorer would mark invalid.
const text = readFileSync(source, "utf8");
const trimmed = text.trim();
const chars = [...trimmed].length;
if (chars < 1 || chars > 200) {
  throw new Error(`entry.txt must hold 1 to 200 characters, got ${chars}`);
}
if (/[\r\n]/.test(trimmed)) {
  throw new Error("entry.txt must hold a single line, no line breaks");
}

mkdirSync(outDir, { recursive: true });
copyFileSync(source, join(outDir, "entry.txt"));
console.log(`wrote ${chars}-character pitch to ${join(outDir, "entry.txt")}`);
