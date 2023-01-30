import { Express, Router } from 'express';
const router = Router();
import  funcs from '../controllers/userController'

router.post('/', funcs.registerUser)
router.post('/login', funcs.loginUser)
// TODO - add getMe route

export default router