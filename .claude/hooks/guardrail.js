#!/usr/bin/env node
// guardrail.js — Core guardrail: block dangerous Bash commands
// Claude Code PreToolUse hook (matcher: Bash)
//
// Exit 0 + JSON { decision: "block", reason: "..." } → blocked
// Exit 0 with no output → allowed

'use strict';

const DANGEROUS_PATTERNS = [
  { re: /rm\s+-[rf]{1,2}\s+[/~]/, label: 'rm -rf on root/home' },
  { re: /rm\s+-[rf]{1,2}\s+\*/, label: 'rm -rf wildcard' },
  { re: /rm\s+-[rf]{1,2}\s+\.\./, label: 'rm -rf parent directory' },
  { re: /git\s+push\s+[^|&;]*--force(?!-with-lease)/, label: 'git push --force (use --force-with-lease)' },
  { re: /git\s+reset\s+--hard/, label: 'git reset --hard' },
  { re: />\s*\.env(?:\b|$)/, label: 'overwrite .env file' },
  { re: /chmod\s+777/, label: 'chmod 777 (insecure permissions)' },
  { re: /curl\s+[^|]*\|\s*(?:ba|da)?sh/, label: 'pipe curl to shell' },
  { re: /wget\s+[^|]*\|\s*(?:ba|da)?sh/, label: 'pipe wget to shell' },
  { re: /:\s*\(\)\s*\{[^}]*\}\s*;?\s*:/, label: 'fork bomb' },
];

const chunks = [];
process.stdin.on('data', d => chunks.push(d));
process.stdin.on('end', () => {
  try {
    const input = JSON.parse(Buffer.concat(chunks).toString() || '{}');
    const command = (input?.tool_input?.command ?? '').trim();

    if (!command) process.exit(0);

    for (const { re, label } of DANGEROUS_PATTERNS) {
      if (re.test(command)) {
        process.stdout.write(JSON.stringify({
          decision: 'block',
          reason: `[guardrail] Blocked dangerous command (${label}):\n  ${command}\n\nIf intentional, run this directly in your terminal.`,
        }));
        process.exit(0);
      }
    }
  } catch {
    // Parse failure — pass through
  }
  process.exit(0);
});
