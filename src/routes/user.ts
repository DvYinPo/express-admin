import express from 'express';
const router = express.Router();
import { UserController } from '../controller';

/* GET users listing. */
router.get('/', UserController.index);

router.post('/register', UserController.register);

router.post('/login', UserController.login);

router.get('/code/:phone', UserController.code);

export default router;
