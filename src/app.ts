import 'dotenv/config';

import * as dotenv from 'dotenv';
import * as express from 'express';
import { Application } from 'express';

import * as cors from 'cors';
import * as helmet from 'helmet';

import fbConfig from './config/firebase';
import * as admin from 'firebase-admin';

import 'express-async-errors';

import routes from './routes';

export default class App {
  public server: Application;
  public port: number = 3333;

  constructor() {
    this.server = express();

    this.config();
    this.database();
    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  private config() {
    dotenv.config();
    process.env.NODE_ENV = process.env.NODE_ENV || 'develop';
    process.env.PORT = String(this.port);
  }

  private database() {
    admin.initializeApp({
      credential: admin.credential.cert(fbConfig.firebase),
      databaseURL: fbConfig.databaseURL,
      storageBucket: fbConfig.bucket
    });
  }

  private middlewares() {
    // CORS
    this.server.use(cors());
    this.server.use(express.json());
    this.server.use(helmet());
  }

  private routes() {
    this.server.use(routes);
  }

  private exceptionHandler() {
    this.server.use(
      async (
        err: express.ErrorRequestHandler,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        const error = typeof err === 'string' ? err : JSON.stringify(err);
        return res.status(500).json({
          message: 'Erro interno não esperado',
          error
        });
      }
    );
  }

  public listen() {
    this.server.listen(process.env.PORT, () => {
      console.log(`App listening on the http://localhost:${process.env.PORT}`);
    });
  }
}
