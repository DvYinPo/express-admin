import express from 'express';
const router = express.Router();
import { ProjectController } from '../controller';

/* GET users listing. */
router.get('/', ProjectController.index);

router.post('/create', ProjectController.create);
router.post('/update', ProjectController.update);

export default router;
