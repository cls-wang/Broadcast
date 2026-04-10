#!/usr/bin/env node
// set-review-flag.js — Write code-review flag after code-reviewer outputs LGTM
// Called by agents/code-reviewer.md as its final step when no Critical issues found.
//
// Flag file: <tmpdir>/claude-reviewed-<projectHash>

'use strict';

const os   = require('os');
const fs   = require('fs');
const path = require('path');
const { getProjectHash } = require('./lib/project-hash');

const h = getProjectHash();
if (!h) {
  console.error('[set-review-flag] Not in a git repo — flag not set');
  process.exit(1);
}

const flagFile = path.join(os.tmpdir(), `claude-reviewed-${h}`);
fs.writeFileSync(flagFile, '1', 'utf8');
console.log(`[set-review-flag] Review flag set (project hash: ${h})`);
