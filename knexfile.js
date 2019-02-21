// Update with your config settings.

require('dotenv').config()

module.exports = {
    client: 'mysql2',
    connection: {
        host: process.env.MYSQL_ADDRESS,
        user: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        typeCast: (field, next) => {
            // Cast TINYINTs to booleans
            if (field.type == 'TINY' && field.length == 1) {
                let value = field.string();
                return value ? (value == '1') : null;
            }
            return next();
        }
    },
    pool: { min: 0, max: 10 },
    migrations: {
        tableName: 'knex_migrations'
    },
    //debug: true,
};
