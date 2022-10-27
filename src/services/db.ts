import { Sequelize } from 'sequelize';
import dotenv from 'dotenv-flow';
dotenv.config({ silent: true });

const { DB_HOST, DB_PORT, DB_USER, DB_DB, DB_PASSWORD } = process.env;
export const sequelize = new Sequelize(DB_DB!, DB_USER!, DB_PASSWORD!, {
  host: DB_HOST,
  port: +DB_PORT!,
  dialect: 'postgres',
  logging: false,
  define: {
    timestamps: false,
  },
});

export const startDb = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
  } catch (e) {
    console.log(e);
  }
};
