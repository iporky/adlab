import { TURBO_BASE_URL } from '../../lib/constants.js';

export async function fetchTemplateJson(orgId, templateId, config, logger) {
  const baseUrl = config.get(TURBO_BASE_URL);
  const url = `${baseUrl}/creatives/templateJson/${orgId}/${templateId}.json`;

  try {
    const response = await fetch(url);
    const contentType = response.headers.get('content-type');

    if (!response.ok) {
      logger?.error?.('Turbo template fetch failed', { url, status: response.status });
      throw new Error('Upstream error from Turbo');
    }

    if (!contentType?.includes('application/json')) {
      logger?.error?.('Unexpected content-type from Turbo', { url, contentType });
      throw new Error('Turbo returned non-JSON content');
    }

    return await response.json();
  } catch (err) {
    logger?.error?.('Failed to fetch template JSON from Turbo', { url, error: err.message });
    throw new Error('Failed to proxy template JSON');
  }
}
