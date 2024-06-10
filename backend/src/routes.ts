import { Application } from 'express';
import { healthRoutes } from '@root/routes/health';
import { authRoutes } from './routes/authRoutes';
import { authMiddleware } from './shared/globals/helpers/auth-middleware';
import { documentRoutes } from './routes/documentRoutes';

const BASE_PATH = '/api/v1';

const appRoutes = (app: Application): void => {
  app.use('', healthRoutes());
  app.use(BASE_PATH, authRoutes.routes());
  app.use(BASE_PATH, authMiddleware.verifyUser, authRoutes.signoutRoute());
  app.use(BASE_PATH, authMiddleware.verifyUser,  authRoutes.userRoute());
  app.use(BASE_PATH, authMiddleware.verifyUser,  documentRoutes.routes());
};

export { appRoutes };
