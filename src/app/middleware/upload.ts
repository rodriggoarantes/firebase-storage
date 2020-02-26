import { NextFunction, Request, Response } from 'express';
import * as Busboy from 'busboy';
import * as fs from 'fs-extra';
import * as os from 'os';
import * as path from 'path';

export interface Options extends busboy.BusboyConfig {
  multipartOnly?: boolean;
  uploadPath?: string;
  files?: string[] | boolean;
}

export const defaultOptions: Options = {
  multipartOnly: true,
  uploadPath: os.tmpdir(),
  files: []
};

export interface File {
  fieldname: string;
  filename: string;
  path: string;
  encoding?: string;
  mimetype?: string;
  size?: number;
}

export interface Files {
  [key: string]: File[];
}

declare global {
  namespace Express {
    interface Request {
      files: Files;
    }
  }
}

export class UploadFile {
  private options: Options = defaultOptions;

  constructor(customOptions: Options) {
    this.options = Object.assign({}, this.options, customOptions || {});
  }

  public middleware(req: Request, res: Response, next: NextFunction) {
    try {
      if (this.isNotToDo(req)) {
        next();
      }

      const uploads: any = {};
      const busboy = new Busboy({ headers: req.headers });

      if (this.options.files) {
        const fileWritePromises: Array<Promise<void>> = [];

        busboy.on('file', (fieldname, file, filename) => {
          console.log(`Processed file ${filename}`);
          const filepath = path.join(this.options.uploadPath, filename);
          uploads[fieldname] = filepath;

          const writeStream = fs.createWriteStream(filepath);
          file.pipe(writeStream);

          const promise = new Promise<void>((resolve, reject) => {
            file.on('end', async () => {
              const stats = await fs.stat(filepath);

              if (!req.files.hasOwnProperty(fieldname)) {
                req.files[fieldname] = [];
              }

              req.files[fieldname].push({
                fieldname,
                path: filepath,
                size: stats.size,
                filename
              });

              writeStream.end();
            });
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
          });
          fileWritePromises.push(promise);
        });

        busboy.on('finish', async () => {
          await Promise.all(fileWritePromises);
          next();
        });
      }
    } catch (error) {}
  }

  private isNotToDo(req: Request) {
    return (
      this.isNotPost(req.method) ||
      this.isNotMultipart(req.headers['content-type']) ||
      this.isNotContains()
    );
  }

  private isNotPost(method: string) {
    return method !== 'POST';
  }

  private isNotMultipart(contentType: string) {
    return (
      this.options.multipartOnly &&
      (!contentType || !contentType.includes('multipart/form-data'))
    );
  }

  private isNotContains() {
    const fields = this.options.fields;
    const files = this.options.files;
    return (
      (!fields || (fields instanceof Array && !fields.length)) &&
      (!files || (files instanceof Array && !files.length))
    );
  }
}

export default new UploadFile({}).middleware;
