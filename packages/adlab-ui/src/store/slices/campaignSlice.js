import { createSlice } from '@reduxjs/toolkit';

// Make sure we use the same name for the slice as in features/campaign/campaignSlice.js
export const CAMPAIGN_SLICE = 'campaign';

const initialState = {
  selectedGoal: null,
  currencyOptions: null,
  campaignId: null, // Add campaignId for edit mode

  formData: {
    basicDetails: {
      campaignName: '',
      description: '',
      startDate: null,
      endDate: null,
      currency: '',
      budget: '',
      campaignType: 'Programmatic',
      campaignFormat: 'Display',
    },
    objectives: {
      selectedObjective: null,
      selectedGoal: null,
    },
    tags: [],
    demographics: {
      selectedMenu: 'demographics',
      age: [],
      location: [],
      interest: null,
      device: {
        devices: [],
        os: [],
        makes: [],
      },
      language: [],
    },
    creatives: {
      assets: [],
      uploading: false,
      error: null,
    },
    platformCampaigns: [
      // { platform: "tiktok", percentage: "40" }
    ],
    template: {
      macros: [
        {
          name: 'heading',
          type: 'string',
          values: ['Summer Sale - Up to 50% Off!', 'Back to School Special', 'Holiday Mega Sale', 'Flash Sale - 24 Hours Only']
        },
        {
          name: 'subheading',
          type: 'string',
          values: ['Limited time offer', 'Don\'t miss out', 'Best deals of the year', 'Hurry while supplies last']
        },
        {
          name: 'product1',
          type: 'image',
          values: [
            '//images.ctfassets.net/yadj1kx9rmg0/wtrHxeu3zEoEce2MokCSi/cf6f68efdcf625fdc060607df0f3baef/quwowooybuqbl6ntboz3.jpg',
            'https://static.toiimg.com/thumb/msid-122205225,imgsize-1135126,width-400,resizemode-4/122205225.jpg',
            'https://picsum.photos/200/300.webp',
            'https://picsum.photos/201/300.webp'
          ]
        },
        {
          name: 'product2',
          type: 'image',
          values: [
            'https://picsum.photos/202/300.webp',
            'https://picsum.photos/203/300.webp',
            'https://picsum.photos/204/300.webp',
            'https://picsum.photos/205/300.webp',
            'https://picsum.photos/206/300.webp',
            'https://picsum.photos/207/300.webp',
            'https://picsum.photos/208/300.webp'
          ]
        },
        {
          name: 'cta',
          type: 'string',
          values: ['Shop Now', 'Buy Today', 'Get Yours', 'Order Now', 'Discover More']
        },
        {
          name: 'bg',
          type: 'string',
          values: ['Blue Gradient', 'Red Solid', 'White Clean', 'Black Bold']
        },
        {
          name: 'discount',
          type: 'string',
          values: ['10%', '20%', '30%', '50%', '70%']
        },
        {
          name: 'price',
          type: 'string',
          values: ['$19.99', '$29.99', '$39.99', '$49.99', '$99.99']
        },
        {
          name: 'store',
          type: 'url',
          values: [
            'https://example.com/store3.jpg',
            'https://example.com/store4.jpg',
            'https://example.com/store5.jpg'
          ]
        },
      ],
    },
    personalization: {
      selectedMacro: null,
      selectedValues: {},
      combinations: [], // Add combinations array
    },
  },
};

const campaignSlice = createSlice({
  name: CAMPAIGN_SLICE,
  initialState,
  reducers: {
    setSelectedGoal: (state, action) => {
      state.selectedGoal = action.payload;
      state.formData.objectives.selectedGoal = action.payload;
    },
    updateBasicDetails: (state, action) => {
      state.formData.basicDetails = {
        ...state.formData.basicDetails,
        ...action.payload,
      };
    },
    updateObjectives: (state, action) => {
      state.formData.objectives = {
        ...state.formData.objectives,
        ...action.payload,
      };
    },
    updateTags: (state, action) => {
      state.formData.tags = action.payload;
    },
    updateDemographics: (state, action) => {
      state.formData.demographics = {
        ...state.formData.demographics,
        ...action.payload,
      };
    },
    resetCampaignForm: () => initialState,
    updatePlatformCampaigns: (state, action) => {
      state.formData.platformCampaigns = action.payload;
    },
    updateCreatives: (state, action) => {
      state.formData.creatives = {
        ...state.formData.creatives,
        ...action.payload,
      };
    },
    updateCurrencyOptions: (state, action) => {
      state.currencyOptions = action.payload;
    },
    updateTemplate: (state, action) => {
      state.formData.template = {
        ...state.formData.template,
        ...action.payload,
      };
    },
    updatePersonalization: (state, action) => {
      state.formData.personalization = {
        ...state.formData.personalization,
        ...action.payload,
      };
    },
    addCombination: (state, action) => {
      if (!state.formData.personalization.combinations) {
        state.formData.personalization.combinations = [];
      }
      state.formData.personalization.combinations.push(action.payload);
    },
    deleteCombination: (state, action) => {
      const index = action.payload;
      if (state.formData.personalization.combinations && index >= 0 && index < state.formData.personalization.combinations.length) {
        state.formData.personalization.combinations.splice(index, 1);
      }
    },
    setPersonalizationFromAPI: (state, action) => {
      const personaConfig = action.payload;
      // Update template if provided
      if (personaConfig.template) {
        state.formData.template = {
          ...state.formData.template,
          ...personaConfig.template,
        };
      }
      // Update personalization combinations
      state.formData.personalization = {
        ...state.formData.personalization,
        combinations: personaConfig.combinations || [],
      };
    },
    populateCampaignForm: (state, action) => {
      const campaign = action.payload;
      // Populate basic details
      state.formData.basicDetails = {
        campaignName: campaign.campaignName || '',
        description: campaign.description || '',
        startDate: campaign.startDate || null,
        endDate: campaign.endDate || null,
        currency: campaign.budget?.currency || '',
        budget: campaign.budget?.amount || '',
        campaignType: campaign.campaignType || '',
        campaignFormat: campaign.campaignFormat || '',
      };
      // Populate objectives
      state.formData.objectives = {
        selectedObjective: campaign.objective || null,
        selectedGoal: campaign.goals?.[0] || null,
        tags: campaign.tags || [],
      };
      state.selectedGoal = campaign.goals?.[0] || null;
      // Store campaign ID for edit mode
      state.campaignId = campaign._id;
    },
    setCampaignId: (state, action) => {
      state.campaignId = action.payload;
    },
  },
});

export const {
  setSelectedGoal,
  updateBasicDetails,
  updateObjectives,
  updateDemographics,
  resetCampaignForm,
  updatePlatformCampaigns,
  updateCreatives,
  updateCurrencyOptions,
  updateTemplate,
  updatePersonalization,
  addCombination,
  deleteCombination,
  setPersonalizationFromAPI,
  populateCampaignForm,
  setCampaignId,
  updateTags,
} = campaignSlice.actions;

export default campaignSlice.reducer;