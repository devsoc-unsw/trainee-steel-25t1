declare module 'multer-s3' {
  import { S3Client } from '@aws-sdk/client-s3';
  import { Request } from 'express';
  import { StorageEngine } from 'multer';

  interface MulterS3Options {
    s3: S3Client;
    bucket: string;
    key: (req: Request, file: Express.Multer.File, cb: (error: any, key?: string) => void) => void;
    contentType?: any;
  }

  function multerS3(options: MulterS3Options): StorageEngine;
  
  namespace multerS3 {
    const AUTO_CONTENT_TYPE: any;
  }

  export = multerS3;
} 