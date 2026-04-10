# SKILL: `api-contract-validation`

**Category**: Core Reusable / Shared (Language: JavaScript/Node.js)
**Priority**: HIGH
**Reusability**: Medium-High (IPC, HTTP APIs, RPC, any bidirectional communication)

## Purpose

Validate that API contract definitions are consistently implemented and consumed across a codebase. Detects:
- Undefined channels being called in renderer
- Defined channels with no handler implementation
- Handler implementations with no corresponding definition
- Unused API definitions

## Problem It Solves

In architectures with process isolation (Electron, microservices, distributed systems):
- **Definition file** declares API contracts (e.g., `src/shared/ipc.ts`)
- **Implementation files** implement handlers (e.g., `src/main/ipc/`)
- **Consumer files** call the API (e.g., React components)

Mismatches cause runtime errors:
- `undefined is not a function` when calling non-existent channels
- Silent failures when handlers aren't registered
- Dead code from unused definitions

This SKILL catches these mismatches **before** testing or deployment.

## When to Use

### Automatic (npm hooks)
```json
{
  "pretest": "node node_modules/@cls-wang/claude-shared-config/skills/api-contract-validation/api-contract-validator.js",
  "precommit": "node node_modules/@cls-wang/claude-shared-config/skills/api-contract-validation/api-contract-validator.js"
}
```

### Manual
```bash
node node_modules/@cls-wang/claude-shared-config/skills/api-contract-validation/api-contract-validator.js [config-file.json]
```

## Configuration

Create `api-contract-config.json`:

```json
{
  "definitionsFile": "src/shared/ipc.ts",
  "handlersDir": "src/main/ipc",
  "handlerPattern": "**/*.ts",
  "rendererDir": "src/renderer",
  "rendererPattern": "**/*.{tsx,ts}"
}
```

### Configuration Fields

| Field | Type | Description |
|-------|------|-------------|
| `definitionsFile` | string | Path to API contract definitions (e.g., IPC channel list) |
| `handlersDir` | string | Directory containing handler implementations |
| `handlerPattern` | string | Glob pattern for handler files |
| `rendererDir` | string | Directory containing API consumers (renderer, client code) |
| `rendererPattern` | string | Glob pattern for consumer files |

## Output

### Success
```
Validating API contracts...

API Contract Validation Results:
Defined: 12 | Implemented: 12 | Called: 12 | Total: 12
??All API contracts valid
```

### Violations
```
Validating API contracts...

API Contract Validation Results:
Defined: 12 | Implemented: 10 | Called: 12 | Total: 13

??Contract violations detected:

??Channel "export:merge" is called in renderer but not defined in IPC contract
   src/renderer/components/ExportPanel/index.tsx
   src/renderer/components/ExportPreview/index.tsx

??Channel "analysis:legacy" is defined but never used
```

## Contract Patterns Detected

This SKILL detects channels in standard formats:

### IPC (Electron)
```typescript
// src/shared/ipc.ts
export const CHANNELS = {
  'session:start': {...},
  'export:clip': {...},
}

// src/main/ipc/sessionHandlers.ts
ipcMain.handle('session:start', async (...) => {...})

// src/renderer/components/SessionPanel/index.tsx
window.electronAPI['session:start'](...)
```

### HTTP APIs (Node.js / Web)
```typescript
// src/shared/routes.ts
export const ROUTES = {
  'api:users-get': { method: 'GET', path: '/api/users' },
  'api:users-create': { method: 'POST', path: '/api/users' },
}

// src/main/routes/userRoutes.ts
app.get('/api/users', async (...) => {...})

// src/renderer/api/useUsers.ts
const response = await fetch('/api/users')
```

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | All contracts valid |
| 1 | Contract violations detected |
| 2 | Configuration error |

## Reusability Guide

### For IPC Projects (Electron, Tauri)
Use as-is. Configuration needs:
- Definition file: your IPC channel definitions
- Handler directory: your main process handlers
- Renderer directory: your UI code

### For HTTP API Projects
Adapt glob patterns to match your API routes:
- Definition file: your API route definitions
- Handler directory: your route handler files
- Renderer directory: your client code

### For RPC Projects (gRPC, etc.)
Create custom config and adapt SKILL to your RPC definition format.

## Integration with Other SKILLs

Works with:
- **code-reviewer** agent (can invoke during PR review)
- **npm hooks** (pretest, precommit)
- **CI/CD pipelines** (prevents merging broken contracts)
- **spec-designer** (can verify specs against implementations)

## Limitations & Notes

1. **Pattern Matching**: Uses regex patterns. Complex/dynamic channel names might not be detected.
2. **Type Safety**: Doesn't validate payload types, only channel existence.
3. **Performance**: Linear scan of files; may be slow on very large codebases.
4. **False Positives**: Commented code might trigger false positives.

## Future Enhancements

- [ ] Support for TypeScript type checking (payload validation)
- [ ] Integration with TypeScript compiler API for type-safe detection
- [ ] Support for generated API documentation
- [ ] Performance optimization for large codebases
- [ ] Integration with GraphQL schema validation

