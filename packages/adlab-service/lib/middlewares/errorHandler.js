import swaggerTools from '@tfs/swagger-tools-wrapper';
import * as Constants from '../constants.js';

export const configureErrorHandler = (err, req, res, next) => {
  const logger = req.app.locals.logger;

  logger.error('Error occurred in request', { err });

  let publicError = false;
  let code = res.statusCode;
  if (!code || code === 200) {
    code = err.code || err.status || err.statusCode || 500;
  }

  // avoid core node RangeError exception
  if (typeof code !== 'number' || code < 400 || code > 999) {
    code = 500;
  }

  res.status(code);

  const logAttrs = {
    url: req.url,
    code,
    method: req.method,
  };

  if (code >= 500) {
    logAttrs.stack = err.stack;
    if (err.type === Constants.BODY_PARSER_ERR_REQUEST_ABORTED) {
      logger.warn(err.message, logAttrs);
    } else {
      logger.error(err.message, logAttrs);
    }
  } else {
    // body-parser detail, if any is in err.type
    logAttrs.detail = swaggerTools.getValidationErrorDetail(err) || err.type;
    publicError = true;
    logger.info(err.message, logAttrs);
  }

  if (!publicError) {
    res.end();
    return;
  }

  res.format({
    'application/json': function () {
      const error = {
        code,
        reason: err.message,
      };

      res.json(error);
    },
    default() {
      res.send(err.message);
    },
  });
};
