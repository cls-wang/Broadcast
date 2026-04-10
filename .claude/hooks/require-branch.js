#!/usr/bin/env node
// require-branch.js — Block Write/Edit on protected branches
// Claude Code PreToolUse hook (matcher: Write, Edit)
//
// Exit 0 + JSON { decision: "block", reason: "..." } → blocked
// Exit 0 with no output → allowed

'use strict';

const { execSync } = require('child_process');

// Configurable via env var (comma-separated branch names)
const PROTECTED = (process.env.PROTECTED_BRANCHES || 'main,master')
  .split(',').map(b => b.trim()).filter(Boolean);

const chunks = [];
process.stdin.on('data', d => chunks.push(d));
process.stdin.on('end', () => {
  if (process.env.SKIP_BRANCH_CHECK === '1') {
    process.exit(0);
  }

  try {
    const input = JSON.parse(Buffer.concat(chunks).toString() || '{}');
    const filePath = (input?.tool_input?.file_path ?? input?.tool_input?.path ?? '').trim();

    // Get current branch
    let currentBranch;
    try {
      currentBranch = execSync('git rev-parse --abbrev-ref HEAD', {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe'],
      }).trim();
    } catch {
      // Not a git repo or git not available — allow
      process.exit(0);
    }

    // Block protected branches AND detached HEAD
    const isProtected = PROTECTED.includes(currentBranch) || currentBranch === 'HEAD';
    if (isProtected) {
      const branchLabel = currentBranch === 'HEAD' ? 'detached HEAD' : `"${currentBranch}"`;
      process.stdout.write(JSON.stringify({
        decision: 'block',
        reason: `[require-branch] Must create a branch before making file changes.\n\nCurrent: ${branchLabel} (protected)\n\nRun: git checkout -b feat/your-feature-name\n\nTo bypass: set SKIP_BRANCH_CHECK=1`,
      }));
    }
  } catch {
    // Parse or exec failure — allow
  }

  process.exit(0);
});
