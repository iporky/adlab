# AdLab Service (`adlab-service`)

The core Node.js / Express microservice powering the **AdLab** platform. Handles campaign persistence, asset processing pipelines, database migrations, and channel distribution.

---

## Capabilities

- **RESTful Campaign Orchestration API**: Complete lifecycle management for ad campaigns, ad groups, and creative variants.
- **Media Processing Engine**: High-performance image transformation via [Sharp](https://sharp.pixelplumbing.com/) and video transcoding via [Fluent-FFmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg).
- **MongoDB Persistence & Migrations**: Managed schema models with Mongoose and version-controlled database migrations via `migrate-mongo`.
- **Pluggable Channel Adapters**: Tight integration with `adlab-adapters` for push-to-network ad publishing (Meta, TikTok).
- **Enterprise Security**: Okta JWT token verification, CORS protection, request correlators, and structured log appenders.

---

## Tech Stack

- **Runtime**: Node.js >= 20.17.0 (ESM native)
- **Framework**: Express.js
- **Database**: MongoDB 8.0 (Mongoose ODM)
- **Media Processing**: Sharp, Fluent-FFmpeg
- **Testing**: Jest, Supertest, MongoMemoryServer

---

## Getting Started

### Prerequisites

- Node.js >= 20.17.0
- Docker & Docker Compose (or local MongoDB running on `mongodb://localhost:27017`)

### Running Locally

1. Start MongoDB via Docker Compose from root:
   ```bash
   docker compose up -d mongo
   ```
2. Run database onboard migrations:
   ```bash
   pnpm run onboard:db
   ```
3. Start the service:
   ```bash
   pnpm run start
   # or with live reload:
   pnpm run debug
   ```
   Service API runs at: `http://localhost:8080`

---

## Database Migrations

- Apply pending migrations:
  ```bash
  pnpm run onboard:db
  ```
- Rollback last migration:
  ```bash
  pnpm run deboard:db
  ```

---

## Testing & Linting

```bash
# Run unit & integration tests
pnpm run test

# Run test coverage
pnpm run coverage

# Code formatting & linting
pnpm run format
```
