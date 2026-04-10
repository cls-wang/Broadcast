#!/usr/bin/env node
// suggest-compact.js — Suggest /compact when tool-call count reaches threshold
// Claude Code PreToolUse hook (matcher: *)
//
// Tracks per-session tool invocations in a temp file.
// Suggests /compact at COMPACT_THRESHOLD (default 50), then every COMPACT_REPEAT (default 25).

'use strict';

const os = require('os');
const fs = require('fs');
const path = require('path');

const THRESHOLD = parseInt(process.env.COMPACT_THRESHOLD || '50', 10);
const REPEAT = parseInt(process.env.COMPACT_REPEAT || '25', 10);

const chunks = [];
process.stdin.on('data', d => chunks.push(d));
process.stdin.on('end', () => {
  try {
    const input = JSON.parse(Buffer.concat(chunks).toString() || '{}');
    const sessionId = (input?.session_id ?? 'default').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 16);
    const stateFile = path.join(os.tmpdir(), `claude-compact-${sessionId}.json`);

    let count = 0;
    try {
      const saved = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
      count = saved.count ?? 0;
    } catch { /* first call this session */ }

    count += 1;
    fs.writeFileSync(stateFile, JSON.stringify({ count }), 'utf8');

    const overThreshold = count > THRESHOLD && (count - THRESHOLD) % REPEAT === 0;
    if (count === THRESHOLD || overThreshold) {
      process.stdout.write(JSON.stringify({
        message: `[suggest-compact] Tool call count: ${count}. Consider running /compact to free context window before continuing.`,
      }));
    }
  } catch { /* silently pass through */ }

  process.exit(0);
});
