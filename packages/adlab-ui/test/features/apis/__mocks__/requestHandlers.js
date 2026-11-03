import { mocks } from 'adlab-shared';
import { http, HttpResponse } from 'msw';

import constants from '../../../../src/lib/constants';

/**
 * Request handlers for the mock service worker.
 * Add your request handlers here.
 * @type {HttpHandler[]}
 */
export const httpHandlers = [
  http.get(`${constants.API_BASE_URL}/v1/permissions`, async () => {
    return HttpResponse.json(mocks.userPermissions, {
      status: 200,
      statusText: 'mock permission data!.',
    });
  }),
];
