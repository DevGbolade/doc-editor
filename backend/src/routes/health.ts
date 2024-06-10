import { health } from '@root/controllers/health';
import express, { Router } from 'express';

const router: Router = express.Router();

const healthRoutes = (): Router => {
  router.get('/health', health);

  return router;
};

export { healthRoutes };
