import { Router } from 'express';
import * as multer from 'multer';

import StatusController from '@app/controllers/StatusController';
import FileController from '@app/controllers/FileController';

const routes = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // no larger than 10mb
  }
});

// ----------------- public routes ------------------------
routes.get('', StatusController.redirect);
routes.get('/status', StatusController.status);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
