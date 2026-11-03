import { TokenConfigModel } from '../../dal/schemas/tokenConfig.js';

const accessTokenConfigs = [
  {
    platform: 'Snapchat',
    xTFSAccountId: '(24)7.ai, Inc. Self Service',
    adAccountId: '1e28d985-e4b5-4685-ad71-a12d304ea139',
    tokenUrl: 'https://accounts.snapchat.com',
    apiBaseUrl: 'https://adsapi.snapchat.com/v1',
    apps: [
      {
        name: 'prd-target-services',
        clientId: 'mock-snapchat-client-id',
        clientSecret: 'mock-snapchat-client-secret',
        redirectUri: 'https://portal.adlab.internal/advportal',
        authorizationCode: 'mock-snapchat-auth-code',
        refreshToken: 'mock-snapchat-refresh-token',
        accessToken: 'mock-snapchat-access-token',
      },
    ],
    createdBy: 'migrations',
  },
  {
    platform: 'TikTok',
    xTFSAccountId: 'adSelfServe-Tiktok-1',
    adAccountId: 'mock-tiktok-ad-account-id',
    bypassJoiSchemaValidation: false,
    apps: [
      {
        accessToken: 'mock-tiktok-access-token',
        app_name: 'tiktok-app-1',
        identityId: 'mock-tiktok-identity-id',
      },
    ],
    createdBy: 'migrations',
  },
];

export async function up(db, session) {
  await TokenConfigModel.insertMany(accessTokenConfigs, { session });
}

export async function down(db) {
  const platforms = accessTokenConfigs.map((con) => con.platform);
  await TokenConfigModel.deleteMany({ platform: { $in: platforms } });
}
