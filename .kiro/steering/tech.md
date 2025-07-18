# Tech Stack

## Core Framework
- **React 19** with TypeScript
- **Vite** as build tool and dev server
- **Bun** as package manager and runtime

## Key Libraries
- **TanStack Router** - File-based routing with code splitting
- **TanStack Query** - Server state management and data fetching
- **Jotai** - Atomic state management for client state
- **Tailwind CSS v4** - Utility-first styling
- **Radix UI** - Headless component primitives
- **Phosphor Icons** - Icon library (preferred over Lucide)
- **Media Chrome** - Media player components
- **React Virtual** - Virtualized lists for performance

## Development Tools
- **Biome** - Linting, formatting, and code quality
- **Vitest** - Testing framework
- **React Scan** - Performance monitoring
- **Knip** - Unused dependency detection

## Common Commands

### Development
```bash
bun install          # Install dependencies
bun run dev          # Start dev server on port 3000
bun run start        # Alternative dev server command
```

### Building & Testing
```bash
bun run build        # Build for production (Vite + TypeScript)
bun run serve        # Preview production build
bun run test         # Run tests with Vitest
```

### Code Quality
```bash
bun run lint         # Lint code with Biome
bun run format       # Format code with Biome
bun run check        # Run both linting and formatting
bun run knip         # Check for unused dependencies
```

### UI Components
```bash
bun run addcn        # Add shadcn/ui components
```

## Configuration Notes
- Uses tab indentation (configured in Biome)
- Double quotes for JavaScript/TypeScript
- Path aliases: `@/*` maps to `./src/*`
- HTTPS enabled in development via mkcert