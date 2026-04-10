#!/usr/bin/env node
// lib/project-hash.js — Shared utility: compute a per-project hash from the git root
// Used by require-code-review.js, clear-review-flag.js, and set-review-flag.js

'use strict';

const crypto = require('crypto');
const { execSync } = require('child_process');

/**
 * Returns an 8-char SHA256 hash of the absolute git project root path.
 * Returns null if not in a git repo or git is unavailable.
 */
function getProjectHash() {
  try {
    const root = execSync('git rev-parse --show-toplevel', {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
    return crypto.createHash('sha256').update(root).digest('hex').slice(0, 8);
  } catch {
    return null;
  }
}

module.exports = { getProjectHash };
