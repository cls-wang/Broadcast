#!/usr/bin/env node
// console-warn.js — Warn about console.log in edited JS/TS files
// Claude Code PostToolUse hook (matcher: Write, Edit)
//
// Issues a non-blocking warning; never blocks the tool call.

'use strict';

const fs = require('fs');
const path = require('path');

const JS_EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs']);
const EXCLUDE = [/\.test\.[jt]sx?$/, /\.spec\.[jt]sx?$/, /__tests__\//, /__mocks__\//, /\/scripts\//];
const MAX_SHOWN = 5;

const chunks = [];
process.stdin.on('data', d => chunks.push(d));
process.stdin.on('end', () => {
  try {
    const input = JSON.parse(Buffer.concat(chunks).toString() || '{}');
    const filePath = input?.tool_input?.file_path ?? input?.tool_input?.path ?? '';

    if (!filePath) process.exit(0);
    if (!JS_EXTENSIONS.has(path.extname(filePath))) process.exit(0);
    if (EXCLUDE.some(re => re.test(filePath))) process.exit(0);

    let content;
    try { content = fs.readFileSync(filePath, 'utf8'); } catch { process.exit(0); }

    const hits = [];
    content.split('\n').forEach((line, i) => {
      if (/console\.log\s*\(/.test(line) && !/\/\/.*console\.log/.test(line)) {
        hits.push(`  L${i + 1}: ${line.trim().slice(0, 100)}`);
      }
    });

    if (hits.length > 0) {
      const shown = hits.slice(0, MAX_SHOWN);
      const extra = hits.length > MAX_SHOWN ? `\n  ...and ${hits.length - MAX_SHOWN} more` : '';
      process.stdout.write(JSON.stringify({
        message: `[console-warn] ${filePath} has ${hits.length} console.log statement(s):\n${shown.join('\n')}${extra}\n\nRemove debug logs before committing.`,
      }));
    }
  } catch { /* silently pass */ }

  process.exit(0);
});
