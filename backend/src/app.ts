import  databaseConnection  from '@root/setupDatabase';
import express, { Express } from 'express';
import {AppServer} from '@root/server';


const initilize = (): void => {
  databaseConnection();
  const app: Express = express();
    const server = new AppServer(app);
    server.start()
    
};

initilize();
