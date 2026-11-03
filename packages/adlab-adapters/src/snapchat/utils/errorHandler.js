/*
 * 24/7 Customer, Inc. Confidential, Do Not Distribute. This is an
 * unpublished, proprietary work which is fully protected under
 * copyright law. This code may only be used pursuant to a valid
 * license from 24/7 Customer, Inc.
 */
'use strict';

/**
 * Factory method to create an error handler object with additional details.
 * Useful for mocking and testing purposes.
 * @param {Object} params - The parameters for creating the error.
 * @param {number} params.statusCode - The HTTP status code for the error.
 * @param {string} params.message - The error message.
 * @param {any} params.additionalInfo - Any additional information to include in the error details.
 * @returns {Error} The error object.
 */
function createError({ statusCode, message, additionalInfo }) {
  const stack = new Error().stack;
  const stackLines = stack.split('\n');
  const callerLine = stackLines[2]; // The line that called this function
  const functionNameMatch = callerLine.match(/at (\w+)/);
  const functionName = functionNameMatch ? functionNameMatch[1] : 'unknown';

  const errorMap = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    500: 'Internal Server Error',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Timeout',
  };

  const error = new Error(message);
  error.statusCode = statusCode;
  error.error = errorMap[statusCode] || 'Unknown Error';
  error.stack = stack;
  error.caller = functionName;
  error.additionalInfo = additionalInfo;

  return error;
}

export { createError };
