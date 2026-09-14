/**
 * Minimal QR Code encoder — byte mode, error-correction level M, versions 1–10.
 *
 * The brief said a "representative" QR code was acceptable, but a code that
 * genuinely scans communicates the product far better in a demo, so this
 * generates real, standards-compliant QR symbols. No runtime dependency.
 *
 * Covers URLs up to 213 bytes, which is ample for `https://host/p/slug`.
 */

// ---------------------------------------------------------------- GF(256)

const EXP = new Uint8Array(512);
const LOG = new Uint8Array(256);

{
  let x = 1;
  for (let i = 0; i < 255; i++) {
    EXP[i] = x;
    LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d; // QR primitive polynomial
  }
  for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
}

const mul = (a: number, b: number) => (a === 0 || b === 0 ? 0 : EXP[LOG[a] + LOG[b]]);

/** Reed–Solomon generator polynomial of the given degree (index 0 = highest). */
function rsGenerator(degree: number): number[] {
  let g = [1];
  for (let i = 0; i < degree; i++) {
    const next = new Array<number>(g.length + 1).fill(0);
    for (let j = 0; j < g.length; j++) {
      next[j] ^= g[j];
      next[j + 1] ^= mul(g[j], EXP[i]);
    }
    g = next;
  }
  return g;
}

/** Error-correction codewords for one data block. */
function rsEncode(data: number[], ecLen: number): number[] {
  const gen = rsGenerator(ecLen);
  const res = new Array<number>(ecLen).fill(0);
  for (const byte of data) {
    const factor = byte ^ res[0];
    res.shift();
    res.push(0);
    for (let j = 0; j < ecLen; j++) res[j] ^= mul(gen[j + 1], factor);
  }
  return res;
}

// ------------------------------------------------- Version block structure

/** [ecCodewordsPerBlock, group1Blocks, group1Data, group2Blocks, group2Data] @ EC level M */
const BLOCKS_M: Record<number, [number, number, number, number, number]> = {
  1: [10, 1, 16, 0, 0],
  2: [16, 1, 28, 0, 0],
  3: [26, 1, 44, 0, 0],
  4: [18, 2, 32, 0, 0],
  5: [24, 2, 43, 0, 0],
  6: [16, 4, 27, 0, 0],
  7: [18, 4, 31, 0, 0],
  8: [22, 2, 38, 2, 39],
  9: [22, 3, 36, 2, 37],
  10: [26, 4, 43, 1, 44],
};

/** Max byte-mode payload per version at EC level M. */
const CAPACITY_M: Record<number, number> = {
  1: 14, 2: 26, 3: 42, 4: 62, 5: 84,
  6: 106, 7: 122, 8: 152, 9: 180, 10: 213,
};

function pickVersion(byteLength: number): number {
  for (let v = 1; v <= 10; v++) if (byteLength <= CAPACITY_M[v]) return v;
  throw new Error("QR payload too long for this encoder (max 213 bytes)");
}

// ------------------------------------------------------------- Bit stream

function buildCodewords(bytes: number[], version: number): number[] {
  const [ecPerBlock, g1Blocks, g1Data, g2Blocks, g2Data] = BLOCKS_M[version];
  const totalData = g1Blocks * g1Data + g2Blocks * g2Data;

  const bits: number[] = [];
  const push = (value: number, len: number) => {
    for (let i = len - 1; i >= 0; i--) bits.push((value >>> i) & 1);
  };

  push(0b0100, 4); // byte mode
  push(bytes.length, version >= 10 ? 16 : 8); // character count indicator
  for (const b of bytes) push(b, 8);

  // Terminator, then pad to a byte boundary, then alternating pad bytes.
  const capacityBits = totalData * 8;
  for (let i = 0; i < 4 && bits.length < capacityBits; i++) bits.push(0);
  while (bits.length % 8 !== 0) bits.push(0);

  const data: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    let byte = 0;
    for (let j = 0; j < 8; j++) byte = (byte << 1) | bits[i + j];
    data.push(byte);
  }
  const PAD = [0xec, 0x11];
  for (let i = 0; data.length < totalData; i++) data.push(PAD[i % 2]);

  // Split into blocks, compute EC, then interleave both sets.
  const dataBlocks: number[][] = [];
  let cursor = 0;
  for (let i = 0; i < g1Blocks; i++) dataBlocks.push(data.slice(cursor, (cursor += g1Data)));
  for (let i = 0; i < g2Blocks; i++) dataBlocks.push(data.slice(cursor, (cursor += g2Data)));
  const ecBlocks = dataBlocks.map((b) => rsEncode(b, ecPerBlock));

  const result: number[] = [];
  const maxData = Math.max(g1Data, g2Data);
  for (let i = 0; i < maxData; i++) {
    for (const block of dataBlocks) if (i < block.length) result.push(block[i]);
  }
  for (let i = 0; i < ecPerBlock; i++) {
    for (const block of ecBlocks) result.push(block[i]);
  }
  return result;
}

// --------------------------------------------------------- Module placement

type Grid = boolean[][];

function alignmentPositions(version: number, size: number): number[] {
  if (version === 1) return [];
  const count = Math.floor(version / 7) + 2;
  const step = Math.ceil((version * 4 + 4) / (count * 2 - 2)) * 2;
  const result = [6];
  for (let pos = size - 7; result.length < count; pos -= step) result.splice(1, 0, pos);
  return result;
}

/**
 * Builds the QR matrix for `text`.
 * Returns a square boolean grid where `true` means a dark module.
 * The quiet zone is NOT included — the renderer adds it.
 */
export function qrMatrix(text: string): Grid {
  const bytes = Array.from(new TextEncoder().encode(text));
  const version = pickVersion(bytes.length);
  const size = version * 4 + 17;

  const modules: Grid = Array.from({ length: size }, () => new Array<boolean>(size).fill(false));
  const reserved: Grid = Array.from({ length: size }, () => new Array<boolean>(size).fill(false));

  const setFn = (x: number, y: number, dark: boolean) => {
    modules[y][x] = dark;
    reserved[y][x] = true;
  };

  // Finder patterns (+ separators): a 9x9 footprint around each 7x7 eye.
  const drawFinder = (cx: number, cy: number) => {
    for (let dy = -4; dy <= 4; dy++) {
      for (let dx = -4; dx <= 4; dx++) {
        const dist = Math.max(Math.abs(dx), Math.abs(dy));
        const x = cx + dx;
        const y = cy + dy;
        if (x >= 0 && x < size && y >= 0 && y < size) setFn(x, y, dist !== 2 && dist <= 3);
      }
    }
  };
  drawFinder(3, 3);
  drawFinder(size - 4, 3);
  drawFinder(3, size - 4);

  // Timing patterns.
  for (let i = 0; i < size; i++) {
    if (!reserved[6][i]) setFn(i, 6, i % 2 === 0);
    if (!reserved[i][6]) setFn(6, i, i % 2 === 0);
  }

  // Alignment patterns (skipping the three finder corners).
  const aligns = alignmentPositions(version, size);
  for (const cy of aligns) {
    for (const cx of aligns) {
      const corner =
        (cx === 6 && cy === 6) ||
        (cx === 6 && cy === size - 7) ||
        (cx === size - 7 && cy === 6);
      if (corner) continue;
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          setFn(cx + dx, cy + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
        }
      }
    }
  }

  // Reserve the format-info strips and the version-info blocks.
  for (let i = 0; i <= 8; i++) {
    if (!reserved[i][8]) reserved[i][8] = true;
    if (!reserved[8][i]) reserved[8][i] = true;
  }
  for (let i = 0; i < 8; i++) {
    reserved[size - 1 - i][8] = true;
    reserved[8][size - 1 - i] = true;
  }
  if (version >= 7) {
    for (let i = 0; i < 18; i++) {
      const a = size - 11 + (i % 3);
      const b = Math.floor(i / 3);
      reserved[b][a] = true;
      reserved[a][b] = true;
    }
  }

  // Data placement: two-module-wide columns, zig-zagging bottom-up then top-down.
  const codewords = buildCodewords(bytes, version);
  let bitIndex = 0;
  const totalBits = codewords.length * 8;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5; // column 6 is the vertical timing pattern
    for (let vert = 0; vert < size; vert++) {
      for (let j = 0; j < 2; j++) {
        const x = right - j;
        const upward = ((right + 1) & 2) === 0;
        const y = upward ? size - 1 - vert : vert;
        if (!reserved[y][x] && bitIndex < totalBits) {
          modules[y][x] = ((codewords[bitIndex >>> 3] >>> (7 - (bitIndex & 7))) & 1) === 1;
          bitIndex++;
        }
      }
    }
  }

  // Try all eight masks, keep the one with the lowest penalty.
  let best: Grid | null = null;
  let bestMask = 0;
  let bestPenalty = Infinity;
  for (let mask = 0; mask < 8; mask++) {
    const candidate = modules.map((row) => row.slice());
    applyMask(candidate, reserved, mask, size);
    drawFormatInfo(candidate, mask, size);
    if (version >= 7) drawVersionInfo(candidate, version, size);
    const penalty = penaltyScore(candidate, size);
    if (penalty < bestPenalty) {
      bestPenalty = penalty;
      best = candidate;
      bestMask = mask;
    }
  }
  void bestMask;
  return best!;
}

function applyMask(grid: Grid, reserved: Grid, mask: number, size: number) {
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (reserved[y][x]) continue;
      let invert = false;
      switch (mask) {
        case 0: invert = (x + y) % 2 === 0; break;
        case 1: invert = y % 2 === 0; break;
        case 2: invert = x % 3 === 0; break;
        case 3: invert = (x + y) % 3 === 0; break;
        case 4: invert = (Math.floor(y / 2) + Math.floor(x / 3)) % 2 === 0; break;
        case 5: invert = ((x * y) % 2) + ((x * y) % 3) === 0; break;
        case 6: invert = (((x * y) % 2) + ((x * y) % 3)) % 2 === 0; break;
        default: invert = (((x + y) % 2) + ((x * y) % 3)) % 2 === 0; break;
      }
      if (invert) grid[y][x] = !grid[y][x];
    }
  }
}

function drawFormatInfo(grid: Grid, mask: number, size: number) {
  const data = (0b00 << 3) | mask; // 0b00 = EC level M
  let rem = data;
  for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
  const bits = ((data << 10) | rem) ^ 0x5412;
  const bit = (i: number) => ((bits >>> i) & 1) === 1;

  for (let i = 0; i <= 5; i++) grid[i][8] = bit(i);
  grid[7][8] = bit(6);
  grid[8][8] = bit(7);
  grid[8][7] = bit(8);
  for (let i = 9; i < 15; i++) grid[8][14 - i] = bit(i);

  for (let i = 0; i < 8; i++) grid[8][size - 1 - i] = bit(i);
  for (let i = 8; i < 15; i++) grid[size - 15 + i][8] = bit(i);
  grid[size - 8][8] = true; // the permanently dark module
}

function drawVersionInfo(grid: Grid, version: number, size: number) {
  let rem = version;
  for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
  const bits = (version << 12) | rem;
  for (let i = 0; i < 18; i++) {
    const dark = ((bits >>> i) & 1) === 1;
    const a = size - 11 + (i % 3);
    const b = Math.floor(i / 3);
    grid[b][a] = dark;
    grid[a][b] = dark;
  }
}

/** ISO/IEC 18004 mask-selection penalty rules 1–4. */
function penaltyScore(grid: Grid, size: number): number {
  let score = 0;

  // Rule 1 — runs of five or more same-coloured modules in a line.
  for (let i = 0; i < size; i++) {
    for (const horizontal of [true, false]) {
      let runColor = false;
      let runLength = 0;
      for (let j = 0; j < size; j++) {
        const cell = horizontal ? grid[i][j] : grid[j][i];
        if (cell === runColor) {
          runLength++;
          if (runLength === 5) score += 3;
          else if (runLength > 5) score += 1;
        } else {
          runColor = cell;
          runLength = 1;
        }
      }
    }
  }

  // Rule 2 — 2x2 blocks of one colour.
  for (let y = 0; y < size - 1; y++) {
    for (let x = 0; x < size - 1; x++) {
      const c = grid[y][x];
      if (c === grid[y][x + 1] && c === grid[y + 1][x] && c === grid[y + 1][x + 1]) score += 3;
    }
  }

  // Rule 3 — finder-like 1:1:3:1:1 patterns.
  const patternA = [true, false, true, true, true, false, true, false, false, false, false];
  const patternB = [false, false, false, false, true, false, true, true, true, false, true];
  const matches = (cells: boolean[], at: number, pattern: boolean[]) =>
    pattern.every((p, k) => cells[at + k] === p);
  for (let i = 0; i < size; i++) {
    const row: boolean[] = [];
    const col: boolean[] = [];
    for (let j = 0; j < size; j++) {
      row.push(grid[i][j]);
      col.push(grid[j][i]);
    }
    for (let j = 0; j + 11 <= size; j++) {
      if (matches(row, j, patternA) || matches(row, j, patternB)) score += 40;
      if (matches(col, j, patternA) || matches(col, j, patternB)) score += 40;
    }
  }

  // Rule 4 — deviation from a 50/50 light-dark balance.
  let dark = 0;
  for (const row of grid) for (const cell of row) if (cell) dark++;
  const percent = (dark * 100) / (size * size);
  score += Math.floor(Math.abs(percent - 50) / 5) * 10;

  return score;
}

/**
 * Renders a matrix as a single SVG path string — one `M…h…v…h…z` per dark
 * module. Cheap to render and crisp at any size.
 */
export function qrPath(grid: Grid): string {
  const parts: string[] = [];
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid.length; x++) {
      if (grid[y][x]) parts.push(`M${x} ${y}h1v1h-1z`);
    }
  }
  return parts.join("");
}
