import multer from 'multer';

declare global {
  namespace Express {
    interface Request {
      user?: any;
      file?: multer.File;  
      
    }
  }
}
