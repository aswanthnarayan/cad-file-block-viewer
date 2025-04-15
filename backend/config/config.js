require('dotenv').config();
const { Sequelize } = require('sequelize');

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'cad_file_viewer';
const DB_PORT = process.env.DB_PORT || 5432;
const NODE_ENV = process.env.NODE_ENV || 'development';

const config = {
  development: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'postgres',
    logging: false,
  },
  production: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'postgres',
    logging: false,
    ssl: true,
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false }
    },
  },
};

const envConfig = config[NODE_ENV] || config.development;

const sequelize = new Sequelize(envConfig.database, envConfig.username, envConfig.password, envConfig);

module.exports = sequelize;