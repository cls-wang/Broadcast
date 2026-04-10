#!/usr/bin/env node
// clear-review-flag.js — Clear code-review flag after a successful git commit
// Claude Code PostToolUse hook (matcher: Bash)
//
// Only clears the flag when:
//   1. The completed command was a git commit
//   2. The command succeeded (exit code 0)
// This prevents a failed commit from wiping the review flag.

'use strict';

const os   = require('os');
const fs   = require('fs');
const path = require('path');
const { getProjectHash } = require('./lib/project-hash');

const GIT_COMMIT_RE = /\bgit\s+commit\b/;

const chunks = [];
process.stdin.on('data', d => chunks.push(d));
process.stdin.on('end', () => {
  try {
    const input = JSON.parse(Buffer.concat(chunks).toString() || '{}');
    const command = (input?.tool_input?.command ?? '').trim();

    if (!GIT_COMMIT_RE.test(command)) {
      process.exit(0);
    }

    // Check that the commit actually succeeded
    const exitCode = input?.tool_response?.exitCode ?? input?.tool_response?.returncode ?? -1;
    if (exitCode !== 0) {
      process.exit(0);
    }

    const h = getProjectHash();
    if (!h) process.exit(0);

    const flagFile = path.join(os.tmpdir(), `claude-reviewed-${h}`);
    try { fs.unlinkSync(flagFile); } catch { /* already gone — fine */ }
  } catch {
    // Silently pass
  }

  process.exit(0);
});
