import express from 'express';
const router = express.Router();
import { CommentController } from '../controller';

/* GET users listing. */
router.get('/', CommentController.index);

router.post('/create', CommentController.create);
router.post('/update', CommentController.update);

export default router;
