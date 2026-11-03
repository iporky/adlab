import { mapCampaignData } from '../../src/snapchat/utils/parameterMapper.js';

describe('mapCampaignData', () => {
  it('should map all fields correctly', () => {
    const campaignData = {
      id: '123',
      ad_account_id: '456',
      dailyBudget: 100,
      end_time: '2024-08-31T00:00:00Z',
      name: 'Test Campaign',
      start_time: '2024-08-01T00:00:00Z',
      status: 'ACTIVE',
      lifetimeSpendCap: 1000,
      iosAppId: 'com.example.ios',
      androidAppUrl: 'https://play.google.com/store/apps/details?id=com.example.android',
      objective: 'CONVERSIONS',
      buyModel: 'AUCTION',
      restrictedDeliverySignals: true,
      candidateBallotInformation: 'Candidate Info',
    };

    const expectedMappedData = {
      id: '123',
      ad_account_id: '456',
      daily_budget_micro: 100000000,
      end_time: new Date('2024-08-31T00:00:00Z'),
      name: 'Test Campaign',
      start_time: new Date('2024-08-01T00:00:00Z'),
      status: 'ACTIVE',
      lifetime_spend_cap_micro: 1000000000,
      measurement_spec: {
        ios_app_id: 'com.example.ios',
        android_app_url: 'https://play.google.com/store/apps/details?id=com.example.android',
      },
      objective: 'CONVERSIONS',
      buy_model: 'AUCTION',
      regulations: {
        restricted_delivery_signals: true,
        candidate_ballot_information: 'Candidate Info',
      },
    };

    const result = mapCampaignData(campaignData);
    expect(result).toEqual(expectedMappedData);
  });

  it('should handle missing optional fields', () => {
    const campaignData = {
      id: '123',
      ad_account_id: '456',
      name: 'Test Campaign',
      status: 'ACTIVE',
      objective: 'CONVERSIONS',
      buyModel: 'AUCTION',
    };

    const expectedMappedData = {
      id: '123',
      ad_account_id: '456',
      daily_budget_micro: undefined,
      end_time: undefined,
      name: 'Test Campaign',
      start_time: undefined,
      status: 'ACTIVE',
      lifetime_spend_cap_micro: undefined,
      measurement_spec: {
        ios_app_id: undefined,
        android_app_url: undefined,
      },
      objective: 'CONVERSIONS',
      buy_model: 'AUCTION',
      regulations: {
        restricted_delivery_signals: undefined,
        candidate_ballot_information: undefined,
      },
    };

    const result = mapCampaignData(campaignData);
    expect(result).toEqual(expectedMappedData);
  });

  it('should handle fields with falsy values', () => {
    const campaignData = {
      id: '123',
      ad_account_id: '456',
      dailyBudget: 1,
      end_time: null,
      name: 'Test Campaign',
      start_time: '',
      status: 'ACTIVE',
      iosAppId: '',
      androidAppUrl: '',
      objective: 'CONVERSIONS',
      buyModel: 'AUCTION',
      restrictedDeliverySignals: false,
      candidateBallotInformation: '',
    };

    const expectedMappedData = {
      id: '123',
      ad_account_id: '456',
      daily_budget_micro: 1000000,
      end_time: undefined,
      name: 'Test Campaign',
      start_time: undefined,
      status: 'ACTIVE',
      measurement_spec: {
        ios_app_id: '',
        android_app_url: '',
      },
      objective: 'CONVERSIONS',
      buy_model: 'AUCTION',
      regulations: {
        restricted_delivery_signals: false,
        candidate_ballot_information: '',
      },
    };

    const result = mapCampaignData(campaignData);
    expect(result).toEqual(expectedMappedData);
  });
});
