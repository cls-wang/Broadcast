# SKILL: `abi-compatibility-check`

**Category**: Core Reusable / Shared (Language: JavaScript/Node.js)
**Priority**: HIGH
**Reusability**: High (Node.js, Electron, any native module environment)

## Purpose

Validate that system Node.js ABI version matches target environment ABI for native module compilation. Prevents silent ABI mismatches that cause cryptic runtime errors like "binding not found" or segmentation faults.

## Problem It Solves

When a project uses native modules (like `better-sqlite3`):
- **System Node.js** has one ABI version (e.g., 127)
- **Target environment** (e.g., Electron 33.4.11) has different ABI (e.g., 130)
- Module bindings built for one ABI fail silently in the other
- Errors only appear at runtime with cryptic messages

This SKILL detects the mismatch **before** code execution and provides clear remediation.

## When to Use

### Automatic (npm hooks)
```json
{
  "predev": "node node_modules/@cls-wang/claude-shared-config/skills/abi-compatibility-check/abi-check.js",
  "pretest": "node node_modules/@cls-wang/claude-shared-config/skills/abi-compatibility-check/abi-check.js"
}
```

### Manual
```bash
node node_modules/@cls-wang/claude-shared-config/skills/abi-compatibility-check/abi-check.js [config-file.json]
```

## Configuration

Create `abi-check-config.json` in the SKILL directory or specify custom path:

```json
{
  "modules": [
    {
      "name": "better-sqlite3",
      "target": "electron",
      "version": "33.4.11",
      "rebuild-command": "npx @electron/rebuild -v 33.4.11 --abi 130 --force"
    }
  ]
}
```

### Configuration Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Module name (for display) |
| `target` | string | Yes | Target environment: `"node"` or `"electron"` |
| `version` | string | For Electron | Target version (e.g., `"33.4.11"` for Electron) |
| `rebuild-command` | string | No | Custom rebuild command (optional override) |

## Output

### Success
```
Checking native module ABI compatibility...
System Node.js ABI: 127

??better-sqlite3: ABI 127 matches electron 33.4.11 ABI 130
??All native modules ABI compatible
```

### Mismatch
```
Checking native module ABI compatibility...
System Node.js ABI: 127

??better-sqlite3: ABI mismatch (system: 127, target: 130)

Remediation for better-sqlite3:
The system Node.js ABI (127) doesn't match Electron 33.4.11 ABI (130).

Run: npx @electron/rebuild -v 33.4.11 --abi 130 --force
This rebuilds better-sqlite3 with the correct ABI for Electron.
```

## Supported Environments

| Environment | Detection Method | Notes |
|-------------|-----------------|-------|
| Node.js | `process.versions.modules` | Uses system Node ABI as target |
| Electron | Version ??ABI mapping | Map maintained in `check-abi.js` |

### Electron ABI Map
- Electron 31, 32, 33 ??ABI 130
- Electron 34, 35 ??ABI 131
- (Easily extensible in `electronABIMap`)

## Exit Codes

| Code | Meaning | Example |
|------|---------|---------|
| 0 | All checks pass | All native modules ABI compatible |
| 1 | ABI mismatch detected | System ABI != target ABI |
| 2 | Configuration error | Missing config file, invalid JSON |

## Reusability Guide

### For Other Projects

1. **Copy SKILL directory** to `.claude/skills/_core/check-native-abi/`
2. **Create config file** in project root or custom location with modules list
3. **Add npm hooks** to `package.json`
4. **Run manually** when debugging: `node .claude/skills/_core/check-native-abi/check-abi.js my-config.json`

### Example: Adapt for Custom Native Modules

```json
{
  "modules": [
    {
      "name": "my-custom-native-module",
      "target": "electron",
      "version": "28.0.0",
      "rebuild-command": "npm run rebuild:native"
    },
    {
      "name": "another-module",
      "target": "node",
      "version": "20.0.0"
    }
  ]
}
```

## Limitations & Notes

1. **Electron ABI Map**: Hardcoded in `check-abi.js`. Add new versions as they release.
2. **Runtime Performance**: Runs only at npm hook execution time (dev/test), not production.
3. **Multiple Modules**: Can check multiple modules in single config.

## Integration with Other SKILLs

Works with:
- **electron-abi-checker** (electron-specific adapter layer)
- **npm scripts** (predev, pretest hooks)
- **CI/CD pipelines** (can add to GitHub Actions)

## Future Enhancements

- [ ] Auto-detect Electron version from `package.json`
- [ ] Parallel ABI check for multiple modules
- [ ] Integration with auto-rebuild tools
- [ ] Support for other native module scenarios (Node-API, N-API)

