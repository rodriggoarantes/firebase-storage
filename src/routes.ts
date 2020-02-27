import { Router } from 'express';

import uploadFileMiddleware from './app/middleware/upload';
import StatusController from '@app/controllers/StatusController';
import FileController from '@app/controllers/FileController';

const routes = Router();

// ----------------- public routes ------------------------
routes.get(['', '/', '/status'], StatusController.status);

routes.post('/files', uploadFileMiddleware, FileController.store);

export default routes;
