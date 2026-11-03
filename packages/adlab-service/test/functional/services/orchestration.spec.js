import { jest } from '@jest/globals';

const mockAdapter = {
  createCampaigns: jest.fn(),
  createAdGroups: jest.fn(),
  createAds: jest.fn(),
  getAdPreview: jest.fn(),
  getCreativePreview: jest.fn(),
  getTargetingOptions: jest.fn(),
  createCreatives: jest.fn(),
  createMediaAndUpload: jest.fn(),
  getReachMetrics: jest.fn(),
  createSavedAudience: jest.fn(),
  getSavedAudienceList: jest.fn(),
  deleteSavedAudience: jest.fn(),
};

jest.unstable_mockModule('adlab-adapters', () => ({
  __esModule: true,
  SnapchatAdapter: jest.fn().mockImplementation(() => mockAdapter),
  TiktokAdapter: jest.fn().mockImplementation(() => mockAdapter),
}));

jest.unstable_mockModule('../../../services/v1/tokenConfigs.js', () => ({
  fetchTokenConfig: jest.fn().mockImplementation(() => ({
    adAccountId: 'test-accountId',
    tokenUrl: 'test-tokenUrl',
    apiBaseUrl: 'test-apiBaseUrl',
    apps: [],
  })),
  updateTokenConfig: jest.fn().mockResolvedValue({}),
}));

jest.unstable_mockModule('../../../dal/campaignsDAL.js', () => ({
  createCampaignInDB: jest.fn().mockResolvedValue({ _id: 'campaign-1' }),
  updateCampaignInDB: jest.fn().mockResolvedValue({}),
  fetchCampaignByIdFromDB: jest.fn().mockResolvedValue({}),
}));

jest.unstable_mockModule('../../../dal/adgroupsDAL.js', () => ({
  createAdGroupInDB: jest.fn().mockResolvedValue({ _id: 'adgroup-1' }),
  updateAdGroupInDB: jest.fn().mockResolvedValue({}),
}));

jest.unstable_mockModule('../../../dal/adsDAL.js', () => ({
  createAdsInDB: jest.fn().mockResolvedValue({ _id: 'ad-1' }),
}));

const mockEventsEmitterEmitFn = jest.fn();
jest.unstable_mockModule('../../../lib/eventsEmitter.js', () => ({
  eventEmitter: {
    emit: mockEventsEmitterEmitFn,
  },
}));

let orchestratorService;

describe('Orchestrator Service', () => {
  const logger = { info: jest.fn(), error: jest.fn() };

  beforeAll(async () => {
    orchestratorService = await import('../../../services/v1/orchestrator.js');
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('orchestrateCampaignCreation', () => {
    const clientConfig = {
      userId: 'mock-user',
      clientId: 'test-clientId',
      accountId: 'test-accountId',
    };
    const campaigns = [
      {
        name: 'Test Campaign',
        adGroups: {
          adGroup1: {
            name: 'Test AdGroup',
            ads: [{ name: 'Test Ad' }],
          },
        },
      },
    ];

    it('should successfully Snapchat orchestrate campaign creation', async () => {
      mockAdapter.createCampaigns.mockResolvedValue({
        request_status: 'SUCCESS',
        campaigns: [{ campaign: { id: 'campaign-1', status: 'ACTIVE' } }],
      });
      mockAdapter.createAdGroups.mockResolvedValue({
        request_status: 'SUCCESS',
        adsquads: [{ adsquad: { id: 'adsquad-1', status: 'ACTIVE' } }],
      });
      mockAdapter.createAds.mockResolvedValue({
        request_status: 'SUCCESS',
        ads: [{ ad: { id: 'ad-1', status: 'ACTIVE' } }],
      });

      const result = await orchestratorService.orchestrateCampaignCreation(
        clientConfig,
        'Snapchat',
        campaigns,
        1,
        logger,
      );

      expect(result).toEqual({ errors: {}, tally: 1 });
      expect(mockEventsEmitterEmitFn).toHaveBeenCalledWith('pub-ads-progress', expect.any(Object));
    });

    it('should handle TikTok successful campaign creation', async () => {
      mockAdapter.createCampaigns.mockResolvedValue({
        code: 0,
        message: 'OK',
        data: { campaign_id: 'campaign-1', operation_status: 'ENABLE' },
      });
      mockAdapter.createAdGroups.mockResolvedValue({
        code: 0,
        message: 'OK',
        data: { adgroup_id: 'adgroup-1', operation_status: 'ENABLE' },
      });
      mockAdapter.createAds.mockResolvedValue([
        {
          code: 0,
          message: 'OK',
          data: { ad_ids: ['ad-1'], creatives: [{ operation_status: 'ENABLE' }] },
        },
      ]);

      const result = await orchestratorService.orchestrateCampaignCreation(
        clientConfig,
        'TikTok',
        campaigns,
        1,
        logger,
      );

      expect(result).toEqual({ errors: {}, tally: 1 });
      expect(mockEventsEmitterEmitFn).toHaveBeenCalledWith('pub-ads-progress', {
        progress: 100,
        message: 'Published 1 out of 1 ads',
      });
    });

    it('should handle failed campaign creation', async () => {
      mockAdapter.createCampaigns.mockResolvedValue({
        request_status: 'FAILED',
        message: 'Campaign creation failed',
      });

      const result = await orchestratorService.orchestrateCampaignCreation(
        clientConfig,
        'Snapchat',
        campaigns,
        1,
        logger,
      );

      expect(Object.keys(result.errors).length).not.toEqual(0);
    });

    it('should handle failed ad group creation', async () => {
      mockAdapter.createCampaigns.mockResolvedValue({
        request_status: 'SUCCESS',
        campaigns: [{ campaign: { id: 'campaign-1', status: 'ACTIVE' } }],
      });
      mockAdapter.createAdGroups.mockResolvedValue({
        request_status: 'FAILED',
        message: 'AdGroup creation failed',
      });

      const result = await orchestratorService.orchestrateCampaignCreation(
        clientConfig,
        'Snapchat',
        campaigns,
        1,
        logger,
      );

      expect(Object.keys(result.errors).length).not.toEqual(0);
    });

    it('should handle failed ad creation', async () => {
      mockAdapter.createCampaigns.mockResolvedValue({
        request_status: 'SUCCESS',
        campaigns: [{ campaign: { id: 'campaign-1', status: 'ACTIVE' } }],
      });
      mockAdapter.createAdGroups.mockResolvedValue({
        request_status: 'SUCCESS',
        adsquads: [{ adsquad: { id: 'adsquad-1', status: 'ACTIVE' } }],
      });
      mockAdapter.createAds.mockResolvedValue({
        request_status: 'FAILED',
        message: 'Ad creation failed',
      });

      const result = await orchestratorService.orchestrateCampaignCreation(
        clientConfig,
        'Snapchat',
        campaigns,
        1,
        logger,
      );
      expect(Object.keys(result.errors).length).not.toEqual(0);
    });
  });

  describe('getPreviewForCreative', () => {
    it('should get TikTok ad preview', async () => {
      mockAdapter.getAdPreview.mockResolvedValue({ preview: 'data' });

      const result = await orchestratorService.getPreviewForCreative('creative1', 'TikTok', {}, logger);

      expect(result).toEqual({ preview: 'data' });
      expect(mockAdapter.getAdPreview).toHaveBeenCalledWith('creative1', {});
    });

    it('should get Snapchat creative preview', async () => {
      mockAdapter.getCreativePreview.mockResolvedValue({ preview: 'data' });

      const result = await orchestratorService.getPreviewForCreative('creative1', 'Snapchat', {}, logger);

      expect(result).toEqual({ preview: 'data' });
      expect(mockAdapter.getCreativePreview).toHaveBeenCalledWith('creative1');
    });
  });

  describe('getTargetingOptions', () => {
    it('should get targeting options', async () => {
      mockAdapter.getTargetingOptions.mockResolvedValue({ options: [] });

      const result = await orchestratorService.getTargetingOptions({ age: '18-24' }, 'TikTok', logger);

      expect(result).toEqual({ options: [] });
      expect(mockAdapter.getTargetingOptions).toHaveBeenCalledWith({ age: '18-24' });
    });
  });

  describe('createCreativeFromMedia', () => {
    it('should create creatives successfully', async () => {
      mockAdapter.createCreatives.mockResolvedValue({ request_status: 'SUCCESS' });

      await orchestratorService.createCreativeFromMedia([{ name: 'creative1' }], 'TikTok', logger);

      expect(mockAdapter.createCreatives).toHaveBeenCalled();
    });
  });

  describe('createMediaAndUpload', () => {
    it('should upload media', async () => {
      mockAdapter.createMediaAndUpload.mockResolvedValue({ media_id: 'media1' });

      const result = await orchestratorService.createMediaAndUpload({ file: 'data' }, 'TikTok', logger);

      expect(result).toEqual({ media_id: 'media1' });
    });
  });

  describe('getReactMetricsForTargeting', () => {
    it('should get reach metrics', async () => {
      mockAdapter.getReachMetrics.mockResolvedValue({ reach: 1000 });

      const result = await orchestratorService.getReactMetricsForTargeting({ platform: 'TikTok' }, logger);

      expect(result).toEqual({ reach: 1000 });
    });
  });

  describe('saved audience operations', () => {
    it('should create saved audience', async () => {
      mockAdapter.createSavedAudience.mockResolvedValue({ id: 'audience1' });

      const result = await orchestratorService.createSavedAudience(logger, { name: 'Test' });

      expect(result).toEqual({ id: 'audience1' });
    });

    it('should get saved audience list', async () => {
      mockAdapter.getSavedAudienceList.mockResolvedValue({ audiences: [] });

      const result = await orchestratorService.getSavedAudienceList(logger, {});

      expect(result).toEqual({ audiences: [] });
    });

    it('should delete saved audience', async () => {
      mockAdapter.deleteSavedAudience.mockResolvedValue({ success: true });

      const result = await orchestratorService.deleteSavedAudience(logger, { id: 'audience1' });

      expect(result).toEqual({ success: true });
    });
  });
});
