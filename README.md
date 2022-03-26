# Kehu

Kehu is a social web service for members of the trade union Tradenomiliitto. It is up and running at https://www.mykehu.fi

## Frontend

You can find JavaScript and SCSS under /client directory, from where they are build and bundled with webpack.

Frontend is build using old school React and Redux. No CRA, TS or other gimmicks at this time.

[index.js](client/index.js) is the entry point for "private" Single Page App section of the application, and [public.js](client/public.js) (contains only styles) entry point to the "public" section of application (blog etc.).

JavaScript for public section of the application is included in related pug template files, such as [\_header.pug](views/_header.pug).

## Backend

Kehu backend is build with Express and uses PostgreSQL database for storing model data and Redis for storing user sessions. You need them both
to run the application. NodeJS backend accesses database through [Objection.js](https://vincit.github.io/objection.js/) ORM (build on top of [Knex](https://knexjs.org)).

User management and authentication are handled using Auth0 with Passport library.

Blog content is managed with Contentful headless CMS.

## Localization

[i18next](https://www.i18next.com/) internationalization framework is used for localization. Localization files are stored in _public/locales_ directory.

In the private SPA section of the app [react-i18next](https://react.i18next.com/) is used and the localizations are extracted from the code using Babel plugin [babel-plugin-i18next-extract](https://i18next-extract.netlify.app/). Translation default values (i.e. `t("translation key", "default translation")`) are extracted to Finnish translations. The plugin is configured in _babel.config.json_ file and by default it is commented off since otherwise any change to default translation requires manual change in translation file. The best practise is

- Finalize part of the application.
- Uncomment plugin, run in and comment plugin again.
- Finnish translations now match the code. Manually translate other languages.

The public section of the app uses [i18next-http-middleware](https://github.com/i18next/i18next-http-middleware) and the translation keys are extracted from the pug-files either manually or using a helper script `extract-i18n-pug.sh` which creates a _dummy.js_ file. If that file is imported in _client/index.js_ file then Babel plugin extracts those keys as well.

## Image uploads

Profile and group pictures are uploaded to Cloudinary using secure upload with Cloudinary widget. Secure upload requires backend endpoint for signature generation (provided in `profiili/cloudinary-signature`). Uploaded files are processed with uploadPreset provided to widget. Following environment variables are required (first four can be copied directly from Cloudinary dashboard)

- `CLOUDINARY_URL`: cloud_name, api_key and api_secret required for backend connection
- `CLOUDINARY_SECRET`: secret used to sign uploads
- `REACT_APP_CLOUDINARY_API_KEY`: account api key
- `REACT_APP_CLOUDINARY_CLOUD_NAME`: cloud name for uploads
- `REACT_APP_CLOUDINARY_UPLOAD_PRESET`: upload preset name which contains instructions how uploaded images are processed (resizing etc.), defined in Cloudinary dashboard -> Settings -> Upload -> Upload presets

Following settings are required in the Cloudinary upload preset:

- Overwrite: true
- Invalidate: true
- Use filename or externally defined Public ID: true
- Unique filename: false
- Delivery type: upload
- Access mode: public
- Incoming Transformation: c_crop,g_custom/c_limit,h_512,w_512

## Testing

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

Relation mappings in Objection leads easily to circular dependencies (see [require loops](https://vincit.github.io/objection.js/guide/relations.html#require-loops) in documentation for more information). The solution is to use different `modelClass` properties in `static get relationMappings()` getter when defining models so the files are not requiring each other:

```js
// models/Group.js
const GroupMember = require("./GroupMember");
modelClass: GroupMember,

// models/GroupMember.js
modelClass: `${__dirname}/Group`,
```

### Migrations

- See completed and pending migrations `npx knex migrate:list`
- Create a new migration `npx knex migrate:make migration_name`
- Run pending migrations `npx knex migrate:latest`
- Undo last migration `npx knex migrate:down`

### Kehus

There are five different ways to create Kehus and it determines what values are used to populate the `Kehus` database table. In the table content and source for the some Kehu table column values are given. Asterix (\*) after the value indicates it is provided in the request body.

| How Kehu was created                                            | giver_id                 | giver_name                     | owner_id                 | receiver_name    | receiver_email                           | claim_id | group_id      | is_public      |
| --------------------------------------------------------------- | ------------------------ | ------------------------------ | ------------------------ | ---------------- | ---------------------------------------- | -------- | ------------- | -------------- |
| User adds a Kehu to himself (`POST /`)                          | `Users.id`\*<sup>1</sup> | user input\*                   | `Users.id`\*<sup>1</sup> | NULL             | NULL                                     | NULL     | NULL          | NULL           |
| User sends a Kehu to an existing Kehu user (`POST /laheta`)     | `Users.id`\*<sup>1</sup> | user's full name\*<sup>2</sup> | `Users.id` <sup>3</sup>  | user input\*     | email found from user database\*         | NULL     | NULL          | NULL           |
| User sends a Kehu to a new Kehu user (`POST /laheta`)           | `Users.id`\*<sup>1</sup> | user's full name\*<sup>2</sup> | NULL                     | user input\*     | email **NOT** found from user database\* | uuidv4   | NULL          | NULL           |
| User sends a Kehu to a user in a common group (`POST /yhteiso`) | `Users.id`<sup>4</sup>   | Sender's full name             | `Users.id` <sup>3</sup>  | user selection\* | user selection\*                         | NULL     | `Groups.id`\* | `true/false`\* |
| User sends a Kehu to a whole group (`POST /yhteiso`)            | `Users.id`<sup>4</sup>   | Sender's full name             | NULL                     | NULL             | NULL                                     | NULL     | `Groups.id`\* | `true`\*       |

1: Even though the `Users.id` value is provided in the request body it must match `req.user.id` (i.e. the logged in user's id).  
2: Field is not validated but frontend is using sender's `Users.first_name + Users.last_name`  
3: Id of the user whose email is in the `receiver_email` column  
4: Sender's user id (`req.user.id`)

## License

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with this program. If not, see http://www.gnu.org/licenses/.
