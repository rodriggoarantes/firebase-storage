import { Request, Response } from 'express';

import { File } from '@app/middleware/upload';
import fileService from '@app/services/FileService';

class FileController {
  async store(req: Request, res: Response) {
    console.log(`teste: ${req.body.name}`);

    if (!req.files) {
      return res.status(401).json({ message: 'file not found' });
    }

    if (req.files && req.files && req.files['file']) {
      const arquivo: File = req.files['file'][0];

      // send the file on memory to Firebase Storage
      const file = await fileService.uploadStream(
        arquivo.buffer,
        arquivo.filename
      );
      return res.json(file);
    }

    return res.status(401).json({ message: 'Invalid file for store' });
  }
}

export default new FileController();
