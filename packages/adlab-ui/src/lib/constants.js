/**
 * @file Constants
 * Rules -
 * * 1. One 'constants' file for the whole project
 * * 2. Constants will be grouped by global constants
 * * 3. Constants will be grouped by features
 * * 4. All Constants will be default exported and accessed as 'constants' in the project
 */
const API_BASE_URL = process.env.PUBLIC_API_SERVER_URL;

/* Global constants */
const PRODUCTION_ENV = 'production';
const TEST_ENV = 'test';
const DEVELOPMENT_ENV = 'development';
const X_TFS_ACCOUNT_ID = 'x-tfs-account-id';
const X_TFS_CLIENT_ID = 'x-tfs-client-id';
const X_TFS_USER_ID = 'x-tfs-user-id';
const X_TFS_SERVICE_API_KEY = 'x-tfs-service-api-key';
/* Features - Home */
const HOME = 'home';

/* Features - User */
const SESSION = 'session';
const WORKSPACE_CONFIG_LOCAL_STORAGE_KEY = 'workspaceConfig';

/* Features - Campaign */
const CAMPAIGN = 'campaign';

/* Features - Notifications */
const DIALOG = 'dialog';
/* Features - Notifications */
const NOTIFICATIONS = 'notifications';
/* Features - Notifications */
const PROMPT = 'prompt';
/* Features - Progress Bar */
const PROGRESS_BAR = 'progressBar';

export default {
  API_BASE_URL,
  HOME,
  SESSION,
  PRODUCTION_ENV,
  TEST_ENV,
  DEVELOPMENT_ENV,
  X_TFS_CLIENT_ID,
  X_TFS_ACCOUNT_ID,
  X_TFS_USER_ID,
  X_TFS_SERVICE_API_KEY,
  CAMPAIGN,
  WORKSPACE_CONFIG_LOCAL_STORAGE_KEY,
  DIALOG,
  NOTIFICATIONS,
  PROMPT,
  PROGRESS_BAR
};

// Theme colors
export const THEME_COLORS = {
  PRIMARY: '#4F3ED7',
};

// Campaign statuses and their corresponding colors
export const STATUS_COLORS = {
  DRAFT: 'default',
  PENDING: 'warning',
  ACTIVE: 'success',
  PAUSED: 'warning',
  COMPLETED: 'primary',
  ARCHIVED: 'default',
  REJECTED: 'error',
  SCHEDULED: 'success',
  DELETED: 'default',
  ERROR: 'error',
  LIMITED: 'warning',
};

// Campaign status enum
export const CAMPAIGN_STATUS = {
  DRAFT: 'DRAFT',
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  PAUSED: 'PAUSED',
  COMPLETED: 'COMPLETED',
  ARCHIVED: 'ARCHIVED',
  REJECTED: 'REJECTED',
  SCHEDULED: 'SCHEDULED',
  DELETED: 'DELETED',
  ERROR: 'ERROR',
  LIMITED: 'LIMITED',
};

// Form validation
export const VALIDATION = {
  CAMPAIGN_NAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 50,
  },
  DESCRIPTION: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 500,
  },
  BUDGET: {
    MIN: 0,
  },
};

// Example placeholders
export const PLACEHOLDERS = {
  DESCRIPTION:
    'For example\n"We\'re launching a new men\'s running shoe and want to target active millennials in urban cities with a focus on mobile video ads."',
};

//Insights
export const fieldInsights = {
  AWARENESS:
    'Build widespread recognition for your brand through strategic ad placement and consistent messaging. This objective helps introduce your brand to new audiences and establish a strong market presence.',
  BRAND_AWARENESS:
    "Strengthen your brand's presence in consumers' minds through targeted campaigns that highlight your unique value proposition. Perfect for new brands or those entering new markets.",
  REACH:
    "Expand your campaign's visibility to the maximum number of relevant users within your target audience. Ideal for announcements, launches, or when you want to make a significant market impact.",
  CONSIDERATION:
    "Guide potential customers through their decision-making process by showcasing your product's benefits and unique features. This helps users evaluate your offerings against alternatives.",
  TRAFFIC:
    'Increase visitor flow to your digital properties by creating compelling reasons to visit. Suitable for content marketing, special promotions, or when launching new products/services online.',
  ENGAGEMENT:
    'Foster meaningful interactions with your content across platforms. This builds community, increases brand loyalty, and creates valuable user-generated content opportunities.',
  APP_PROMOTION:
    "Highlight your app's unique features and benefits to drive downloads and active usage. Best for new app launches or promoting major app updates.",
  VIDEO_VIEWS:
    'Maximize viewership of your video content by reaching the right audience at the right time. Great for brand storytelling, product demonstrations, or educational content.',
  CONVERSION:
    'Transform interested users into customers through targeted calls-to-action and optimized user journeys. Ideal for e-commerce, lead generation, or specific action-driven campaigns.',
  APP_INSTALLS:
    'Drive qualified users to download and install your mobile application. This objective optimizes for users most likely to become active app users.',
  LEAD_GENERATION:
    'Capture valuable prospect information through strategically designed forms and landing pages. Perfect for B2B marketing or high-consideration products/services.',
  SALES:
    'Directly boost your revenue by promoting products to users most likely to purchase. Optimal for e-commerce businesses or direct response campaigns.',
  CATALOG_SALES:
    'Showcase your product catalog to interested buyers and drive sales through dynamic product ads. Excellent for retail businesses with varied product lines.',
  STORE_VISITS:
    'Drive foot traffic to your physical locations by targeting nearby potential customers. Ideal for retail stores, restaurants, or local businesses.',
  MESSAGES:
    'Initiate conversations with potential customers through messaging platforms. Great for businesses that rely on direct communication for sales or support.',
  APP_RETENTION:
    'Keep users engaged with your app through targeted re-engagement campaigns. Essential for subscription-based apps or those relying on regular user interaction.',
  PRODUCT_DISCOVERY:
    'Help potential customers find and explore your products through tailored recommendations and browsing experiences. Perfect for expanding product visibility.',
  WEBSITE_TRAFFIC:
    'Attract qualified visitors to your website through targeted advertising. Best for content marketing, online services, or when building an online presence.',
  PRODUCT_CONSIDERATION:
    "Showcase your products' features and benefits to interested users, helping them make informed purchase decisions. Ideal for complex or high-value products.",
  APP_ENGAGEMENT:
    'Encourage active app usage through targeted promotions and personalized content. Suitable for apps seeking to increase user activity and retention.',
  PAGE_ENGAGEMENT:
    'Build an active community around your social media presence through engaging content and interactions. Great for building brand loyalty and community.',
  APP_INSTALL:
    'Promote your mobile app to users most likely to download and become active users. Focuses on quality installs rather than just quantity.',
  OFFLINE_CONVERSION:
    'Connect online advertising to in-store purchases by tracking customer journey across channels. Perfect for businesses with both online and physical presence.',
  PRODUCT_SALES:
    'Drive direct product sales through targeted product advertising and promotions. Ideal for e-commerce businesses focusing on specific product lines.',
  LOCAL_AWARENESS:
    'Increase visibility among customers in your immediate geographic area. Essential for local businesses, events, or location-specific promotions.',
  campaignName:
    "Choose a clear and descriptive name that reflects your campaign's purpose. For example: 'Summer2023_BackToSchool_Display'",
  description:
    "Write a comprehensive description including your campaign objectives, target audience, and key messaging. Example: 'Back to school campaign targeting parents aged 25-45 in urban areas, highlighting our new collection of school supplies.'",
  startDate:
    "Choose a strategic launch date that maximizes your campaign's impact. Consider seasonal trends, competitor activities, audience availability, and alignment with your marketing calendar. For holiday campaigns, start 4-6 weeks before the event. For product launches, ensure all assets and landing pages are ready before the start date.",
  endDate:
    'Set an end date that provides sufficient time to achieve your campaign goals while maintaining momentum. Factor in your budget pacing, campaign type, and typical customer journey length. For awareness campaigns, plan for at least 4-6 weeks. For conversion-focused campaigns, analyze historical data to determine optimal duration.',
  currency: 'Select the currency that matches your target market and budget allocation.',
  budget: 'Set a realistic budget that aligns with your campaign goals and expected ROI. Consider factors like audience size and campaign duration.',
  age: 'Focus on age groups most likely to engage with your product. Studies show different age groups have distinct buying behaviors and platform preferences. Consider generational characteristics when targeting.',
  location: 'Geographic targeting helps reach users in relevant areas. Consider factors like population density, market potential, and local demographics. Combine city, state, and country targeting for precise audience reach. Example: Target major metropolitan areas for luxury products, or focus on suburban regions for family-oriented services.',
  interest: "Select Interests (multiple interests can be selected per category). Interest-based targeting ensures your ads reach users with relevant hobbies and preferences. Match interests with your product's use cases and benefits to maximize engagement and campaign effectiveness.",
  device: 'Target specific device types to optimize ad delivery and user experience. Consider how your audience accesses content across different devices.',
  makes: 'Target specific device manufacturers. Useful for accessories, apps, or services designed for specific brands. Important for targeting users of particular device brands or ecosystems.',
  os: 'Target by operating system to ensure compatibility and optimal performance. Important for app installs, OS-specific features, or optimizing content delivery.',
  // Demographics Insights
  demographics: 'Demographic targeting allows you to reach specific audience segments',
  language: 'Select languages spoken by your target audience. Consider regional variations and cultural preferences when targeting multiple languages. For international campaigns, focus on primary languages in each region to maximize reach and engagement.',
  tags: "Add relevant keywords that describe your campaign's focus areas, target audience, and key features. Examples: 'summer_sale', 'back_to_school', 'mobile_gaming'. Good tags help with campaign organization and performance analysis. Use specific, descriptive terms and avoid generic words.",
  platform: 'Choose your Platform based on your campaign objectives and target audience. DV360 offers extensive reach and programmatic capabilities, Meta provides social media targeting, and TikTok specializes in engaging younger audiences through short-form video content. Consider allocating budget across multiple platforms for optimal reach and performance.',
};

// Location types for targeting
export const LOCATION_TYPES = [
  { value: 'country', label: 'Country' },
  { value: 'region', label: 'Region' },
  { value: 'city', label: 'City' },
  { value: 'zip', label: 'ZIP' },
  { value: 'subcity', label: 'Subcity' },
  { value: 'neighborhood', label: 'Neighborhood' },
];

export const TARGETING_MENU_ITEMS = [
  { id: 'demographics', label: 'Demographics' },
  { id: 'age', label: 'Age' },
  { id: 'location', label: 'Location' },
  { id: 'interest', label: 'Interest' },
  { id: 'device', label: 'Device' },
  { id: 'language', label: 'Language' },
];

export const TARGETING_SECTIONS = {
  demographics: 'demographics',
  age: 'age',
  location: 'location',
  interest: 'interest',
  device: 'device',
  language: 'language',
};


export const PLATFORM_OPTIONS = [
  {
    id: 'dv360',
    name: 'DV360',
    image: '/dsp/dv360.png',
    defaultPercentage: 40,
  },
  {
    id: 'meta',
    name: 'Meta',
    image: '/dsp/meta.png',
    defaultPercentage: 35,
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    image: '/dsp/tiktok.svg',
    defaultPercentage: 25,
  },
];

// Location type string constants
export const LOCATION_TYPE_NEIGHBORHOOD = 'neighborhood';
export const LOCATION_TYPE_CITY = 'city';
export const LOCATION_TYPE_SUBCITY = 'subcity';
export const LOCATION_TYPE_ZIP = 'zip';
export const LOCATION_TYPE_REGION = 'region';
export const LOCATION_TYPE_COUNTRY = 'country';

export const CAMPAIGN_TABLE_COLUMNS = [
  { key: 'name', label: 'Name', minWidth: 200 },
  { key: 'type', label: 'Type', minWidth: 100 },
  { key: 'expiringOn', label: 'Expiring On', minWidth: 150 },
  { key: 'daysLeft', label: 'Days Left', minWidth: 100 },
  { key: 'platforms', label: 'Platforms', minWidth: 150 },
  { key: 'budget', label: 'Budget', minWidth: 100 },
  { key: 'totalSpend', label: 'Total Spend', minWidth: 100 },
  { key: 'performance', label: 'Performance', minWidth: 100 },
  { key: 'status', label: 'Status', minWidth: 120 },
  { key: 'actions', label: 'Actions', minWidth: 120 },
];

export const CAMPAIGN_TABLE_MOCK_DATA = [
  {
    id: 1,
    name: 'Campaign 1',
    type: 'video',
    expiringOn: 'June 10, 2024',
    daysLeft: 3,
    platforms: '3',
    budget: '$20000',
    totalSpend: '$18000',
    performance: '+45%',
    status: CAMPAIGN_STATUS.ACTIVE,
  },
  {
    id: 2,
    name: 'Campaign 2',
    type: 'video',
    expiringOn: 'June 10, 2024',
    daysLeft: 10,
    platforms: '0',
    budget: '$200000',
    totalSpend: '$18000',
    performance: '+15%',
    status: CAMPAIGN_STATUS.PENDING,
  },
  {
    id: 3,
    name: 'Campaign 3',
    type: 'display',
    expiringOn: 'June 10, 2024',
    daysLeft: 15,
    platforms: '3',
    budget: '$20000',
    totalSpend: '$18000',
    performance: '-15%',
    status: CAMPAIGN_STATUS.COMPLETED,
  },
  {
    id: 4,
    name: 'Campaign 3',
    type: 'display',
    expiringOn: 'June 10, 2024',
    daysLeft: 15,
    platforms: '3',
    budget: '$20000',
    totalSpend: '$18000',
    performance: '-15%',
    status: CAMPAIGN_STATUS.REJECTED,
  },
  {
    id: 5,
    name: 'Campaign 3',
    type: 'display',
    expiringOn: 'June 10, 2024',
    daysLeft: 15,
    platforms: '3',
    budget: '$20000',
    totalSpend: '$18000',
    performance: '-15%',
    status: CAMPAIGN_STATUS.ERROR,
  },
];

export const IMAGE_FORMATS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'avif', 'apng', 'jfif', 'pjpeg', 'pjp'];