import * as admin from 'firebase-admin';

class FileService {
  /**
   * Save a buffer stream file on Firebase Storage, with blobStream
   * @param stream
   * @param filename
   */
  async uploadStream(stream: any, filename: string) {
    console.log(`uploadStream`);
    const finalFileName = `avatars/${this.hashName(filename)}`;

    console.log(`uploadStream: name : ${finalFileName}`);

    try {
      // get the bucket of Storage
      const storageBucket: any = admin.storage().bucket();

      // create file with hash name and folder 'avatars'
      const file = await storageBucket.file(finalFileName);

      console.log(`file: name : ${file.name}`);

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
    } catch (error) {
      console.log(`ERRO : ${error} ${JSON.stringify(error)}`);
    }

    return {};
  }

  /**
   * Generate a unique name, with a hash random string.
   * @param originalName
   */
  private hashName(originalName: string) {
    const dateStr = new Date().getTime();
    const ext =
      originalName && originalName.indexOf('.') > -1
        ? originalName.substring(
            originalName.indexOf('.') + 1,
            originalName.length
          )
        : 'jpeg';

    try {
      return `${dateStr}.${this.randHex(8)}.${ext}`;
    } catch (error) {
      console.log(`ERRO - hashName : ${error} ${JSON.stringify(error)}`);
    }

    return originalName;
  }

  private randHex(len: number): string {
    const maxlen = 8;
    const min = Math.pow(16, Math.min(len, maxlen) - 1);
    const max = Math.pow(16, Math.min(len, maxlen)) - 1;
    const n = Math.floor(Math.random() * (max - min + 1)) + min;

    let r = n.toString(16);
    while (r.length < len) {
      r = r + this.randHex(len - maxlen);
    }
    return r.toUpperCase();
  }
}

export default new FileService();
