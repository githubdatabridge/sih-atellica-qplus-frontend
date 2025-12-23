# SIH POC Insight

## Project Overview

SIH POC Insight is a front-end application designed to provide insights into compliance, audit, and reporting. The application is tailored to integrate seamlessly with Qlik analytics, offering a dynamic and interactive user experience with a focus on the Siemens light theme.

## Getting Started

To get started with the SIH POC Insight application, you need to set up your environment and initialize the app with specific configurations. This setup allows the application to simulate a real production environment, receiving initial parameters from another system.

### Environment Setup

Ensure your environment is correctly set up with the necessary dependencies and settings. Follow the steps below to configure your environment:

1. Clone the repository to your local machine.
2. Install the required dependencies using your package manager (e.g., `npm install` or `yarn`).
3. Set up the environment variables as needed.

### Local Configuration: `config.development.json`

The local configuration to spinup the application on localhost is defined in the public folder where a config.development.json file can be created and all the necessary env variables defined.

### Prod Configuration: `config.json`

The PROD configuration is dynamically created at runtime during the installation of Q^plus with all the required environment variables

### Startup Mock Param: `startup.json`

The application initialization is driven by a configuration file named `startup.json`. This file contains mock parameters, like Qlik Virtual Proxy, Qlik App ids for compliance, audit and reporting, that simulate receiving query parameters from another system to initialize the app. The structure of the `startup.json` file is as follows:

```json
{
    "vp": "localhost",
    "theme": "db-theme-siemens-light",
    "pages": [
        {
            "page": "compliance",
            "qlikAppId": "4e2d4117-f850-496b-8eb4-df1ff570c961"
        },
        {
            "page": "audit",
            "qlikAppId": "96d1506e-4b0e-424b-8b8c-0a2d42c97e69"
        },
        {
            "page": "reporting",
            "qlikAppId": "4e2d4117-f850-496b-8eb4-df1ff570c961"
        }
    ],
    "default": "compliance"
}
```

## Running the Application

To run the application, follow these steps:

1. Ensure the `startup.json` file is placed in the root directory of the project.
2. Start the application using the start script defined in your `package.json` (e.g., `npm start` or `yarn start`).
3. The application will initialize with the configuration specified in `startup.json`, setting up the initial view and theme based on the provided parameters.
4. To automatically login and be re-direct to the app input the following URL in the browser: https://qs-internal.databridge.ch:8084/?uid=patric.amatulli&userDirectory=VM-I-QS-DEV&returnTo=https://localhost:7005

## Project Architecture

### Internal Libraries (`src/libs/`)

The project includes internal libraries that were migrated from an external monorepo. These libraries are now part of the frontend source code and provide reusable components, hooks, services, and utilities.

#### Library Structure

```
src/libs/
├── collaboration-models/     # Data models for collaboration features
├── collaboration-providers/  # React context providers for collaboration
├── collaboration-services/   # API services for collaboration
├── collaboration-ui/         # UI components for comments, reactions
├── common-hooks/            # Reusable React hooks
├── common-models/           # Shared data models
├── common-providers/        # Common React context providers
├── common-ui/               # Shared UI components
├── common-utils/            # Utility functions
├── core-hooks/              # Core application hooks
├── core-models/             # Core data models
├── core-providers/          # Core context providers
├── core-services/           # Core API services
├── data-grid-ui/            # Data grid components
├── gridwall-ui/             # Grid wall layout components
├── notification-ui/         # Notification components
├── qlik-base-ui/            # Base Qlik UI components
├── qlik-bookmark-ui/        # Qlik bookmark components
├── qlik-capability-hooks/   # Qlik capability API hooks
├── qlik-enigma-hooks/       # Qlik Enigma.js hooks
├── qlik-integration-ui/     # Qlik integration UI
├── qlik-models/             # Qlik data models
├── qlik-pinwall-ui/         # Qlik pinwall components
├── qlik-providers/          # Qlik context providers
├── qlik-reporting-ui/       # Reporting UI components
├── qlik-selection-ui/       # Selection bar components
├── qlik-services/           # Qlik API services
├── qplus/                   # Main Q+ library (public API)
├── qplus-providers/         # Q+ context providers
├── qplus-types/             # Q+ TypeScript types
└── translations/            # i18n translations
```

#### Import Aliases

The project uses TypeScript path aliases for clean imports:

| Alias | Path | Usage |
|-------|------|-------|
| `@databridge/qplus` | `src/libs/qplus/src` | Main public API for app code |
| `@databridge/qplus-types` | `src/libs/qplus-types/src` | TypeScript types for app code |
| `@libs/*` | `src/libs/*/src` | Internal lib-to-lib imports |

**Example usage:**

```typescript
// In app code (src/app/*) - use @databridge/qplus
import { useQplusBootstrapContext, QplusNotificationCenter } from '@databridge/qplus'

// In libs (src/libs/*) - use @libs/*
import { useAuthContext } from '@libs/common-providers'
import { useQlikApp } from '@libs/qlik-providers'
```

## Code Style Guidelines

### Import Order

Imports must follow this order, with blank lines between each group:

1. **React** - React core imports
2. **React ecosystem** - react-router-dom, react-use, react-* packages
3. **MUI** - @mui/material, @mui/icons-material, @mui/lab
4. **External packages** - Third-party libraries (axios, lodash-es, uuid, etc.)
5. **Internal libs** - @libs/*, @databridge/*
6. **Relative imports** - Local files (./components, ../utils)

**Example:**

```typescript
import React, { FC, useState, useCallback } from 'react'

import { useNavigate } from 'react-router-dom'
import { useMount, useUnmount } from 'react-use'

import { Box, Typography, useTheme } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

import { makeStyles } from 'tss-react/mui'
import { v4 as uuidv4 } from 'uuid'

import { useAuthContext } from '@libs/common-providers'
import { useQlikApp } from '@libs/qlik-providers'

import { MyComponent } from './components/MyComponent'
import { helperFunction } from '../utils/helpers'
```

### Linting Rules

The project uses ESLint with the following configuration:

- **Scope**: Linting is applied only to `src/app/**/*.{ts,tsx}` (not the internal libs)
- **Config**: `.eslintrc.js` in the project root

**Key rules enforced:**
- No unused variables (warnings for variables prefixed with `_`)
- Consistent code formatting
- React hooks rules (exhaustive deps, rules of hooks)

**Available scripts:**

```bash
yarn lint        # Run ESLint on app code
yarn lint:fix    # Auto-fix ESLint issues
yarn typecheck   # Run TypeScript type checking
```

### TypeScript Guidelines

- **Strict mode**: TypeScript strict checks are enabled
- **No implicit any**: Avoid using `any` type where possible
- **Optional parameters**: Use `param = defaultValue` instead of `param? = defaultValue` (TypeScript 5 requirement)

**Example:**

```typescript
// Correct
function myFunction(value = false) { ... }

// Incorrect (TypeScript 5 error)
function myFunction(value? = false) { ... }
```

## Build & Bundle Optimization

### Code Splitting

The build uses Vite with manual chunks for optimal code splitting:

| Chunk | Contents |
|-------|----------|
| `vendor-react` | react, react-dom, react-router-dom |
| `vendor-mui` | @mui/material, @mui/icons-material, @mui/lab |
| `vendor-qlik` | enigma.js |
| `vendor-utils` | lodash-es, axios, dayjs, date-fns, moment |
| `vendor-draft` | draft-js, @draft-js-plugins/* (lazy-loaded) |

### Lazy Loading

Heavy components (Draft.js for comments/reactions) are lazy-loaded to reduce initial bundle size:

```typescript
// Lazy load collaboration-ui components to defer Draft.js loading
const CommentButton = lazy(() =>
  import('@libs/collaboration-ui').then(m => ({ default: m.CommentButton }))
)
```

This reduces the initial bundle by ~232KB gzipped.

## Available Scripts

| Script | Description |
|--------|-------------|
| `yarn start` | Start development server (port 7005) |
| `yarn build` | Build for production |
| `yarn typecheck` | Run TypeScript type checking |
| `yarn lint` | Run ESLint on app code |
| `yarn lint:fix` | Auto-fix ESLint issues |
