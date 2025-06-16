import {Router} from 'express';
import { Register,loginUser,logoutUser } from '../controllers/user.controller.js';


const router = Router();
router.route('/register').post(Register);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);

export default router;
