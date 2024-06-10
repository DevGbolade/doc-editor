import mongoose from 'mongoose';
import { config } from '@root/config';
import Logger from './logger'; 

const logger = new Logger('DatabaseServer', 'debug');
export default () => {
  const connect = () => {
    mongoose
      .connect(`${config.DATABASE_URL}`)
      .then(() => {
        logger.info('Database successfully connected');
      })
      .catch((error: Error) => {
        logger.error(`Error while connecting to the database: ${error}`);
        return process.exit(1);
      });
  };

  connect();
  mongoose.connection.on('disconnect', connect);
};
