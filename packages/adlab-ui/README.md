# AdLab UI (`adlab-ui`)

The modern frontend dashboard for the **AdLab** platform. Built with React 18, Rsbuild, Redux Toolkit Query, and styled with modular Sass and Emotion.

---

## Features

- **Campaign Management Console**: Intuitive workflows for creating, scheduling, and orchestrating multi-channel ad campaigns.
- **Dynamic Creative Personalization**: Visual rule engine and combo builder enabling contextual ad variations (e.g., dayparting, weather, audience segment, geography).
- **Interactive Asset Library**: Creative folder navigation, high-resolution media previews, and multi-asset tagging.
- **Offline & Mock Development Support**: Powered by Redux Toolkit Query error fallbacks and Mock Service Worker (MSW) for offline testing without backend dependencies.
- **Enterprise-Ready Authentication**: Seamless Okta integration for OAuth2 / OpenID Connect authorization.

---

## Tech Stack

- **Framework**: [React 18](https://react.dev/)
- **Bundler**: [Rsbuild](https://rsbuild.dev/) (Rspack-based lightning-fast build tool)
- **State & Data Fetching**: [Redux Toolkit](https://redux-toolkit.js.org/) + RTK Query
- **Styling**: Emotion + Sass (`.scss`)
- **Testing**: [Jest](https://jestjs.io/) + [React Testing Library](https://testing-library.com/) + [Playwright](https://playwright.dev/)
- **Mocking**: [MSW](https://mswjs.io/) (Mock Service Worker)

---

## Getting Started

### Prerequisites

- Node.js >= 20.17.0
- pnpm >= 9.0.0

### Local Development

1. Setup environment variables:
   ```bash
   cp .env.sample .env
   ```
2. Start the development server:
   ```bash
   pnpm run dev
   ```
   The application will be accessible at: `http://localhost:3000/adlab`

### Development Modes

- **Local Mock Server Mode**:
  ```bash
  pnpm run dev:msw
  ```
- **Docker Development Mode**:
  ```bash
  pnpm run dev:docker
  ```
- **Production Preview**:
  ```bash
  pnpm run preview
  ```

---

## Quality & Testing Scripts

```bash
# Code & Style Linting
pnpm run lint          # Run ESLint, Stylelint, Prettier checks
pnpm run lint:fix      # Automatically fix linting and style errors

# Unit Testing
pnpm run test          # Execute Jest test suite
pnpm run test:update   # Update Jest snapshots
pnpm run coverage:show # Display LCOV coverage summary

# End-to-End Testing
pnpm run e2e           # Run Playwright E2E tests
pnpm run e2e:msw       # Run Playwright E2E tests against MSW mocks
```
