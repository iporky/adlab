import { db } from '../../lib/drivers/database.js';
import * as Constants from '../../lib/constants.js';

export { validateDBObjectId } from '../../lib/util.js';

const userPermissionsSchema = new db.Schema({
  userId: String,
  permissions: Object,
  createdAt: { type: Date, default: Date.now, expires: Constants.H_24_IN_MS },
});

export const UserPermissionsModel = db.model('UserPermissions', userPermissionsSchema, 'user_permissions');
