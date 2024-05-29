import { Router } from 'express';
import { registerUser } from '../controller/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
const router = Router();

router.route('/register').post(
  upload.fields([
    {
      name: 'avatar', //same in frontend as well
      maxCount: 1,
    },
    {
      name: 'profileImage',
      macCount: 1,
    },
  ]),
  registerUser
);

export default router;
