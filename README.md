# Web Radio Player (Vue 3)

> A modern web radio player showcasing AI-powered development workflow with Claude Code.

This project demonstrates how to build a production-ready web application with intelligent stream detection, mobile-first design, and fully automated development processes powered by Claude Code.

## What This Looks Like in Practice

**Smart Development Workflow?** We have centralized project rules in [CLAUDE.md](CLAUDE.md) that ensure every feature follows the same patterns - from automatic branch creation to test-driven development and deployment.

**Automated Testing & Building?** Every code change triggers automatic testing and building. The `/deploy` skill handles the entire deployment pipeline - from testing to GitHub Pages publishing.

**Intelligent Stream Handling?** The app automatically detects HTTPS/HTTP streams and chooses the optimal playback strategy, with elegant user warnings for external links.

**Mobile-Optimized Experience?** Touch-friendly interface specifically designed for Chrome and Safari on mobile devices, with large buttons and responsive layouts.

The entire development process - from feature implementation to deployment - is automated and consistent.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Agentic Workflow](#agentic-workflow)
  - [CLAUDE.md Specification](#claudemd-specification)
  - [Automated Git Workflow](#automated-git-workflow)
  - [Custom Skills](#custom-skills)
  - [One-Click Deployment](#one-click-deployment)
- [Project Structure](#project-structure)
- [Development Commands](#development-commands)
- [License](#license)

---

## Features

- **Smart Stream Detection**: Automatically detects HTTPS streams for in-app playback, with graceful fallback for HTTP streams via external browser
- **Mobile-First Design**: Touch-friendly interface optimized for Chrome and Safari on mobile devices
- **Beautiful UI**: Gradient backgrounds, smooth animations, and responsive layout
- **External Link Warning**: Elegant modal dialog warns users before opening non-encrypted (HTTP) streams
- **Test-Driven Development**: Vitest integration with automatic test running
- **Type-Safe**: Vue 3 Composition API with TypeScript support

## Tech Stack

- **Vue 3** - Composition API with `<script setup>`
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Vitest** - Unit testing framework
- **GitHub Pages** - Deployment platform

## Getting Started

```bash
# Install dependencies
npm install

# Start development server (with hot reload)
npm run dev

# Run tests (watch mode)
npm run test

# Run tests (single run)
npm run test:run

# Build for production
npm run build

# Preview production build
npm run preview
```

## Agentic Workflow

This project leverages an **AI-powered development workflow** with Claude Code. Once configured, Claude operates like a senior developer on your team, following your conventions and automating repetitive tasks.

### CLAUDE.md Specification

[CLAUDE.md](CLAUDE.md) is Claude's persistent memory that loads automatically at session start.

**What it includes:**
- Project architecture and tech stack
- Playback logic and data formats
- Development commands and workflow
- Git conventions and branching strategy
- Critical rules and constraints

**Benefits:**
- Consistent code patterns across all features
- Automatic adherence to project conventions
- No need to repeat instructions in every session

### Automated Git Workflow

Claude automatically manages the entire Git workflow:

1. **Branch Convention**: All code changes (except docs) happen on feature branches
   - Format: `<type>/<short-description>` (e.g., `feat/add-volume-control`)
   - Types: `feat`, `fix`, `refactor`, `style`

2. **Auto Commit**: After passing tests, Claude automatically commits with conventional commit messages
   - Format: `<type>: <description>` (e.g., `feat: 新增音量控制功能`)
   - Co-authored with Claude for tracking

3. **Auto Push**: Upon user confirmation, changes are pushed to GitHub automatically
   - Ensures remote repository is always up-to-date
   - Enables seamless team collaboration

4. **Merge & Deploy**: After feature completion, Claude prompts to merge to `main` and deploy

### Custom Skills

The `/add` and `/deploy` skills provide one-command workflows:

**`/add` - Add New Radio Station**
- Interactive prompt for station details
- Automatic data validation
- Updates station list with proper formatting

**`/deploy` - One-Click Deployment**
- Runs full test suite
- Builds production bundle
- Deploys to GitHub Pages
- Verifies deployment success

### One-Click Deployment

Built-in deployment automation:
- Test verification before deployment
- Automatic build optimization
- GitHub Pages publishing
- Production files served from `dist/` directory
- Custom domain support (configure in `vite.config.js`)

## Project Structure

```
Broadcast/
├── CLAUDE.md                  # Claude's project memory
├── README.md                  # This file
├── .claude/                   # Claude Code configuration
│   └── skills/
│       ├── add/               # Add radio station skill
│       └── deploy/            # Deployment skill
├── src/
│   ├── App.vue                # Main application component
│   ├── main.js                # Application entry point
│   ├── index.css              # Global styles
│   └── assets/                # Static assets
├── tests/
│   └── App.test.js            # Component tests
├── public/                    # Static public files
├── dist/                      # Production build output
├── vite.config.js             # Vite configuration
├── vitest.config.js           # Vitest configuration
└── package.json               # Dependencies and scripts
```

## Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once (CI/CD) |
| `/add` | Add new radio station (Claude skill) |
| `/deploy` | Deploy to GitHub Pages (Claude skill) |

## License

MIT
