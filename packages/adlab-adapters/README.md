# AdLab Adapters (`adlab-adapters`)

The `adlab-adapters` package provides pluggable connector interfaces between the AdLab campaign engine and external advertising ad networks / distribution channels.

---

## Supported Channels & Capabilities

| Channel / Service | Status | Capabilities |
|---|---|---|
| **TikTok Ads** | ✅ Supported | Official Business API SDK integration, campaign asset sync, creative formatting |
| **Meta / Facebook Ads** | ✅ Supported | Graph API v21.0 integration, dynamic creative asset specs, access token management |
| **Media File Pipeline** | ✅ Supported | Multipart upload streaming (`multer`, `form-data`), media validation via `Joi` |

---

## Directory Structure

```text
adlab-adapters/
├── src/
│   ├── index.js         # Public export barrel
│   ├── channels/        # Channel-specific client implementations
│   └── utils/           # Request handlers, schema validation, and crypto helpers
├── test/                # Unit and integration test suites
└── package.json
```

---

## Usage Example

```javascript
import { TikTokAdapter, MetaAdapter } from 'adlab-adapters';

// Initializing channel adapter
const metaClient = new MetaAdapter({
  graphApiBaseUrl: process.env.PUBLIC_FB_GRAPH_API_BASE_URL,
  accessToken: process.env.PUBLIC_FB_ACCESS_TOKEN,
});

// Syncing ad assets
await metaClient.uploadCreativeAsset({
  campaignId: 'cmp_12345',
  assetType: 'video',
  payload: assetStream,
});
```

---

## Scripts

- `pnpm run build`: Bundles the adapters with Webpack into ESM (`dist/main.esm.js`).
- `pnpm run coverage`: Executes Jest test suite and generates code coverage report.
- `pnpm run format`: Formats code according to Prettier standards.
