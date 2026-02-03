# Web Radio Project (Vue 3)

A modern web radio player built with Vue 3 + Vite, featuring automatic HTTPS/HTTP stream detection and mobile-optimized design.

## Features

- **Smart Stream Detection**: Automatically detects HTTPS streams for in-app playback, with graceful fallback for HTTP streams via external browser
- **Mobile-First Design**: Touch-friendly interface optimized for Chrome and Safari on mobile devices
- **Beautiful UI**: Gradient backgrounds, smooth animations, and responsive layout
- **External Link Warning**: Elegant modal dialog warns users before opening non-encrypted (HTTP) streams

## Tech Stack

- **Vue 3** - Composition API
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Agentic Workflow

This project leverages an AI-powered development workflow with the following features:

### CLAUDE.md Specification
- Centralized project rules and conventions
- Defines playback logic, data formats, and development commands
- Ensures consistent AI-assisted development

### Automated Git Workflow
- **Branch Convention**: All code changes are made on feature branches (`feat/xxx`, `fix/xxx`)
- **Auto Commit**: Automatic commits with conventional commit messages after passing tests
- **Auto Push**: Seamless sync to GitHub remote repository upon user confirmation

### One-Click Deployment
- Built-in `/deploy` skill for GitHub Pages deployment
- Automated build and publish process
- Production files served from `dist/` directory

## License

MIT
