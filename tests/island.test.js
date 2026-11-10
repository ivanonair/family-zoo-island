import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const source = readFileSync('src/main.js','utf8');
const radius = Number(source.match(/const ISLAND_RADIUS\s*=\s*(\d+)/)?.[1] || 0);
assert.ok(radius * radius >= 10 * 14.8 * 14.8, 'island land area must be at least ten times original');
