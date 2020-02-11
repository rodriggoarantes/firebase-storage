import { Request, Response } from 'express';

/**
 * Controller for return a simple status of server
 */
class StatusController {
  redirect(_: Request, res: Response) {
    const urlroot = '/status';
    if (process.env.NODE_ENV !== 'develop') {
      res.redirect(`/api/${urlroot}`);
    }
    res.redirect(urlroot);
  }

  status(_: Request, res: Response) {
    return res.json({ app: 'FIREBASE - STORAGE', time: new Date() });
  }
}

export default new StatusController();
