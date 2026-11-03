# AdLab Engineering Roadmap & Pending Tasks

This document outlines the engineering priorities, pending technical debts, planned architectural enhancements, and future milestones for the **AdLab** platform.

---

## 🎯 High-Priority Pending Tasks & Tech Debt

### Workspace & Monorepo Infrastructure
- [ ] **Linting & Formatting Consolidation**: Hoist common ESLint 9+ and Prettier configurations to the workspace root for uniform code formatting across all packages.
- [ ] **Git Hook Automation**: Configure Husky and `lint-staged` pre-commit hooks to automatically execute linters and unit tests before every commit.
- [ ] **Secrets & Configuration Management**: Implement HashiCorp Vault / AWS Secrets Manager integration for runtime secret injection rather than local `.env` files.
- [ ] **GitHub Actions CI/CD**: Build multi-stage PR verification workflow (linting, test coverage reporting, Docker image building).

### `adlab-ui` Frontend
- [ ] **Dependency Pruning**:
  - Remove `@fluentui/react-components` (superceded by custom design tokens).
  - Clean up legacy `exceljs` and `papaparse` imports from `package.json` in favor of streamlined browser-native CSV handling.
- [ ] **Combo Builder Enhancements**:
  - Add drag-and-drop rule reordering in the Personalization visualizer.
  - Implement bulk editing and matrix preview validation before campaign submission.
- [ ] **Offline Mock Mode**: Expand MSW request handlers to cover 100% of campaign life-cycle states.
- [ ] **Playwright Test Suite**: Increase E2E test coverage for template selection, combo builder, and multi-channel asset preview workflows.

### `adlab-service` Backend
- [ ] **Asynchronous Transcoding Queue**:
  - Introduce Redis + BullMQ worker queue for offloading heavy Fluent-FFmpeg video encoding tasks from the primary Express thread.
- [ ] **Rate Limiting & Resilience**:
  - Implement Redis-backed token bucket rate limiting for inbound API endpoints.
  - Add circuit breaker policies around external channel API calls.
- [ ] **MongoDB Index Optimization**:
  - Benchmark campaign collection compound indexes for high-throughput rule queries.

### `adlab-adapters` Channel Connectors
- [ ] **Google Ads & DV360 Adapter**: Implement Display & Video 360 connector for programmatic buying.
- [ ] **Pinterest & Snapchat Creative Sync**: Implement direct API sync for vertical pin/story formats.
- [ ] **Retry Policies & Error Normalization**: Standardize error schemas across TikTok and Meta Graph APIs.

---

## 🚀 Future Milestones

### Milestone 1: Multi-Channel Parity (Q1)
- Unified campaign launch button distributing simultaneously to Meta, TikTok, and Snapchat.
- Real-time token refresh and webhook callbacks for campaign status updates.

### Milestone 2: AI Creative Generation (Q2)
- Generative AI prompt interface to synthesize ad copy variations tailored to demographic segments.
- Smart auto-cropping and aspect ratio adaptation (1:1, 9:16, 16:9) powered by Sharp and computer vision.

### Milestone 3: Analytics & Closed-Loop Attribution (Q3)
- Aggregated multi-channel performance dashboard (impressions, CTR, CPA, ROAS).
- Dynamic rule optimization based on live conversion feedback.

---

## 📋 Task Tracking & Contribution

To claim a task or submit a proposal:
1. Open an issue on GitHub with the `[task]` or `[tech-debt]` tag.
2. Link your Pull Request to the corresponding task checklist item.
3. Ensure all automated CI checks and unit tests pass before requesting review.
