import express from 'express';
import memberController from './controllers/member.controller';
const router = express.Router();

/*** Member ***/
router.post('/member/login', memberController.login);
router.post('/member/signup', memberController.signup);
router.get('/member/detail', memberController.verifyAuth);

/*** Product ***/

/*** Order ***/



export default router;