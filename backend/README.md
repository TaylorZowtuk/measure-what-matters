
## Installation

```bash
$ npm install
```

## Using the development database

**Important**
- Will only work on unix-like operating systems. 
- Be sure to have docker installed and running before executing any of the following. 
- Ensure you are within the /backend directory when running these commands. It creates a data folder that depends on the path.

The following commands are available:
```
npm run db:init // Creates a new container that will run the postgres server

npm run db:start // Starts the postgres server

npm run db:stop // Shuts down the postgres server

npm run db:logs // Opens the running log output of the postgres server

npm run db:cmd // Gives access to the postgres command line (To run query tests)

npm run db:clean // Shuts down server, removes container, and deletes server files
```



## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

  **TODO** Add a license
