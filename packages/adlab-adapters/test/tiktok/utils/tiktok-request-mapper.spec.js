import { TikTokRequestMapper } from '../../../src/utils/tiktok-request-mapper.js';
import data from './tiktok-request.json';

describe('TikTokRequestMapper', () => {
  describe('mapAttributes', () => {
    it('should map attributes correctly for a valid type', () => {
      const dsData = {};
      const config = {};
      const result = TikTokRequestMapper.mapAttributes('campaign', dsData, config, data);
      expect(result).toEqual({
        advertiser_id: '7412972596997832705',
        app_id: 'app_98765',
        app_promotion_type: 'APP_PREREGISTRATION',
        campaign_name: 'tiktok_demo',
        objective_type: 'CONVERSIONS',
        budget_mode: 'BUDGET_MODE_TOTAL',
        budget: '200',
        budget_optimize_on: 'true',
        campaign_type: 'REGULAR_CAMPAIGN',
        operation_status: 'DISABLE',
        optimization_goal: 'SHOW',
        start_time: 1734603120000,
        end_time: 1735583400000,
      });
    });

    it('should throw an error for an invalid type', () => {
      expect(() => {
        TikTokRequestMapper.mapAttributes('invalidType', {});
      }).toThrow('Invalid type for attribute mapping: invalidType');
    });
  });

  describe('groupAndEnrichData', () => {
    it('should group and enrich data correctly', () => {
      const dsData = data.dsData;
      const personalizedCreatives = data.personalizedCreatives;
      const result = TikTokRequestMapper.groupAndEnrichData(dsData, personalizedCreatives);
      expect(result).toEqual({
        2632274: {
          dsData: data.dsData[0],
          config: data.personalizedCreatives[0].config,
          creative: data.personalizedCreatives[0].creatives,
        },
        2632275: {
          dsData: data.dsData[1],
          config: data.personalizedCreatives[1].config,
          creative: data.personalizedCreatives[1].creatives,
        },
      });
    });
  });

  describe('map', () => {
    it('should map campaign, adgroups, and ads correctly', () => {
      const result = TikTokRequestMapper.map(data);
      console.log('result: ', result);
      expect(result.campaign).toMatchObject({
        advertiser_id: '7412972596997832705',
        app_id: 'app_98765',
        app_promotion_type: 'APP_PREREGISTRATION',
        campaign_name: 'tiktok_demo',
        objective_type: 'CONVERSIONS',
        budget_mode: 'BUDGET_MODE_TOTAL',
        budget: '200',
        budget_optimize_on: 'true',
        campaign_type: 'REGULAR_CAMPAIGN',
        operation_status: 'DISABLE',
        optimization_goal: 'SHOW',
        start_time: 1734603120000,
        end_time: 1735583400000,
      });
      delete data.dsData[0].rowid;
      expect(result.adgroups).toHaveLength(2);
      // expect(result.adgroups[0]).toMatchObject(data.dsData[0]);

      delete data.personalizedCreatives[0].creatives.dsRowIds;
      expect(result.ads).toHaveLength(2);
      expect(result.ads[0]).toMatchObject({
        adgroup_id: 'c1Adg1',
        advertiser_id: '7412972596997832705',
        creatives: [
          {
            ...data.personalizedCreatives[0].creatives,
            call_to_action: '',
            call_to_action_id: '',
            creative_type: '',
            identity_id: '',
            identity_type: '',
            landing_page_url: '',
          },
        ],
      });
    });
  });
});
