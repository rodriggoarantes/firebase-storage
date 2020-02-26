import { Router } from 'express';

import StatusController from '@app/controllers/StatusController';
import FileController from '@app/controllers/FileController';

const routes = Router();

// ----------------- public routes ------------------------
routes.get(['', '/', '/status'], StatusController.status);

routes.post('/files', FileController.store);

export default routes;
