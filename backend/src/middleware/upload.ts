import multer from 'multer';
import { Request, Response, NextFunction } from 'express';

const upload = multer({ storage: multer.diskStorage({}) });
const uploadImage = (req: Request, res: Response, next: NextFunction) => {
  upload.single('profilePhoto')(req, res, (_err) => {
    const { profilePhoto } = req.body;

    if (profilePhoto !== 'null' && !req.file) {
      req.body['profilePhoto'] = 'original';
      next();
    } else if (req.file?.path) {
      req.body['profilePhoto'] = req.file?.path;
      next();
    } else {
      req.body['profilePhoto'] = 'default';
      next();
    }
  });
};

export { uploadImage };
