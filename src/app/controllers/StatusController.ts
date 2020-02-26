import { Request, Response } from 'express';

/**
 * Controller for return a simple status of server
 */
class StatusController {
  status(_: Request, res: Response) {
    const dataAtual: Date = new Date();
    return res.json({ app: 'FIREBASE - STORAGE', time: new Date() });
  }
}

export default new StatusController();
