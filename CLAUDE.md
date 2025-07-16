# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `bun install` - Install dependencies
- `bun run dev` - Start development server on port 3000
- `bun run build` - Build for production (runs vite build && tsc)
- `bun run test` - Run tests using Vitest

### Code Quality
- `bun run lint` - Run Biome linter
- `bun run format` - Format code with Biome
- `bun run check` - Run both linting and formatting checks
- `bun run knip` - Check for unused dependencies
- `bun run knip:fix` - Fix unused dependencies

### Other
- `bun run serve` - Preview production build
- `bun run addcn` - Add shadcn/ui components

## Architecture Overview

### State Management
This project uses **Jotai atoms** for state management, located in `src/lib/stores/`:
- `webcam-atom.ts` - Webcam device selection and video state
- `replay-atom.ts` - Video replay management
- `available-webcams-atom.ts` - Available webcam devices
- `permission-atom.ts` - Camera permission state

Note: There may be legacy Zustand stores in the codebase that should be migrated to Jotai atoms.

### Routing
- **File-based routing** with TanStack Router
- Routes defined in `src/routes/` directory
- Router configuration in `src/main.tsx` with auto-generated route tree (`routeTree.gen.ts`)
- Context provides QueryClient for data fetching integration

### Key Features
- **Webcam Management**: Multi-panel webcam selection and video streaming
- **Replay System**: Video replay functionality with player controls
- **Permissions**: Camera permission handling and state management
- **Responsive UI**: Tailwind CSS with custom glass morphism effects

### Component Structure
- `src/components/` - Main components including webcam panels, replay players, UI elements
- `src/components/ui/` - Reusable UI components (shadcn/ui based)
- Custom hooks in `src/lib/hooks/` for webcam access, permissions, and persistence

### Data Flow
- **TanStack Query** for server state and caching
- **LocalStorage persistence** for user preferences (camera selections, settings)
- **Media devices API** integration for webcam access
- **Custom hooks** abstract complex logic (permissions, device enumeration)

## Important Technical Notes

### Biome Configuration
- Uses **tab indentation** and **double quotes**
- Ignores `src/routeTree.gen.ts` (auto-generated)
- Excludes `src/components/ui/*` from linting (third-party components)

### Build Process
- **Vite** + **TypeScript** compilation
- **TanStack Router plugin** for route generation
- **Jotai babel plugins** for debug labels and React refresh
- **HTTPS support** via mkcert plugin for local development

### Testing
- **Vitest** for unit testing
- **jsdom** environment for DOM testing
- Run single test: `bun run test -- path/to/test.spec.ts`

### State Management Notes
- **Use Jotai atoms** for all state management
- **Migrate legacy Zustand stores** to Jotai atoms when encountered
- **LocalStorage persistence** should be handled through Jotai atoms with persistence