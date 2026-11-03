import { db } from '../../lib/drivers/database.js';

export { validateDBObjectId } from '../../lib/util.js';

const { Schema } = db;

const roleMappingSchema = new Schema({
  _id: Schema.Types.ObjectId,
  ecRole: String,
  applicationRole: String,
  permissions: [String],
});

export const RoleMappingModel = db.model('RoleMapping', roleMappingSchema, 'role_mappings');
