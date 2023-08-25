import { Router } from 'express';
import { findAllTask, createTask, findTask, updateTask } from '../controllers/task.controller';
import { validateId, validateTask } from '../middleware/validation';
import { verifyTokenMiddleware } from '../middleware/verifyTokenMiddleware';
const router = Router();

router.get('/list', [verifyTokenMiddleware, findAllTask]);
router.get('/detail/:id', [verifyTokenMiddleware, validateId, findTask]);
router.post('/add', [verifyTokenMiddleware, validateTask, createTask]);
router.put('/edit/:id', [verifyTokenMiddleware, validateId, updateTask]);

export { router as taskRoute };
