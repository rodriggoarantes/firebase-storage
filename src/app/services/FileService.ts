import * as admin from 'firebase-admin';
import * as crypto from 'crypto';
import { extname } from 'path';

class FileService {
  /**
   * Save a buffer stream file on Firebase Storage, with blobStream
   * @param stream
   * @param filename
   */
  async uploadStream(stream: any, filename: string) {
    const ext = extname(filename);
    const finalFileName = `avatars/${this.hashName(filename)}${ext}`;

    // get the bucket of Storage
    const storageBucket: any = admin.storage().bucket();
    // create file with hash name and folder 'avatars'
    const file = await storageBucket.file(finalFileName);

    const blobStream = file.createWriteStream({
      gzip: true,
      destination: finalFileName,
      public: true,
      metadata: {
        contentType: 'image/jpeg',
        cacheControl: 'public, max-age=31536000'
      }
    });
    await blobStream.end(stream);

    return {
      filename: file.name,
      url: `https://storage.googleapis.com/aircnc-server.appspot.com/${file.name}`
    };
  }

  /**
   * Generate a unique name, with a hash random string.
   * @param originalName
   */
  private hashName(originalName: string) {
    const dateStr = new Date().getTime();
    const nameKey = originalName + dateStr;
    const hashname = crypto
      .createHash('md5')
      .update(nameKey)
      .digest('hex');
    return hashname;
  }
}

export default new FileService();
