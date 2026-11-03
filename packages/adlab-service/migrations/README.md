# MongoDB Migrations

This directory contains in-house build utility and migration scripts for managing database migrations.
The migration scripts are used to apply changes to the database schema and data over time.

It uses the codebase's database driver(mongoose) to connect to the database and apply the migrations.
This gives options to use Mongoose Models created in the codebase to interact with the database.

**Note: The system ensure transactional guarantee whe running the migration scripts. But the mongo db instance should
have replicaSets enabled. If not do not pass {session} context to mongoose scripts, and you will loose transaction and rollbacks.**

```aiignore
export async function up(db, session) {
  await RoleMappingModel.insertMany(repo.roleMappings, { session });
}
```

The connection is established using the database URL and database name provided (optionally) as arguments to the migration
scripts (useful for Jenkins integration). If not provided, it falls back to configuration provided in the service-template.json file.

## Commands

### Create a Migration

To create a new migration file, run the following command:

```sh
pnpm run migrate-mongo create <migration-name>
```

Replace `<migration-name>` with a descriptive name for the migration. This will create a new migration file in the `scripts` directory.

### Run Migrations

To apply all pending migrations, run:

```sh
pnpm run migrate-mongo up [MONGODB_URL=<database-url>] [DB_NAME=<database-name>]
```

<span style="color: red;">**Note: When running scripts on container service with replica set,
add the container name to the system host file in '/etc/hosts' with the IP address of the container. Eg 127.0.0.1 mongodbpr1.
This is the fix for ReplicaSetNoPrimary error.**</span>

````sh

This command will connect to the specified database and apply all new migration scripts.

### Rollback Last Migration

To rollback the last applied migration, run:

```sh
pnpm run migrate-mongo down [MONGODB_URL=<database-url>] [DB_NAME=<database-name>]
````

This command will connect to the specified database and rollback the last applied migration.

### List Migration History

To list the history of applied migrations, run:

```sh
pnpm run migrate-mongo history [MONGODB_URL=<database-url>] [DB_NAME=<database-name>]
```

This command will connect to the specified database and display a table of all applied migrations.

## Migration File Structure

Each migration file should export two functions: `up` and `down`.

- `up`: This function contains the logic for applying the migration.
- `down`: This function contains the logic for reverting the migration.

Example migration file:

```javascript
export const up = async (db, session) => {
  // Migration logic for upgrading
};

export const down = async (db, session) => {
  // Migration logic for downgrading
};
```

**Note: Ensure to put a logical set of migration ops in a single up script and name the file appropriately.
Make sure to add meaning full rollback sequence in the down script**

## Configuration

Basic connection configuration for the migration scripts is located at `../config/service-template.json`. This file contains the database connection details and other configurations for the migration scripts.

```json
{
  "database": {
    "connection_url": {
      "value": "mongodb://localhost:27017",
      "_doc": "The URL of the MongoDB database"
    },
    "db_name": {
      "value": "adlab",
      "_doc": "The name of the MongoDB database"
    },
    ...
}
```

Additional configuration like migration collection name can be added to the configuration file.

```json
{
  "migrations": {
    "collection_name": {
      "value": "migration_changelogs",
      "_doc": "The name of the collection that stores the migration state"
    },
    "file_extension": {
      "value": "mig.js",
      "_doc": "The file extension of the migration files"
    },
    ...
  }
}
```

## Notes

- Ensure you have the necessary permissions to connect to the database.
- Always backup your database before running migrations or rollbacks.
- Review migration scripts carefully before applying them to a production database.

## Author

[24]7 Inc. (Anand Manickam)
