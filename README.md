# Shortify Turborepo

## Using this repo

Enable Corepack:

```sh
corepack enable
```

Install dependencies:

```sh
yarn
```

Start project:

```sh
yarn dev
```

## What's inside?

This Turborepo includes the following packages and apps:

### Apps and Packages

- `api`: an [Express](https://expressjs.com/) server -> [Documentation](/apps/api/README.md)
- `web`: a [Vite](https://vitejs.dev/) single page app
- `@repo/eslint-config`: ESLint configurations used throughout the monorepo
- `@repo/typescript-config`: tsconfig.json's used throughout the monorepo

Each package and app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Jest](https://jestjs.io) test runner for all things JavaScript
- [Prettier](https://prettier.io) for code formatting
