#!/usr/bin/env node
// require-code-review.js — Block git commit if code-reviewer hasn't run
// Claude Code PreToolUse hook (matcher: Bash)
//
// Exit 0 + JSON { decision: "block", reason: "..." } → blocked
// Exit 0 with no output → allowed

'use strict';

const os   = require('os');
const fs   = require('fs');
const path = require('path');
const { getProjectHash } = require('./lib/project-hash');

const GIT_COMMIT_RE = /\bgit\s+commit\b/;

const chunks = [];
process.stdin.on('data', d => chunks.push(d));
process.stdin.on('end', () => {
  if (process.env.SKIP_CODE_REVIEW_CHECK === '1') {
    process.exit(0);
  }

  try {
    const input = JSON.parse(Buffer.concat(chunks).toString() || '{}');
    const command = (input?.tool_input?.command ?? '').trim();

    if (!GIT_COMMIT_RE.test(command)) {
      process.exit(0);
    }

    const h = getProjectHash();
    if (!h) {
      // Not a git repo — allow
      process.exit(0);
    }

    const flagFile = path.join(os.tmpdir(), `claude-reviewed-${h}`);
    if (!fs.existsSync(flagFile)) {
      process.stdout.write(JSON.stringify({
        decision: 'block',
        reason: `[require-code-review] Must run code-reviewer before committing.\n\nNo review flag found for this project.\n\nWorkflow:\n  1. Call the code-reviewer agent\n  2. Ensure it outputs LGTM (no Critical issues)\n  3. Then run git commit\n\nTo bypass: set SKIP_CODE_REVIEW_CHECK=1`,
      }));
    }
  } catch {
    // Parse or exec failure — allow
  }

  process.exit(0);
});
