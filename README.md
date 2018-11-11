# Kehu

Kehu is a social web service for members of the trade union Tradenomiliitto. It is up and running at https://kehu.herokuapp.com/

### Local Development

Setup environment variables by copying .env-template `$ cp .env-template .env` and fill in needed variables.

Kehu application uses PostgreSQL database for storing model data and Redis for storing user sessions. You need them both
to run the application. NodeJS backend is build with Express and accesses database through Objection.js ORM.

User management and authentication are handled using Auth0 with Passport library.

You can find JavaScript and SCSS under /client directory, from where they are build and bundled with webpack.

Following npm scripts are available:

Build frontend assets once or in watch mode:

```
$ npm run build
$ npm run build:dev
```

Apply latest database migration:

```
$ npm run migrate:latest
```

Start server normally or in development mode:

```
$ npm start
$ npm run start:dev
```

Development server runs with nodemon and also builds and watches frontend asset changes and rebuilds when necessary.

Prettier is run on precommit hook for all staged files.

### Deployment

Kehu application runs on Heroku. Once new code is pushed to Heroku repository, postinstall hook builds assets and runs
latest database migrations.

```
$ git push heroku master
```

### License

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with this program. If not, see http://www.gnu.org/licenses/.
