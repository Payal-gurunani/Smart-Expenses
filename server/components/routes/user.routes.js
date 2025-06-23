import {Router} from 'express';
import { Register,loginUser,logoutUser } from '../controllers/user.controller.js';
import {authenticateUser} from '../middleware/authMiddleware.js'

const router = Router();
router.route('/register').post(Register);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);
router.route('/check-auth').get(authenticateUser , (req, res) => {
  res.status(200).json({ message: 'User is authenticated', user: req.user });
});
export default router;
