import { Request, Response } from 'express';

import fileService from '@app/services/FileService';

class FileController {
  async store(req: Request, res: Response) {
    if (!req.file) {
      return res.status(401).json({ message: 'file not found' });
    }

    const { originalname, buffer } = req.file;
    if (!originalname) {
      return res.status(401).json({ message: 'Invalid file for store' });
    }

    // send the file on memory to Firebase Storage
    const file = await fileService.uploadStream(buffer, originalname);
    return res.json(file);
  }
}

export default new FileController();
