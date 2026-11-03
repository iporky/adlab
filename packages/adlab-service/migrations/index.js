/* eslint-disable no-console */
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import _ from 'lodash';
import libConfig from '@tfs/node-config';
import RAW_CONFIG from '../config/service-template.json' assert { type: 'json' };
import { establishDBConnection, db, isDBReplicaSet } from '../lib/drivers/database.js';
import * as Constants from '../lib/constants.js';
import { extractFromProcessArgvs } from '../lib/util.js';

const _config = libConfig.fromObject(RAW_CONFIG);
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = {
  locals: { _config, logger: console },
};

const { Schema } = db;

export const migrationSchema = new Schema({
  file: { type: String, required: true },
  appliedOn: { type: Date, default: Date.now },
  state: { type: String, required: true, enum: ['up', 'down'] },
});

export const MigrationModel = db.model('Migration', migrationSchema, _config.get(Constants.MIGRATIONS_COLLECTION_NAME));

export const createMigrationFile = (name) => {
  console.log('Creating migrations file...');
  try {
    const createdAt = new Date();
    const fileName = `${createdAt.getFullYear()}${String(createdAt.getMonth() + 1).padStart(2, '0')}${String(createdAt.getDate()).padStart(2, '0')}${String(createdAt.getHours()).padStart(2, '0')}${String(createdAt.getMinutes()).padStart(2, '0')}${String(createdAt.getSeconds()).padStart(2, '0')}-${name}.${_config.get(Constants.MIGRATIONS_FILE_EXTENSION)}`;
    const filePath = path.join(__dirname, 'scripts', fileName);

    const content = `
export const up = async (db, session) => {
  // Migration logic for upgrading
};

export const down = async (db, session) => {
  // Migration logic for downgrading
};
    `;

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Migration file created at ${filePath}`);
  } catch (error) {
    console.error('Error creating migrations file:', error);
    process.exit(1);
  }
};

const runUpScripts = async () => {
  const completedMigrations = await MigrationModel.find({ state: 'up' }).select('file');
  const completedFiles = completedMigrations.map((migration) => migration.file);
  const scriptsDir = path.join(__dirname, 'scripts');
  const files = fs.readdirSync(scriptsDir);
  const migratedFiles = [];

  let session;
  let isDBReplicaSetEnabled = await isDBReplicaSet(app);

  if (isDBReplicaSetEnabled) {
    session = await db.startSession();
    session.startTransaction();
    console.log('Starting transaction...');
  } else console.warn('Not connected to a replica set. Transactions will be ignored.');

  try {
    for (const file of files) {
      if (file.endsWith(_config.get(Constants.MIGRATIONS_FILE_EXTENSION)) && !completedFiles.includes(file)) {
        const scriptPath = path.join(scriptsDir, file);
        const script = await import(scriptPath);
        if (isDBReplicaSetEnabled) {
          await script.up(db, session);
        } else {
          await script.up(db);
        }
        migratedFiles.push(file);
      }
    }
    if (!_.isEmpty(migratedFiles)) {
      console.log('Creating migration records...', migratedFiles);
      await MigrationModel.create(migratedFiles.map((file) => ({ file, state: 'up' })));
    }

    if (isDBReplicaSetEnabled) {
      await session.commitTransaction();
      console.log('Transaction committed...');
    }
  } catch (error) {
    console.error('Error running migrations:', error);
    if (isDBReplicaSetEnabled) {
      await session.abortTransaction();
      console.log('Transaction aborted...');
    }
    throw error;
  } finally {
    if (isDBReplicaSetEnabled) {
      await session.endSession();
      console.log('Session ended...');
    }
  }

  return migratedFiles;
};

const runDownScripts = async () => {
  const lastMigration = await MigrationModel.findOne({ state: 'up' }).sort({ _id: -1 }).select('file');

  if (!lastMigration) {
    return [];
  }

  const scriptPath = path.join(__dirname, 'scripts', lastMigration.file);
  const script = await import(scriptPath);
  await script.down(db);

  await MigrationModel.updateOne({ file: lastMigration.file, state: 'up' }, { state: 'down' });

  return [lastMigration.file];
};

const listMigrationHistory = async () => {
  console.log('Migration history:');
  const migrations = await MigrationModel.find().sort({ appliedOn: 1 });
  const migrationData = migrations.map((migration, index) => ({
    Index: index + 1,
    File: migration.file,
    State: migration.state,
    AppliedOn: migration.appliedOn,
  }));
  console.table(migrationData);
};

const main = async () => {
  const command = process.argv[2];

  if (command !== 'create') {
    const argVars = extractFromProcessArgvs(process.argv, ['MONGODB_URL', 'DB_NAME']);
    for (const [k, v] of Object.entries(argVars)) {
      process.env[k] = v;
    }

    try {
      await establishDBConnection(app);
    } catch (error) {
      console.error('Error connecting to database:', error);
      process.exit(1);
    }
  }

  switch (command) {
    case 'create':
      const name = process.argv[3];
      if (name) {
        createMigrationFile(name);
      } else {
        console.error('Please provide a name for the migrations file.');
      }
      break;
    case 'up':
      runUpScripts().then((migratedFiles) => {
        if (_.isEmpty(migratedFiles)) {
          console.log('No migrations to run');
          process.exit(0);
        }
        console.log('Migrations completed successfully');
        console.group('Migrated files:');
        migratedFiles.forEach((file, index) => console.log(`${index + 1}. ${file}`));
        console.groupEnd();
        process.exit(0);
      });
      break;
    case 'down':
      runDownScripts().then((migratedFiles) => {
        if (_.isEmpty(migratedFiles)) {
          console.log('No migrations to rollback');
          process.exit(0);
        }
        console.log('Rollback completed successfully');
        console.group('Rolled back files:');
        migratedFiles.forEach((file, index) => console.log(`${index + 1}. ${file}`));
        console.groupEnd();
        process.exit(0);
      });
      break;
    case 'history':
      listMigrationHistory().then(() => {
        process.exit(0);
      });
      break;
    default:
      console.error(`Invalid Command '${command}'.`);
      console.log(`
Available options:
create <name>                                                  - Create a new migration file
up [MONGODB_URL=<database-url>] [DB_NAME=<database-name>]      - Apply all pending migrations
down [MONGODB_URL=<database-url>] [DB_NAME=<database-name>]    - Rollback the last applied migration
history [MONGODB_URL=<database-url>] [DB_NAME=<database-name>] - List the history of applied migrations
      `);
      process.exit(1);
  }
};

main();
