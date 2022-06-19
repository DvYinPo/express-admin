import express from 'express';
const router = express.Router();
import { IssueController } from '../controller';

/* GET users listing. */
router.get('/', IssueController.index);

router.post('/create', IssueController.create);
router.post('/update', IssueController.update);

export default router;
