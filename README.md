# Kehu

Kehu is a social web service for members of the trade union Tradenomiliitto. It is up and running at https://www.mykehu.fi

#### Frontend

You can find JavaScript and SCSS under /client directory, from where they are build and bundled with webpack.

Frontend is build using old school React and Redux. No CRA, TS or other gimmicks at this time.

[index.js](client/index.js) is the entry point for "private" Single Page App section of the application, and [public.js](client/public.js) (contains only styles) entry point to the "public" section of application (blog etc.).

JavaScript for public section of the application is included in related pug template files, such as [\_header.pug](views/_header.pug).

#### Backend

Kehu backend is build with Express and uses PostgreSQL database for storing model data and Redis for storing user sessions. You need them both
to run the application. NodeJS backend accesses database through [Objection.js](https://vincit.github.io/objection.js/) ORM (build on top of [Knex](https://knexjs.org)).

User management and authentication are handled using Auth0 with Passport library.

Blog content is managed with Contentful headless CMS.

#### Localization

[i18next](https://www.i18next.com/) internationalization framework is used for localization. Localization files are stored in _public/locales_ directory.

In the private SPA section of the app [react-i18next](https://react.i18next.com/) is used and the localizations are extracted from the code using Babel plugin [babel-plugin-i18next-extract](https://i18next-extract.netlify.app/). The plugin is configured in _.babelrc_ file.

The public section of the app uses [i18next-http-middleware](https://github.com/i18next/i18next-http-middleware) and the translation keys are extracted from the pug-files either manually or using a helper script `extract-i18n-pug.sh` which creates a _dummy.js_ file. If that file is imported in _client/index.js_ file then Babel plugin extracts those keys as well.

#### Testing

Unit tests are run with [Jest](https://jestjs.io) and e2e tests with [Nightwatch.js](https://nightwatchjs.org).

### Local Development

Setup environment variables by copying .env-template and fill in needed variables.

```
$ cp .env-template .env
```

Install dependencies:

```
$ npm install
```

Run migrations and seeds:

```
$ npx knex migrate:latest
$ npx knex seed:run
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

### Deployment

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

### License

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with this program. If not, see http://www.gnu.org/licenses/.
