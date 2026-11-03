export const DAYS_OF_WEEK = {
  SUNDAY: 'sunday',
  MONDAY: 'monday',
  TUESDAY: 'tuesday',
  WEDNESDAY: 'wednesday',
  THURSDAY: 'thursday',
  FRIDAY: 'friday',
  SATURDAY: 'saturday',
};

export const TEMPLATE_STATUS = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
};

export const AGE = {
  /*
    Age range values for targeting.

    Standardizes age ranges across platforms while accounting for
    varying ranges and restrictions.
    */

  //Standard age ranges
  AGE_13_17: '13-17', // Teen
  AGE_18_24: '18-24', // Young adult
  AGE_25_34: '25-34', // Adult
  AGE_35_44: '35-44', // Mid adult
  AGE_45_54: '45-54', // Mature adult
  AGE_55_64: '55-64', // Senior
  AGE_65_PLUS: '65+', // Elder
};

export const INTEREST_CATEGORY = {
  CONSUMER: 'CONSUMER',
  LIFESTYLE: 'LIFESTYLE',
  PROFESSIONAL: 'PROFESSIONAL',
  CULTURAL: 'CULTURAL',
};

export const DEMOGRAPHIC_CATEGORY = {
  GENDER: 'GENDER',
  EDUCATION: 'EDUCATION',
  INCOME: 'INCOME',
  MARITAL_STATUS: 'MARITAL_STATUS',
  PARENTAL_STATUS: 'PARENTAL_STATUS',
  EMPLOYMENT: 'EMPLOYMENT',
};

export const AUDIENCE_CATEGORY = {
  CUSTOM_LISTS: 'CUSTOM_LISTS',
  BEHAVIOR: 'BEHAVIOR',
  SIMILARITY: 'SIMILARITY',
  ATTRIBUTE: 'ATTRIBUTE',
};

export const INTEREST = {
  // Consumer interests
  CONSUMER: {
    SHOPPING: 'SHOPPING',
    TRAVEL: 'TRAVEL',
    FOOD: 'FOOD',
    ENTERTAINMENT: 'ENTERTAINMENT',
    SPORTS: 'SPORTS',
    FASHION: 'FASHION',
    AUTO: 'AUTO',
    ELECTRONICS: 'ELECTRONICS',
  },

  // Lifestyle interests
  LIFESTYLE: {
    FAMILY: 'FAMILY',
    HEALTH: 'HEALTH',
    HOME: 'HOME',
    PETS: 'PETS',
    OUTDOOR: 'OUTDOOR',
    DIY: 'DIY',
  },

  // Professional interests
  PROFESSIONAL: {
    BUSINESS: 'BUSINESS',
    EDUCATION: 'EDUCATION',
    TECHNOLOGY: 'TECHNOLOGY',
    CAREER: 'CAREER',
  },
  // Cultural interests
  CULTURAL: {
    ARTS: 'ARTS',
    MUSIC: 'MUSIC',
    BOOKS: 'BOOKS',
    GAMING: 'GAMING',
    POLITICS: 'POLITICS',
    CHARITY: 'CHARITY',
  },
};

export const DEMOGRAPHIC = {
  // Gender
  GENDER: {
    MALE: 'MALE',
    FEMALE: 'FEMALE',
  },

  // Education
  EDUCATION: {
    HIGH_SCHOOL: 'HIGH_SCHOOL',
    COLLEGE: 'COLLEGE',
    GRADUATE: 'GRADUATE',
  },

  // Income
  INCOME: {
    INCOME_LOW: 'INCOME_LOW',
    INCOME_MEDIUM: 'INCOME_MEDIUM',
    INCOME_HIGH: 'INCOME_HIGH',
  },

  // Marital Status
  MARITAL_STATUS: {
    SINGLE: 'SINGLE',
    MARRIED: 'MARRIED',
  },

  // Parental Status
  PARENTAL_STATUS: {
    PARENT: 'PARENT',
    NOT_PARENT: 'NOT_PARENT',
  },

  // Employment
  EMPLOYMENT: {
    EMPLOYED: 'EMPLOYED',
    SELF_EMPLOYED: 'SELF_EMPLOYED',
    STUDENT: 'STUDENT',
  },
};

export const AUDIENCE_GROUP = {
  // Custom Lists
  CUSTOM_LISTS: {
    CUSTOM: 'CUSTOM',
    CRM: 'CRM',
  },

  // Behavior
  BEHAVIOR: {
    WEBSITE: 'WEBSITE',
    APP: 'APP',
    ENGAGEMENT: 'ENGAGEMENT',
    PIXEL: 'PIXEL',
  },

  // Similarity
  SIMILARITY: {
    LOOKALIKE: 'LOOKALIKE',
  },

  // Attribute
  ATTRIBUTE: {
    LOCATION: 'LOCATION',
    PURCHASE: 'PURCHASE',
  },
};

export const DEVICE_TYPE = {
  DESKTOP: 'DESKTOP', // Desktop computers
  MOBILE: 'MOBILE', // Mobile phones
  TABLET: 'TABLET', // Tablet devices
  CTV: 'CTV', // Connected TV
  CONSOLE: 'CONSOLE', // Gaming consoles
  OTHER: 'OTHER', // Other device types
};

export const OPERATING_SYSTEM = {
  ANDROID: 'ANDROID', // Android mobile OS
  IOS: 'IOS', // iOS mobile OS
  WINDOWS: 'WINDOWS', // Windows desktop OS
  MACOS: 'MACOS', // macOS desktop OS
  LINUX: 'LINUX', // Linux desktop OS
  CHROME_OS: 'CHROME_OS', // Chrome OS
  SMART_TV: 'SMART_TV', // Smart TV OS
  OTHER: 'OTHER', // Other OS types
};

export const DEVICE_MAKE = {
  APPLE: 'APPLE', // Apple devices
  SAMSUNG: 'SAMSUNG', // Samsung devices
  GOOGLE: 'GOOGLE', // Google devices
  LG: 'LG', // LG devices
  SONY: 'SONY', // Sony devices
  HUAWEI: 'HUAWEI', // Huawei devices
  XIAOMI: 'XIAOMI', // Xiaomi devices
  ONEPLUS: 'ONEPLUS', // OnePlus devices
  OPPO: 'OPPO', // OPPO devices
  VIVO: 'VIVO', // Vivo devices
  OTHER: 'OTHER', // Other manufacturers
};

export const BRAND_SAFETY = {
  CONTENT: {
    ADULT: 'ADULT',
    ALCOHOL: 'ALCOHOL',
    GAMBLING: 'GAMBLING',
    HATE_SPEECH: 'HATE_SPEECH',
    ILLEGAL: 'ILLEGAL',
    OFFENSIVE: 'OFFENSIVE',
    SENSITIVE: 'SENSITIVE',
    VIOLENCE: 'VIOLENCE',
  },
  // Quality concerns
  QUALITY: {
    FAKE_NEWS: 'FAKE_NEWS',
    SPAM: 'SPAM',
    LOW_QUALITY: 'LOW_QUALITY',
    CONTROVERSIAL: 'CONTROVERSIAL',
  },
};

export const BRAND_SAFETY_LEVEL = {
  STRICT: 'STRICT',
  MODERATE: 'MODERATE',
  MINIMAL: 'MINIMAL',
};

export const EXCLUDED_CONTENT_CATEGORY = {
  ADULT: 'ADULT',
  ALCOHOL: 'ALCOHOL',
  GAMBLING: 'GAMBLING',
  HATE_SPEECH: 'HATE_SPEECH',
  VIOLENCE: 'VIOLENCE',
  DRUGS: 'DRUGS',
  ARMS: 'ARMS',
  TOBACCO: 'TOBACCO',
};

export const VERIFICATION_SERVICE = {
  DOUBLE_VERIFY: 'DOUBLE_VERIFY',
  IAS: 'IAS',
  MOAT: 'MOAT',
};

export const TOPIC = {
  NEWS: 'NEWS',
  ENTERTAINMENT: 'ENTERTAINMENT',
  SPORTS: 'SPORTS',
  BUSINESS: 'BUSINESS',
  TECHNOLOGY: 'TECHNOLOGY',
  LIFESTYLE: 'LIFESTYLE',
  HEALTH: 'HEALTH',
  EDUCATION: 'EDUCATION',
};

export const CONTEXT = {
  ARTICLE: 'ARTICLE',
  VIDEO: 'VIDEO',
  SOCIAL: 'SOCIAL',
  BLOG: 'BLOG',
  REVIEW: 'REVIEW',
  FORUM: 'FORUM',
};

export const CONTENT_KEYWORD = {
  POSITIVE: 'POSITIVE',
  NEGATIVE: 'NEGATIVE',
  NEUTRAL: 'NEUTRAL',
};

export const LANGUAGE_CODE = {
  EN: 'en',
  ES: 'es',
  FR: 'fr',
  DE: 'de',
  IT: 'it',
  PT: 'pt',
  JA: 'ja',
  KO: 'ko',
  ZH: 'zh',
};

export const VIDEO_PLACEMENT = {
  STREAM: {
    PREROLL: 'PREROLL',
    MIDROLL: 'MIDROLL',
    POSTROLL: 'POSTROLL',
  },
  PLACEMENT: {
    INSTREAM: 'INSTREAM',
    OUTSTREAM: 'OUTSTREAM',
    INTERSTITIAL: 'INTERSTITIAL',
  },
};

export const AUDIO_PLACEMENT = {
  STREAM: {
    PREROLL: 'PREROLL',
    MIDROLL: 'MIDROLL',
    POSTROLL: 'POSTROLL',
  },
  FORMAT: {
    PODCAST: 'PODCAST',
    MUSIC: 'MUSIC',
    RADIO: 'RADIO',
  },
};

export const NATIVE_PLACEMENT = {
  CONTENT: {
    IN_FEED: 'IN_FEED',
    IN_ARTICLE: 'IN_ARTICLE',
    RECOMMENDATION: 'RECOMMENDATION',
  },
  DISPLAY: {
    BANNER: 'BANNER',
    INTERSTITIAL: 'INTERSTITIAL',
    CAROUSEL: 'CAROUSEL',
  },
};

export const DAY_PART = {
  MORNING: 'MORNING', // 6:00 AM - 12:00 PM
  AFTERNOON: 'AFTERNOON', // 12:00 PM - 5:00 PM
  EVENING: 'EVENING', // 5:00 PM - 11:00 PM
  NIGHT: 'NIGHT', // 11:00 PM - 6:00 AM
};

export const WEEK_PART = {
  WEEKDAY: 'WEEKDAY',
  WEEKEND: 'WEEKEND',
  CUSTOM: 'CUSTOM',
};

export const TARGETING_TYPE = {
  // Audience targeting
  AUDIENCE: {
    AUDIENCE: 'AUDIENCE',
    DEMOGRAPHIC: 'DEMOGRAPHIC',
    INTEREST: 'INTEREST',
    LOOKALIKE: 'LOOKALIKE',
    RETARGETING: 'RETARGETING',
  },

  // Location targeting
  LOCATION: {
    GEO: 'GEO',
    PROXIMITY: 'PROXIMITY',
    BUSINESS: 'BUSINESS',
  },

  // Time targeting
  TIME: {
    TIME: 'TIME',
    DAYPART: 'DAYPART',
  },

  // Device targeting
  DEVICE: {
    DEVICE: 'DEVICE',
    PLATFORM: 'PLATFORM',
    CARRIER: 'CARRIER',
    CONNECTION: 'CONNECTION',
  },

  // Content targeting
  CONTENT: {
    KEYWORD: 'KEYWORD',
    CONTEXTUAL: 'CONTEXTUAL',
    TOPIC: 'TOPIC',
    LANGUAGE: 'LANGUAGE',
  },

  // Inventory targeting
  INVENTORY: {
    PLACEMENT: 'PLACEMENT',
    SITE: 'SITE',
    PUBLISHER: 'PUBLISHER',
    POSITION: 'POSITION',
  },

  // Brand safety
  BRAND_SAFETY: {
    BRAND_SAFETY: 'BRAND_SAFETY',
    VIEWABILITY: 'VIEWABILITY',
    CATEGORY: 'CATEGORY',
    EXCLUSIONS: 'EXCLUSIONS',
  },

  // Specialized targeting
  SPECIALIZED: {
    VIDEO: 'VIDEO',
    AUDIO: 'AUDIO',
    NATIVE: 'NATIVE',
  },
};

export const PLACEMENT = {
  video: VIDEO_PLACEMENT,
  audio: AUDIO_PLACEMENT,
  native: NATIVE_PLACEMENT,
};

export const CONTENT = {
  topics: TOPIC,
  context: CONTEXT,
  keywords: CONTENT_KEYWORD,
  languages: LANGUAGE_CODE,
  brandSafety: BRAND_SAFETY,
  brandSafetyLevels: BRAND_SAFETY_LEVEL,
  excludedContent: EXCLUDED_CONTENT_CATEGORY,
  verificationServices: VERIFICATION_SERVICE,
};

export const TIMING = {
  dayParts: DAY_PART,
  weekParts: WEEK_PART,
};

export const LANGUAGE_CODES = {
  //ISO language codes supported for targeting.

  //Common languages
  ENGLISH: 'en',
  SPANISH: 'es',
  FRENCH: 'fr',
  GERMAN: 'de',
  ITALIAN: 'it',
  PORTUGUESE: 'pt',
  DUTCH: 'nl',
  RUSSIAN: 'ru',
  CHINESE: 'zh',
  JAPANESE: 'ja',
  KOREAN: 'ko',

  //Additional European languages
  POLISH: 'pl',
  SWEDISH: 'sv',
  DANISH: 'da',
  NORWEGIAN: 'no',
  FINNISH: 'fi',
  CZECH: 'cs',
  HUNGARIAN: 'hu',
  GREEK: 'el',
  TURKISH: 'tr',

  //Additional Asian languages
  HINDI: 'hi',
  THAI: 'th',
  VIETNAMESE: 'vi',
  INDONESIAN: 'id',
  MALAY: 'ms',

  //Middle Eastern languages
  ARABIC: 'ar',
  HEBREW: 'he',
  PERSIAN: 'fa',

  //Regional variations
  ENGLISH_UK: 'en-GB',
  ENGLISH_US: 'en-US',
  ENGLISH_CA: 'en-CA',
  ENGLISH_AU: 'en-AU',
  SPANISH_ES: 'es-ES',
  SPANISH_MX: 'es-MX',
  FRENCH_FR: 'fr-FR',
  FRENCH_CA: 'fr-CA',
  PORTUGUESE_BR: 'pt-BR',
  PORTUGUESE_PT: 'pt-PT',
  CHINESE_SIMPLIFIED: 'zh-CN',
  CHINESE_TRADITIONAL: 'zh-TW',
};

export const targetingConstantsMapping = {
  age: AGE,
  interest: INTEREST,
  demographic: DEMOGRAPHIC,
  audience: AUDIENCE_GROUP,
  device: DEVICE_TYPE,
  os: OPERATING_SYSTEM,
  device_make: DEVICE_MAKE,
  brand_safety: BRAND_SAFETY,
  brand_safety_level: BRAND_SAFETY_LEVEL,
  excluded_content: EXCLUDED_CONTENT_CATEGORY,
  verification_service: VERIFICATION_SERVICE,
  topic: TOPIC,
  context: CONTEXT,
  content_keyword: CONTENT_KEYWORD,
  language: LANGUAGE_CODE,
  video_placement: VIDEO_PLACEMENT,
  audio_placement: AUDIO_PLACEMENT,
  native_placement: NATIVE_PLACEMENT,
  day_part: DAY_PART,
  week_part: WEEK_PART,
  targeting_type: TARGETING_TYPE,
  placement: PLACEMENT,
  content: CONTENT,
  timing: TIMING,
  language_codes: LANGUAGE_CODES,
};

export const DEFAULT_TARGETING_TYPE = 'all';

export const AVAILABLE_TARGETING_TYPES = Object.keys(targetingConstantsMapping);
