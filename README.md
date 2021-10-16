# Kehu

Kehu is a social web service for members of the trade union Tradenomiliitto. It is up and running at https://www.mykehu.fi

### Frontend

You can find JavaScript and SCSS under /client directory, from where they are build and bundled with webpack.

Frontend is build using old school React and Redux. No CRA, TS or other gimmicks at this time.

[index.js](client/index.js) is the entry point for "private" Single Page App section of the application, and [public.js](client/public.js) (contains only styles) entry point to the "public" section of application (blog etc.).

JavaScript for public section of the application is included in related pug template files, such as [\_header.pug](views/_header.pug).

### Backend

Kehu backend is build with Express and uses PostgreSQL database for storing model data and Redis for storing user sessions. You need them both
to run the application. NodeJS backend accesses database through [Objection.js](https://vincit.github.io/objection.js/) ORM (build on top of [Knex](https://knexjs.org)).

User management and authentication are handled using Auth0 with Passport library.

Blog content is managed with Contentful headless CMS.

### Localization

[i18next](https://www.i18next.com/) internationalization framework is used for localization. Localization files are stored in _public/locales_ directory.

In the private SPA section of the app [react-i18next](https://react.i18next.com/) is used and the localizations are extracted from the code using Babel plugin [babel-plugin-i18next-extract](https://i18next-extract.netlify.app/). The plugin is configured in _.babelrc_ file.

The public section of the app uses [i18next-http-middleware](https://github.com/i18next/i18next-http-middleware) and the translation keys are extracted from the pug-files either manually or using a helper script `extract-i18n-pug.sh` which creates a _dummy.js_ file. If that file is imported in _client/index.js_ file then Babel plugin extracts those keys as well.

### Testing

Unit tests are run with [Jest](https://jestjs.io). The unit test files are located within the source code files and
they follow the `*.test.js` naming convention.

E2e tests are run with [Nightwatch.js](https://nightwatchjs.org) and the test files are in `tests` folder.
Use `npx nightwatch --headless` to run tests in headless mode.

Note: e2e tests use Chrome and Chromedriver and their versions has to match. Check Chrome's version and install matching Chromedriver if not already installed:

```bash
$ google-chrome --version
Google Chrome 90.0.4430.212
$ npm install chromedriver@90
```

## Local Development

Setup environment variables by copying .env-template and fill in needed variables.

```
$ cp .env-template .env
```

Install dependencies:

```
$ npm install
```

Run migrations and seeds OR restore from existing database dump (see below how to download dump from Heroku):

```bash
# Option 1: Initialize empty database
$ npx knex migrate:latest
$ npx knex seed:run

# Option 2: Restore database dump
$ pg_restore --verbose --clean --no-acl --no-owner -h localhost -U YOUR_USERNAME -d DATABASE_NAME latest.dump
```

Run [nodemon](https://nodemon.io) server for Express backend and Webpack for frontend in watch mode:

```
$ npm run start:dev
```

Run all (e2e + unit) tests or jest in watch mode:

```
$ npm run test
$ npm run jest:watch
```

## Deployment

Prettier is run on precommit hook for all staged files.

Kehu application runs on Heroku. Once new code is pushed to Heroku repository, postinstall hook builds assets and runs
latest database migrations.

There is QA environment running at https://beta.mykehu.fi and production environment at https://www.mykehu.fi. The applications have separate databases, but share the same Auth0 and SendGrid instance.

`develop` branch matches the code deployed on QA, and `master` matches the code deployed on production.

Add remotes with heroku-cli

```bash
$ heroku git:remote --app=kehu-beta --remote=heroku-beta
$ heroku git:remote --app=kehu --remote=heroku-prod
```

Then deploy by pushing to the remote

```
$ git push heroku-beta develop:master
$ git push heroku-prod master
```

## Database backups

### Heroku

Use the following commands to view, create and download database dumps from Heroku

```bash
# View existing backups
$ heroku pg:backups --app kehu

# Create a new backup
$ heroku pg:backups:capture --app kehu

# Download latest backup
$ heroku pg:backups:download --app kehu
```

### Local

Export local database using Postgres custom compressed format

```bash
$ pg_dump --host=localhost --username=YOUR_USERNAME --format=custom DATABASE_NAME > kehudb_`date +%Y%m%d`.dump
```

### Import backup

```bash
$ pg_restore --verbose --clean --no-acl --no-owner -h localhost -U YOUR_USERNAME -d DATABASE_NAME latest.dump
```

## Database models

### Migrations

- See completed and pending migrations `npx knex migrate:list`
- Create a new migration `npx knex migrate:make migration_name`
- Run pending migrations `npx knex migrate:latest`
- Undo last migration `npx knex migrate:down`

### Kehus

There are four different ways to create Kehus:

| How Kehu was created                          | giver_id  | giver_name                      | owner_id           | receiver_name                    | receiver_email                         | claim_id | group_id   | is_public                        |
| --------------------------------------------- | --------- | ------------------------------- | ------------------ | -------------------------------- | -------------------------------------- | -------- | ---------- | -------------------------------- |
| User adds a Kehu to himself                   | `user_id` | user input when adding the Kehu | `user_id`          | NULL                             | NULL                                   | NULL     | NULL       | NULL                             |
| User sends a Kehu to an existing Kehu user    | `user_id` | `user_name`                     | `receiver_user_id` | user input when sending the Kehu | email found from user database         | NULL     | NULL       | NULL                             |
| User sends a Kehu to a new Kehu user          | `user_id` | `user_name`                     | NULL               | user input when sending the Kehu | email **NOT** found from user database | uuidv4   | NULL       | NULL                             |
| User sends a Kehu to a user in a common group | `user_id` | `user_name`                     | `receiver_user_id` | `receiver_name`                  | `receiver_email`                       | NULL     | `group_id` | `true/false` based on user input |
| User sends a Kehu to a whole group            | `user_id` | `user_name`                     | NULL               | `group_name`                     | NULL                                   | NULL     | `group_id` | `true`                           |

## License

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with this program. If not, see http://www.gnu.org/licenses/.
