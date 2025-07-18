# Project Structure

## Root Level
- `src/` - Main application source code
- `public/` - Static assets (images, icons, manifest)
- `incidents/` - Documentation for issues and resolutions
- `.kiro/` - Kiro AI assistant configuration and steering
- `.tanstack/tmp/` - TanStack Router generated files (auto-managed)

## Source Organization (`src/`)

### Core Application
- `main.tsx` - Application entry point with providers
- `styles.css` - Global styles and Tailwind imports
- `routeTree.gen.ts` - Auto-generated route tree (don't edit)

### Routing (`src/routes/`)
- `__root.tsx` - Root layout with DevTools
- `index.tsx` - Home page route
- `swing.tsx` - Main application route
- File-based routing: filename = route path

### Components (`src/components/`)
- `ui/` - Reusable UI primitives (shadcn/ui components)
- Component files use kebab-case naming
- Each component is self-contained with minimal dependencies

### State Management (`src/lib/stores/`)
- `atom-store.ts` - Jotai store instance
- `*-atom.ts` - Individual atomic state definitions
- Use atomFamily for parameterized atoms
- Use atomWithStorage for persistent state

### Utilities (`src/lib/`)
- `hooks/` - Custom React hooks
- `utils.ts` - Shared utility functions
- `webcams.ts` - Webcam-specific utilities

### Integrations (`src/integrations/`)
- `dev-tools.tsx` - Development tools setup
- `tanstack-query/` - TanStack Query configuration

## Naming Conventions
- **Files**: kebab-case (e.g., `webcam-dropdown.tsx`)
- **Components**: PascalCase (e.g., `WebcamDropdown`)
- **Atoms**: camelCase with descriptive suffixes (e.g., `selectedWebcamAtom`)
- **Hooks**: camelCase starting with "use" (e.g., `useReplays`)

## Import Patterns
- Use `@/` alias for src imports
- Group imports: external libraries first, then internal modules
- Prefer named exports over default exports for utilities

## File Responsibilities
- **Routes**: Handle routing, data loading, and page-level state
- **Components**: Pure UI components with minimal business logic
- **Stores**: Global state management with Jotai atoms
- **Hooks**: Reusable stateful logic
- **Utils**: Pure functions and shared utilities