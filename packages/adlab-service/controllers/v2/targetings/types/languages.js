import { LANGUAGE_CODES } from '../../../../lib/targetingConstants.js';

export const getLanguageTargeting = async (req, res) => {
  try {
    const languages = Object.entries(LANGUAGE_CODES).map(([key, code]) => ({
      id: code,
      name: key.charAt(0) + key.slice(1).toLowerCase().replace(/_/g, ' '),
    }));

    return res.status(200).json({
      languages,
    });
  } catch (error) {
    return res.status(400).json({
      code: 'INVALID_REQUEST',
      reason: `Error getting language targeting: ${error.message}`,
    });
  }
};
