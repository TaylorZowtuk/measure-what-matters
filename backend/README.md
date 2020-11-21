## Installation

```bash
$ yarn install
```

## Using the development database

**Important**

- Will only work on unix-like operating systems.
- Be sure to have docker installed and running before executing any of the following.
- Ensure you are within the /backend directory when running these commands. It creates a data folder that depends on the path.

The following commands are available:

```
yarn run db:init // Creates a new container that will run the postgres server

yarn run db:start // Starts the postgres server

yarn run db:stop // Shuts down the postgres server

yarn run db:logs // Opens the running log output of the postgres server

yarn run db:cmd // Gives access to the postgres command line (To run query tests)

yarn run db:clean // Shuts down server, removes container, and deletes server files
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Swagger

In order to view the MWM Api documentation locally. Run

```bash
npm run start
```

Then navigate to [http://localhost:3001/api](http://localhost:3001/api)
**_Note:_** 3001 is the default port. Remember to use the port you have set in main.ts in the backend/src directory.

## License

**TODO** Add a license

## Migrations

Migrations are a way to synchronize database entity changes to the database. Once this is on `devel` all PRs will be _REQUIRED_ to generate a migration for any changes made to the entities.

To generate migrations, make sure your build is succeeding and the dist/ folder is up to date, also, ensure that the database is running.

The following command will scan your database and compare it with the entities in the dist folder. If it finds any changes it will generate a new file in the src/db/migrations directory.

`yarn migrations:generate -n <aNameWithSpacesDescribingTheChange>`

Next time you start the backend the changes will be synced to the database. Make sure you don't generate and run the same migration twice as this will cause issues and you may have to delete your /dist folder and clean the db.

A note: Since we are no longer using `sync: true` you will have to generate migrations and restart the backend to see the changes reflected in the database. So if you are getting `column not errors` etc. it is likely that you just need to do the migration.
