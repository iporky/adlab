import crypto from 'crypto';
import * as Constants from '../constants.js';

const HMAC_SECRET = Constants.HMAC_SECRET;
const MAX_REQUEST_AGE = 5 * 60 * 1000; // 5 minutes in milliseconds

export const configureHMACMiddleware = (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];
    const signature = req.headers['x-request-signature'];
    const timestamp = req.headers['x-request-timestamp'];

    if (!apiKey || !signature || !timestamp) {
      return res.status(401).send('Missing authentication headers');
    }

    const requestTime = parseInt(timestamp, 10);
    const currentTime = Date.now();
    if (Number.isNaN(requestTime) || currentTime - requestTime > MAX_REQUEST_AGE) {
      return res.status(401).send('Request expired or invalid timestamp');
    }

    const payload = JSON.stringify(req.body);
    const hmac = crypto.createHmac('sha256', HMAC_SECRET);
    hmac.update(`${timestamp}.${payload}`);
    const digest = hmac.digest('hex');

    if (!crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature))) {
      return res.status(403).send('Invalid signature');
    }

    return next();
  } catch (error) {
    return res.status(500).send('Internal server error');
  }
};
