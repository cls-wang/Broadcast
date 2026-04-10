---
name: electron-builder-win-fix
description: Fix electron-builder Windows packaging errors (winCodeSign symlink, invalid icon, asar entry file).
model: sonnet
allowed-tools: Bash, Read, Write, Edit
---

# electron-builder-win-fix

Windows 上執行 `electron-builder --win` 時常見的三個打包錯誤，以及一鍵修補腳本。

## 觸發條件

使用者執行 `npm run package` 或 `electron-builder --win` 出現下列錯誤之一：

| 錯誤訊息 | 問題 |
|----------|------|
| `ERROR: Cannot create symbolic link … darwin/10.12/lib/libcrypto.dylib` | winCodeSign 符號連結 |
| `Reserved header is not 0 or image type is not icon` | icon.ico 非合法格式 |
| `Application entry file "out/main/index.js" in app.asar does not exist` | files 設定不正確 |

## 使用方式

```bash
# 一鍵修補 node_modules + icon
node <shared-config-path>/skills/electron/electron-builder-win-fix/apply-patches.js

# 或掛 npm hook（推薦）
# package.json → "prepackage": "node <path>/apply-patches.js"
```

---

## 問題 1：winCodeSign 符號連結錯誤

**根因**：`winCodeSign-*.7z` 包含 macOS 符號連結（`darwin/10.12/lib/libcrypto.dylib`、`libssl.dylib`）。Windows 非管理員帳號無法建立符號連結 → 7za.exe exit code 2 → app-builder.exe 失敗。

**影響版本**：electron-builder 25.x（winCodeSign-2.6.0），Windows 10/11 非管理員

**修復**（apply-patches.js 自動處理）：

### Step 1 — 建立 7za wrapper

在 `node_modules/7zip-bin/win/x64/7za-wrapper.cmd` 寫入：

```bat
@echo off
"%~dp07za.exe" %*
IF %ERRORLEVEL% EQU 2 ( EXIT /B 0 )
EXIT /B %ERRORLEVEL%
```

`%~dp0` 指向 wrapper 所在目錄，自動解析 7za.exe 位置。exit code 2 代表「部分檔案失敗」（macOS 符號連結），Windows 工具仍正確解壓。

### Step 2 — 修補 `builder-util/out/util.js`

在 `executeAppBuilder()` 中，將 `SZA_PATH` 替換為 wrapper：

```javascript
let szaPath = await (0, _7za_1.getPath7za)();
if (process.platform === 'win32') {
    const wrapperPath = path.join(path.dirname(szaPath), '7za-wrapper.cmd');
    if (require('fs').existsSync(wrapperPath)) {
        szaPath = wrapperPath;
    }
}
const env = { ...process.env, SZA_PATH: szaPath, ... };
```

**為什麼只改 `executeAppBuilder` 不改 `getPath7za()`？**

| 呼叫端 | 執行方式 | .cmd 支援 |
|--------|----------|-----------|
| `executeAppBuilder` → Go binary | Windows CreateProcess | ✅ |
| `archive.js` → Node.js `exec()` | `execFile` | ❌ 拋 `EINVAL` |

只在 Go binary 路徑上套 wrapper，Node.js 直接呼叫仍用原始 `7za.exe`。

---

## 問題 2：icon.ico 非合法 ICO 格式

**根因**：PNG 直接更名為 `.ico`（magic bytes = `89 50 4E 47`），rcedit 無法辨識。

**修復**：`fix-icon.js` 將 PNG 包裝進 ICO 容器（ICONDIR + ICONDIRENTRY + PNG payload），Windows Vista+ 原生支援 PNG-in-ICO。

```bash
node <path>/fix-icon.js                          # default: buildResources/icon.ico
node <path>/fix-icon.js path/to/icon.ico         # explicit path
```

---

## 問題 3：asar 找不到 entry file

**根因**：`electron-builder.yml` 的 `files` 用顯式包含模式（`out/**/*`），glob 解析不一致。

**修復**：改用排除模式（electron-vite 官方建議），base 為 `**/*`：

```yaml
files:
  - '!src/**'
  - '!docs/**'
  - '!**/.vscode/**'
  - '!**/__tests__/**'
  - '!**/*.{spec,test}.{ts,js}'
  - '!electron.vite.config.{js,ts,mjs,cjs}'
  - '!{tsconfig*.json}'
  - '!{.eslintignore,.eslintrc*,.prettierrc*}'
  - '!{.gitignore,.gitattributes,.editorconfig}'
  - '!*.md'
  - '!buildResources/**'
  - '!release/**'
```

> 此問題無法自動修補（每個專案排除的目錄不同），需手動調整 `electron-builder.yml`。

---

## 注意事項

- `node_modules` 修補會在 `npm install` 後遺失 → 建議用 `prepackage` hook 自動重新修補
- 修補不影響開發或測試流程，僅在打包時生效
- 若未來 electron-builder 修復 winCodeSign 問題，可移除此 skill
