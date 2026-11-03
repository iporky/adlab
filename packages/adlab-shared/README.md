# AdLab Shared (`adlab-shared`)

The `adlab-shared` package serves as the single source of truth for cross-package data contracts, validation schemas, utility functions, and mock fixtures used by both `adlab-ui` and `adlab-service`.

---

## Contents

- **`src/schemas`**: Joi validation schemas defining canonical data structures for campaigns, ad groups, targeting parameters, creative mappings, and platform specifications (such as Snapchat, Meta, and TikTok ad definitions).
- **`src/mocks`**: Centralized offline development fixtures (mock templates, folder hierarchies, role permissions, and asset catalogs).
- **`src/utilities`**: Cross-tier helper utilities including locale translation resolution and schema formatting.

---

## Usage

```javascript
import { snapchatSchemas, localeUtils } from 'adlab-shared';

// Validate campaign payload
const { error, value } = snapchatSchemas.campaignSchema.validate(incomingPayload);
if (error) {
  throw new Error(`Validation failed: ${error.message}`);
}
```

---

## Scripts

- `pnpm run build`: Bundles shared modules using Webpack into `dist/main.esm.js`.
- `pnpm run format`: Formats code using Prettier.
