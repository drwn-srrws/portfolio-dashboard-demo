# Portfolio Cloud Frontend

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.0.5-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?logo=tailwind-css&logoColor=white)
![React Query](https://img.shields.io/badge/React_Query-5.51.15-FF4154?logo=react-query&logoColor=white)

## Overview

This is the frontend for Portfolio, a comprehensive financial platform to manage Hedge Funds. Built with modern web technologies:

- **Vite** for blazing-fast builds and development
- **React** for component-based UI development
- **TypeScript** for type safety and improved developer experience
- **Tailwind CSS** for utility-first styling
- **React Query** for server state management
- **Orval** for type-safe API client generation

## Getting Started

### Prerequisites

- Node.js 22.10.2 or higher
- npm 10.1.0 or higher

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server after starting the NestJS backend using the root README:

```bash
npm run dev
```

## Available Scripts

| Command                   | Description                                  |
| ------------------------- | -------------------------------------------- |
| `npm run dev`             | Start the development server with hot reload |
| `npm run build`           | Create production build in `dist/`           |
| `npm run preview`         | Preview the production build locally         |
| `npm run lint:fix`        | Fix linting issues automatically             |
| `npm run format:check`    | Check code formatting                        |
| `npm run format:write`    | Format code using Prettier                   |
| `npm run clean`           | Remove build artifacts and dependencies      |
| `npm run type-check`      | Run TypeScript type checking                 |
| `npm run generate-client` | Generate API client from OpenAPI schema      |

## Environment Configuration

Vite proxies API requests to the local NestJS backend by default. Optional environment variables:

| Variable              | Description     | Example               |
| --------------------- | --------------- | --------------------- |
| `VITE_PUBLIC_API_URL` | Backend API URL | `https://example.com` |

## API Client Generation

We use Orval to generate type-safe API clients from OpenAPI schemas. This generates:

- React Query hooks with proper typing
- Request functions
- Query keys for cache management
- TypeScript interfaces

To regenerate the client from the checked-in platform schema:

```bash
npm run generate-client
```

Generated code is placed in `src/api/` and includes:

- Hooks (e.g., `useGetFrontendConfig`)
- Request functions (e.g., `getFrontendConfig`)
- Query keys (e.g., `getFrontendConfigQueryKey`)
- TypeScript types (e.g., `FrontendConfigResponse`)

## Project Structure

### Module-Based Architecture

We follow a feature-based architecture where each business domain is organized as a module. This approach:

- Improves code organization and maintainability
- Enables parallel development across teams
- Makes features more portable and reusable
- Simplifies testing and documentation

### Directory Structure

```
src/
├── @api/             # Generated API client
├── @components/      # Shared UI components
│   └── ui/           # Basic UI primitives
├── @hocs/            # Higher-order components
├── @hooks/           # Shared hooks
├── @modules/         # Feature modules
│   ├── auth/         # Authentication feature
│   ├── dashboard/    # Dashboard feature
│   └── analytics/    # Analytics feature
├── @providers/       # Context providers
├── @store/           # Global state management
├── @typings/         # Global TypeScript types
└── @utils/           # Shared utilities
```

### Component Organization

Each component follows this structure:

```
ComponentName/
├── index.tsx                 # Main component
├── ComponentName.test.tsx    # Tests
├── ComponentName.stories.tsx # Storybook stories
├── ComponentName.types.ts    # TypeScript types
└── ComponentName.helpers.ts  # Helper functions
```

### Component Composition

**Compound Components** is a powerful pattern for building complex components from simpler ones. For example, to create new widget:

```tsx
export const PortfolioWidget = () => (
  <Widget>
    <WidgetHeader>
      <WidgetTitle>Portfolio</WidgetTitle>
      <WidgetActions>
        <WidgetMaximizeButton />
      </WidgetActions>
    </WidgetHeader>
    <WidgetBody>
      <PortfolioTable />
    </WidgetBody>
  </Widget>
);
```

For more information, see [React Hooks: Compound Components](https://kentcdodds.com/blog/compound-components-with-react-hooks).
