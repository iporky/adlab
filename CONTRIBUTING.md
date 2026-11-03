# Contributing to AdLab

Thank you for contributing to AdLab! This document provides guidelines for contributing to the repository.

---

## 🛠️ Development Setup

1. **Prerequisites**:
   - Node.js >= 20.17.0
   - pnpm >= 9.0.0
   - Docker & Docker Compose
2. **Install dependencies**:
   ```bash
   pnpm install
   ```
3. **Run local services**:
   ```bash
   pnpm run setup
   ```

---

## 🌿 Branching Strategy

- `main`: Production-ready, stable codebase.
- Feature branches: `feature/<feature-name>` or `feat/<ticket-id>`
- Bug fixes: `fix/<issue-name>` or `bugfix/<ticket-id>`
- Refactoring / Tech Debt: `refactor/<topic>` or `chore/<topic>`

---

## 📝 Commit Conventions

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` A new user-facing feature
- `fix:` A bug fix
- `docs:` Documentation updates
- `style:` Formatting changes that do not affect the meaning of code
- `refactor:` Code change that neither fixes a bug nor adds a feature
- `test:` Adding or updating tests
- `chore:` Maintenance tasks, dependency bumps, or build changes

---

## 🧪 Code Quality Standards

Before submitting a Pull Request, ensure:
1. All unit tests pass:
   ```bash
   pnpm run test
   ```
2. Code is formatted and passes linting:
   ```bash
   pnpm run format
   ```
3. Documentation is updated for any new feature or API change.
