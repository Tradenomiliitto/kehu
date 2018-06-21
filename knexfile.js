require("dotenv").config({ silent: true });
let pg = require("pg");
pg.defaults.ssl = true;

module.exports = {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./kehu_database.sqlite"
    },
    migrations: {
      tableName: "knex_migrations"
    }
  },
  production: {
    client: "postgresql",
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  }
};
