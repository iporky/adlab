import { mocks as repo } from 'adlab-shared';
import { RoleMappingModel } from '../../dal/schemas/roleMappings.js';

/* eslint-disable  no-console */
export async function up(db, session) {
  const count = await RoleMappingModel.countDocuments();
  if (count > 0) {
    throw new Error('Role mappings already exist in the database');
  }

  await RoleMappingModel.insertMany(repo.roleMappings, { session });
}

export async function down(db) {
  const deletePromises = repo.roleMappings.map((roleMapping) =>
    RoleMappingModel.deleteOne({
      ecRole: roleMapping.ecRole,
      applicationRole: roleMapping.applicationRole,
    }),);

  await Promise.all(deletePromises);
}
