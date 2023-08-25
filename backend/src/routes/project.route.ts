import { Router } from 'express';
import {
  findAllProject,
  createProject,
  updateProject,
  findProject,
  deleteProject,
} from '../controllers/project.controller';
import { validateId, validateProject } from '../middleware/validation';
import { verifyTokenMiddleware } from '../middleware/verifyTokenMiddleware';

const router = Router();

router.get('/list', [verifyTokenMiddleware, findAllProject]);
router.get('/detail/:id', [verifyTokenMiddleware, validateId, findProject]);
router.post('/add', [verifyTokenMiddleware, validateProject, createProject]);
router.put('/edit/:id', [verifyTokenMiddleware, validateId, updateProject]);
router.delete('/delete/:id', [verifyTokenMiddleware, validateId, deleteProject]);

export { router as projectRoute };
