/*
 * 24/7 Customer, Inc. Confidential, Do Not Distribute. This is an
 * unpublished, proprietary work which is fully protected under
 * copyright law. This code may only be used pursuant to a valid
 * license from 24/7 Customer, Inc.
 */
'use strict';

import Assert from '@tfs/node-assert';
import libJSXML from '@tfs/node-jstoxmlstream';
import lodash from 'lodash';
import libPath, { dirname } from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { db } from './drivers/database.js';
import * as Constants from './constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const RX_TRUE = /^(?:(true|yes|on|1))$/i;
const RX_FALSE = /^(?:(false|no|off|0))$/i;

const { isUndefined, omitBy, omit, keys, isObject, startCase, isEmpty } = lodash;
/**
 * Attempts to parse the raw value as a Boolean value
 * @param  {string} raw    The raw value to be parsed
 * @param  {boolean} [defVal] A fallback value if raw is unspecified
 *   or it cannot be parsed as a boolean
 * @return {boolean|undefined} The parsed value or undefined if the value cannot be parsed
 *   and no default was specified
 */
export const parseBool = (raw, defVal) => {
  if (defVal !== undefined) {
    Assert.isBoolean(defVal);
  }

  if (raw === undefined) {
    return defVal;
  }

  let ret = defVal;
  if (RX_TRUE.test(raw)) {
    ret = true;
  } else if (RX_FALSE.test(raw)) {
    ret = false;
  }

  return ret;
};

export const parseInt = (raw, defVal) => {
  if (defVal !== undefined) {
    Assert.isNumber(defVal);
  }

  if (raw === undefined) {
    return defVal;
  }

  let ret = global.parseInt(raw, 10);
  if (Number.isNaN(ret)) {
    ret = defVal;
  }

  return ret;
};

export const parsePosInt = (val, name, defVal) => {
  if (val) {
    Assert.isNumberExclusive(val, name, 0);
  } else if (defVal) {
    Assert.isNumberExclusive(defVal, `${name}, default value`, 0);
    val = defVal;
  }

  return val;
};

/**
 * Attempts to rehydrate a JSON string into an object
 * @param  {string}   str      The JSON string
 * @param  {Function} callback The function to invoke with the parse error or the parsed object
 * @private
 */
export const jsonToObject = (str, callback) => {
  let err;
  let obj;

  if (str) {
    try {
      obj = JSON.parse(str);
    } catch (e) {
      err = e;
    }
  }

  callback(err, obj);
};

const Units = [
  { secs: 86400, units: 'days' },
  { secs: 3600, units: 'hours' },
  { secs: 60, units: 'minutes' },
  { secs: 1, units: 'seconds' },
];

/*
 * Given a value in seconds, transform the value to a more human readable unit
 *   of days, hours, minutes, or seconds.
 * The return value includes the following properties:
 *   units: The selected units
 *   value: The result of the conversion
 */
export const formatSeconds = (secondsVal) => {
  let retval;
  for (let idx = 0; idx < Units.length; idx++) {
    const curUnit = Units[idx];
    if (secondsVal >= curUnit.secs) {
      retval = {
        value: (secondsVal / curUnit.secs).toFixed(2),
        units: curUnit.units,
      };

      break;
    }
  }

  return retval;
};

/**
 * Make the HTTP response non-cacheable
 * @param  {Object} resp An HTTP response
 * @return {Object} The HTTP response passed in via the resp parameter
 */
export const makeNonCacheable = (resp) =>
  resp.set('Expires', 0).set('Cache-Control', 'no-store, no-cache, must-revalidate').set('Pragma', 'no-cache');

const RX_CONTENTTYPE_DELIM = /\s*;\s*/;

export const getBareContentTypeFromHeader = (ctype) => {
  if (ctype) {
    ctype = ctype.split(RX_CONTENTTYPE_DELIM)[0];
  }

  return ctype;
};

/**
 * Returns the content-type stripped of any charset attribute
 * @param  {Object} req The HTTP request
 * @return {string} The value of the content-type HTTP request header
 */
export const getBareContentType = (req) => getBareContentTypeFromHeader(req.get('content-type'));

/**
 * Streams an object in XML format back to the client
 * @param  {Object} response The HTTP response
 * @param  {string} rootName The XML root document element name
 * @param  {Object} obj The object to convert to XML
 */
export const streamXMLResponse = (response, rootName, obj) => {
  libJSXML.toXML(obj, { rootName }).pipe(response);
};

/**
 * Builds the value of the User-Agent header
 * @param  {string} version The current version of the service
 * @return {string} the value of the User-Agent header
 */
export const makeUAHeader = (version) => `${Constants.USER_AGENT_NAME}/${version}`;

/**
 * Reads the service version from the manifest (package.json)
 */
export const readVersion = () => {
  const manifestPath = libPath.resolve(`${__dirname}/../package.json`);
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  return manifest.version;
};

/**
 * Gets userid from jwt token set by oidc middleware post authentication
 * @param req
 * @returns {{accountId: *, clientId: *, userId: (string|*)}}
 */
export const getUserContextFromReq = (req) => {
  try {
    Assert.isObject(req.headers);
    let userId = req.headers[Constants.X_TFS_USER_ID];
    if (!userId) {
      if (req.headers[Constants.X_TFS_SERVICE_API_KEY]) {
        userId = Constants.SYSTEM_USER_ID;
      } else {
        userId = req.jwt?.claims?.uid;
      }
    }
    return {
      userId,
      clientId: req.headers[Constants.X_TFS_CLIENT_ID],
      accountId: req.headers[Constants.X_TFS_ACCOUNT_ID],
    };
  } catch (error) {
    throw new Error(`Error getting user context: ${error.message}`);
  }
};

export const parseURLFromRequest = (req) => {
  // Assuming req.path is '/v1/context/id?/action?'
  const parsedUrl = new URL(req.path, `http://${req.headers.host}`);
  const pathSegments = parsedUrl.pathname.split('/').filter((segment) => segment);

  // Assuming, path segments is an array: ['version', 'context', 'id', 'action']
  const version = pathSegments[0];
  const context = pathSegments[1];
  const resourceId = pathSegments[2]; // This could be undefined if it's not in the path
  const action = pathSegments[3]; // This could be undefined if it's not in the path
  return {
    version,
    context,
    resourceId,
    action,
  };
};

export const cleanObject = (obj) => {
  const cleanedObj = omitBy(obj, (value) => isUndefined(value) || value === '');
  Object.keys(cleanedObj).forEach((key) => {
    if (isObject(cleanedObj[key]) && !Array.isArray(cleanedObj[key])) {
      cleanedObj[key] = cleanObject(cleanedObj[key]);
    }
  });
  return cleanedObj;
};

export const cleanAndSplit = (value, separator = '\n') => value.replace(/\r/g, '').split(separator);

/**
 * Extracts values for keys from process.argv
 * @param processArgvs
 * @param args
 * @returns {*}
 */
export const extractFromProcessArgvs = (processArgvs, args) =>
  args.reduce((acc, arg) => {
    const argIndex = processArgvs.findIndex((item) => item.startsWith(`${arg}=`));
    if (argIndex !== -1) {
      const [key, value] = processArgvs[argIndex].split('=');
      acc[key] = value;
    }
    return acc;
  }, {});

/**
 * Remove DB specific fields from the entity
 * @param {Object} object - The entity object to clean
 * @param {string[]} additional - Additional fields to remove
 * @returns {Partial<Object>} The cleaned object
 */
export const removeDBFields = (object, additional = []) =>
  omit(object, [
    '_id',
    '__v',
    'createdBy',
    'updatedBy',
    'createdOn',
    'updatedOn',
    'clientId',
    'accountId',
    ...additional,
  ]);

/**
 * Get the fields to unset in the update operation
 * @param sourceDoc
 * @param updateDoc
 * @returns {{}}
 */
export const getUnsetFields = (sourceDoc, updateDoc) =>
  keys(sourceDoc).reduce((acc, key) => {
    if (!Object.prototype.hasOwnProperty.call(updateDoc, key) && key !== '_id') {
      acc[key] = '';
    }
    return acc;
  }, {});

/**
 * Validate the object ID to be a valid MongoDB ObjectID
 * @param id
 * @param entity
 */
export const validateDBObjectId = (id, entity) => {
  if (!db.Types.ObjectId.isValid(id)) {
    throw new Error(`Invalid ${startCase(entity)}`);
  }
};

/**
 * Validate the string for NoSQL injection
 * @param value
 * @param entity
 * @returns {string}
 */
export const validateStringForNoSQLInjection = (value, entity) => {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`Invalid ${startCase(entity)}`);
  }
  if (/[.$]/.test(value)) {
    throw new Error(`Invalid characters in ${startCase(entity)}`);
  }
  return value.trim();
};

/**
 * Get the difference and missing fields between two objects. This function will recursively check the
 * children and return the entire attribute tree if the values are different at any level.
 * Useful for mongodb diff updates.
 * @param a
 * @param b
 * @returns {{changes: undefined, unset: {}}|{changes, unset: {}}|{changes: {}, unset: {}}}
 */
export const getObjectDiff = (a, b) => {
  if (a === b) return { changes: {}, unset: {} };

  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) {
    return { changes: b, unset: {} };
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    const aSorted = [...a].sort();
    const bSorted = [...b].sort();
    if (aSorted.length !== bSorted.length || !aSorted.every((val, index) => val === bSorted[index])) {
      return { changes: b, unset: {} };
    }
    return { changes: {}, unset: {} };
  }

  const changes = {};
  const unset = {};
  const allKeys = new Set([...Object.keys(a), ...Object.keys(b)]);

  allKeys.forEach((key) => {
    if (!Object.prototype.hasOwnProperty.call(b, key)) {
      unset[key] = '';
    } else if (a[key] !== b[key]) {
      changes[key] = b[key];
    } else {
      const diff = getObjectDiff(a[key], b[key]);
      if (!isEmpty(diff.changes)) {
        changes[key] = b[key];
      }
      if (!isEmpty(diff.unset)) {
        unset[key] = '';
      }
    }
  });

  return { changes, unset };
};

/**
 * Sends an error response with a 400 status code
 *  @param {Object} res - The HTTP response object
 * @param {string} message - The error message to include in the response
 * @param {Array|Object} errors - Additional error details to include in the response
 * @returns {Object} The HTTP response with the error details
 */
export const errorResponse = (res, message, errors) => res.status(400).json({ message, errors });

export const loadJSON = (path) => {
  const fileUrl = new URL(path, import.meta.url);
  return JSON.parse(fs.readFileSync(fileUrl, 'utf8'));
};
