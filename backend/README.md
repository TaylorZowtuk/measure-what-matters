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

Then navigate to [http://localhost:3000/api](http://localhost:3000/api)
**_Note:_** 3000 is the default port. Remember to use the port you have set in main.ts in the backend/src.

## License

**TODO** Add a license
