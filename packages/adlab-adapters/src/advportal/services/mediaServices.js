import axios from 'axios';
import _ from 'lodash';
import { MEDIA_TYPE } from '../../constants/mediaTypes.js';
import { IMAGE_ENDPOINT, VIDEO_ENDPOINT, TEMPLATE_ENDPOINT, FOLDER_ENDPOINT, PAGE_SIZE } from '../../constants/mediaConstants.js';

function createAxiosInstance(apiBaseUrl, accessToken) {
  return axios.create({
    baseURL: apiBaseUrl,
    headers: {
       Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Fetch all folders
 */
export async function getFolders(apiBaseUrl, accessToken) {
  const axiosInstance = createAxiosInstance(apiBaseUrl, accessToken);
  const res = await axiosInstance.get(FOLDER_ENDPOINT);
  return Array.isArray(res?.data?.data) ? res.data.data : [];
}

/**
 * Internal: fetch paginated media using folderId and mediaType
 */
async function fetchPaginatedMedia(folderId, mediaType, apiBaseUrl, accessToken) {
  const axiosInstance = createAxiosInstance(apiBaseUrl, accessToken);
  const allMedia = [];
  let currentPage = 1;

  const endpoint = mediaType === MEDIA_TYPE.VIDEO
    ? VIDEO_ENDPOINT
    : mediaType === MEDIA_TYPE.TEMPLATE
      ? TEMPLATE_ENDPOINT
      : IMAGE_ENDPOINT;

  while (true) {
    const body = {
      folderId,
      pageResults: {
        pageResults: PAGE_SIZE,
        currentPage,
      },
    };

    const res = await axiosInstance.post(endpoint, body);
    const data = res?.data?.data || {};
    const pageInfo = data?.pageResults || {};

    // 'videos' for video, 'media' for image/template
    const items = mediaType === MEDIA_TYPE.VIDEO ? data?.videos || [] : data?.media || [];
    allMedia.push(...items);

    const nextPage = pageInfo?.nextPage;
    if (!_.isNumber(nextPage) || nextPage === -1 || nextPage === currentPage) {
      break;
    }

    currentPage = nextPage;
  }

  return allMedia;
}

/**
 * Fetch only one media type for a given folderId: image, video, or template
 */
export async function getFiles(folderId, mediaType = MEDIA_TYPE.IMAGE, apiBaseUrl, accessToken) {
  if (!folderId) {
    throw new Error(`Missing folderId`);
  }

  if (!Object.values(MEDIA_TYPE).includes(mediaType)) {
    throw new Error(`Unsupported mediaType: ${mediaType}`);
  }

  const media = await fetchPaginatedMedia(folderId, mediaType, apiBaseUrl, accessToken);

  return {
    folderId,
    media,
  };
}
