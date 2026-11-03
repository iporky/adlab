/*
 * 24/7 Customer, Inc. Confidential, Do Not Distribute. This is an
 * unpublished, proprietary work which is fully protected under
 * copyright law. This code may only be used pursuant to a valid
 * license from 24/7 Customer, Inc.
 */
'use strict';

/**
 * Global constants
 */
export const SERVICE_NAME = 'adlab-service';
export const PARSER_BODY_LIMIT = 'parser.bodyLimit';
export const PARSER_JSON_LIMIT = 'parser.jsonLimit';
export const PARSER_URLENCODED_LIMIT = 'parser.urlencodedLimit';
export const LISTEN_PORT_CONFIG_KEY = 'listen.port';
export const KEEPALIVE_TIMEOUT_CONFIG_KEY = 'listen.keepAliveTimeout';
export const REQUEST_TIMEOUT_CONFIG_KEY = 'listen.requestTimeout';
export const HEARTBEAT_PATH_CONFIG_KEY = 'health.heartbeat-path';
export const H_24_IN_MS = 86400000;
export const USER_AGENT_NAME = 'user-agent';
export const X_TFS_ACCOUNT_ID = 'x-tfs-account-id';
export const X_TFS_CLIENT_ID = 'x-tfs-client-id';
export const X_TFS_USER_ID = 'x-tfs-user-id';
export const X_TFS_SERVICE_API_KEY = 'x-tfs-service-api-key';
export const UNPROTECTED_ROUTES = 'security.unprotectedRoutes';
export const AUTHORIZED_ROUTES = 'security.authorizedRoutes';
export const LOG_REGION = 'adlab-service';
export const SYSTEM_USER_ID = 'system';

/**
 * Value constants
 */
export const AD_PLATFORM = {
  TIKTOK: 'TikTok',
  SNAPCHAT: 'Snapchat',
};

export const AVAILABLE_PLATFORMS = Object.values(AD_PLATFORM);

export const AVAILABLE_STATUSES = [
  'CREATE PENDING',
  'UPDATE PENDING',
  'DELETE PENDING',
  'ACTIVE',
  'PAUSED',
  'ENABLE',
  'DISABLE',
  'DELETED',
  'CREATE FAILED',
  'UPDATE FAILED',
  'DELETE FAILED',
];
/**
 * Disabled header
 * @type {string}
 * @private
 */
export const X_POWERED_BY = 'x-powered-by';

/**
 * Header that reflects the active version of the service
 * Used by the health check
 * @type {string}
 * @private
 */
export const X_SERVICE_VERSION_HEADER = 'X-TFS-Service-Version';

/**
 * Common MIME types
 * @type {string}
 */
export const MIME_APP_URLENCODED = 'application/x-www-form-urlencoded';
export const MIME_APP_JSON = 'application/json';
export const MIME_APP_XML = 'application/xml';

/**
 * Body parser errors
 * @type {string}
 */
export const BODY_PARSER_ERR_REQUEST_ABORTED = 'request.aborted';

/**
 * Cors related constants
 */
export const ALLOWED_HOSTNAMES_REGEX = 'cors.allowed_hostnames';

/**
 * CSP related constants
 * @type {string}
 */
export const IS_CSP_ENABLED = 'csp.enabled';
export const CSP_DIRECTIVES = 'csp.directives';

/**
 * OKTA related constants
 */
export const IS_SECURITY_ENABLED = 'security.enabled';
export const OIDC_ISSUER = 'security.oidc.issuer';
export const OIDC_CLIENT_ID = 'security.oidc.client_id';

/**
 * Constants for the user service
 */
export const UMS_AUTH_ENABLED = 'security.ums.auth_enabled';
export const UMS_ISSUER = 'security.ums.issuer';
export const UMS_PRODUCT_ID = 'security.ums.product_id';

/**
 * MongoDB related constants
 */
export const DB_CONNECTION_URL = 'database.connection_url';
export const DB_NAME = 'database.db_name';
export const DB_CONNECTION_TIMEOUT = 'database.connect_timeout_ms';
export const DB_CONNECTION_SOCKET_TIMEOUT = 'database.socket_timeout_ms';

/**
 * Migration related constants
 */
export const MIGRATIONS_COLLECTION_NAME = 'migrations.collection_name';
export const MIGRATIONS_FILE_EXTENSION = 'migrations.file_extension';

/**
 * Cache Keys related constants
 */
export const USER_PERMISSIONS_CACHE_KEY = (userId) => `${userId}--permissions`;
export const TOKEN_CONFIG_CACHE_KEY = (platform) => `tokenConfig-${platform}`;
export const IS_DB_REPLICA_SET_CACHE_KEY = 'isDBReplicaSet';

/**
 * Advportal related constants
 */
export const ADVPORTAL_BASE_URL = 'advportal.base_url';
export const TURBO_BASE_URL = 'advportal.turbo_base_url';

