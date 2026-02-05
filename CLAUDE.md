# Web Radio Player

> Claude Code 專案規範：開發工作流程、程式碼風格與關鍵規則

## Quick Facts

- **Stack**: Vue 3 (Composition API), Vite, Tailwind CSS, Vitest
- **Test Command**: `npm run test:run`
- **Build Command**: `npm run build`
- **Deploy Command**: `/deploy` skill
- **Main Branch**: `main`
- **Specs Location**: See `docs/specs/` for feature specifications

## Key Directories

- `src/` - Vue 3 應用程式原始碼
- `tests/` - Vitest 測試檔案
- `public/` - 靜態公開檔案
- `dist/` - 生產版本輸出（部署到 GitHub Pages）
- `docs/specs/` - 功能規格文件（播放邏輯、資料結構、UI 設計）
- `.claude/skills/` - Claude Code 自定義 skills

## Code Style

- Vue 3 Composition API with `<script setup>` syntax
- Prefer arrow functions for event handlers
- Use reactive state with `ref()` and `reactive()`
- Component should be self-contained and reusable
- Use Tailwind utility classes, avoid custom CSS unless necessary
- Early returns over nested conditionals
- Prefer composition over inheritance
- No TypeScript `any` - use proper types or `unknown`

## Git Conventions

### Branch Naming
- **Rule**: All code changes (except `CLAUDE.md` or `README.md`) MUST be on feature branches
- **Format**: `<type>/<short-description>`
- **Types**:
  - `feat/` - New features
  - `fix/` - Bug fixes
  - `refactor/` - Code refactoring
  - `style/` - UI/styling changes
  - `test/` - Test additions or updates
  - `docs/` - Documentation updates
- **Examples**:
  - `feat/add-volume-control`
  - `fix/audio-playback-error`
  - `refactor/optimize-modal`
  - `style/update-button-design`

### Commit Format
- **Style**: Conventional Commits
- **Format**: `<type>: <description>`
- **Description**: Clear, concise, in Chinese or English
- **Examples**:
  - `feat: 新增音量控制功能`
  - `fix: 修正 HTTPS 電台播放錯誤`
  - `refactor: 重構彈窗元件邏輯`
  - `style: 更新按鈕樣式與間距`
  - `test: 新增播放邏輯測試`
  - `docs: 更新 API 文件`

### Automated Workflow

1. **Branch Creation**: Automatically create feature branch based on task
2. **Development**: Write code following project conventions
3. **Testing**: Run `npm run test:run` to verify all tests pass
4. **Building**: Run `npm run build` to ensure production build succeeds
5. **Auto Commit**: Automatically commit with conventional commit message
6. **Auto Push**: Push to GitHub after user confirmation
7. **Merge & Deploy**: Prompt user to merge to `main` and deploy

## Critical Rules

### Testing Requirements
- NEVER commit without running tests first
- All tests MUST pass before committing
- If adding new features, add corresponding tests
- Run `npm run test:run` before every commit
- Test coverage should be maintained or improved

### Build Verification
- ALWAYS run `npm run build` before committing
- Production build MUST succeed without errors
- Check console for warnings and resolve them
- Verify no build size regressions

### Error Handling
- NEVER swallow errors silently
- Always show user feedback for errors
- Log errors for debugging
- Provide actionable error messages

### UI States
- Every async operation needs loading state
- Every operation needs error handling
- Show user feedback for all actions
- Disable buttons during async operations
- Handle loading, error, empty, success states

### Mobile Optimization
- Touch targets should be at least 44x44px (iOS HIG standard)
- Test on both Chrome and Safari mobile
- Ensure responsive design works on all screen sizes
- Use large, easily tappable buttons
- Avoid double-tap zoom issues

### Code Quality
- Keep components focused and single-responsibility
- Extract reusable logic into composables
- Avoid deep nesting (max 3 levels)
- Use meaningful variable and function names
- Comment only when logic is non-obvious

## Development Workflow

### Standard Feature Development

```
1. Create feature branch: `feat/feature-name`
2. Implement feature with tests
3. Run tests: `npm run test:run`
4. Build: `npm run build`
5. Commit: Auto-commit with conventional message
6. Push: Auto-push to GitHub
7. Merge to main (if approved by user)
8. Deploy: Use `/deploy` skill
```

### Quick Documentation Updates

```
1. For CLAUDE.md or README.md changes: Work directly on `main`
2. For docs/specs/ changes: Work directly on `main`
3. For code changes: ALWAYS use feature branch
```

## Custom Skills

Available skills are located in `.claude/skills/`:

- `/add` - Add new radio station
- `/deploy` - Deploy to GitHub Pages

Refer to individual `SKILL.md` files for detailed usage.

## Common Commands

```bash
# Development
npm run dev              # Start dev server (http://localhost:5173)
npm run build            # Build for production
npm run preview          # Preview production build

# Testing
npm run test             # Run tests in watch mode
npm run test:run         # Run tests once (for CI/CD)

# Deployment (via Claude skill)
/deploy                  # Deploy to GitHub Pages
```

## Automated Rules

### Pre-Commit Checks
1. Run `npm run test:run` - All tests must pass
2. Run `npm run build` - Build must succeed
3. No console errors or warnings

### Auto-Commit Triggers
- Feature implementation complete
- All tests passing
- Build successful
- User confirms implementation is ready

### Auto-Push Policy
- Only after user confirms commit content
- Ensures GitHub remote is always up-to-date
- Enables seamless collaboration

## Feature Specifications

For detailed feature specifications, see `docs/specs/`:

- **[Playback Logic](docs/specs/playback.md)** - HTTPS/HTTP handling, audio player
- **[Data Structure](docs/specs/data-structure.md)** - Radio data format, state management
- **[UI Design](docs/specs/ui-design.md)** - Mobile optimization, visual design system

Always refer to specs when implementing features to ensure consistency.
