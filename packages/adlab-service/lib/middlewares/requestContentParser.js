import bodyParser from 'body-parser';
import zlib from 'zlib';
import * as Constants from '../constants.js';

/**
 * Decompresses gzip request data
 * @param {Buffer} data - Gzip compressed data
 * @returns {Promise<Object>} - Decompressed JSON data
 */
async function deCompressGzipRequest(data) {
  if (!data || !Buffer.isBuffer(data)) {
    throw new Error('Invalid data: Data must be a non-empty Buffer');
  }

  const buffer = [];
  const gunzip = zlib.createGunzip();

  gunzip.on('data', (chunk) => {
    buffer.push(chunk);
  });

  const decompressPromise = new Promise((resolve, reject) => {
    gunzip.on('end', () => {
      try {
        const decompressedBuffer = Buffer.concat(buffer);
        const jsonData = JSON.parse(decompressedBuffer.toString('utf-8'));
        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    });

    gunzip.on('error', (err) => {
      reject(err);
    });
  });

  gunzip.end(data);

  return decompressPromise;
}

/**
 * Configures the request content parser
 * @param {Object} app - Express app instance
 */
export const configureRequestContentParser = (app) => {
  const { logger, _config } = app.locals;
  const parserBodyLimit = _config.get(Constants.PARSER_BODY_LIMIT);
  const parserJsonLimit = _config.get(Constants.PARSER_JSON_LIMIT) || parserBodyLimit;
  const parserUrlencodedLimit = _config.get(Constants.PARSER_URLENCODED_LIMIT) || parserBodyLimit;

  logger.info('Configuring Request Content Parser...');

  app.use(bodyParser.urlencoded({ extended: false, limit: parserUrlencodedLimit }));

  app.use((req, res, next) => {
    logger.info('Processing request:', {
      method: req.method,
      path: req.path,
      contentType: req.headers['content-type'],
      contentLength: req.headers['content-length'],
    });

    // Skip body parsing for multipart/form-data requests
    if (req.headers['content-type']?.startsWith('multipart/form-data')) {
      logger.info('Skipping body parsing for multipart/form-data request');
      return next();
    }

    if (req.headers['content-encoding'] === 'gzip') {
      logger.info('Processing gzipped request');
      const chunks = [];
      req.on('data', (chunk) => {
        chunks.push(chunk);
      });

      req.on('end', async () => {
        try {
          const rawBody = Buffer.concat(chunks);
          req.body = await deCompressGzipRequest(rawBody);
          logger.info('Successfully processed gzipped request');
          next();
        } catch (error) {
          logger.error('Error processing gzipped request:', error);
          next(error);
        }
      });
    } else {
      if (req.headers['content-length']) {
        logger.info(`Request body size: ${req.headers['content-length']} bytes`);
      }

      // Use the specific limit for JSON requests
      logger.info('Processing JSON request');
      bodyParser.json({ limit: parserJsonLimit })(req, res, (err) => {
        if (err) {
          logger.error('Error parsing JSON request:', err);
        }
        next(err);
      });
    }
  });
};
