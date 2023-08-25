import { Router } from 'express';
import { findAllReport, findReport, createReport, deleteReport } from '../controllers/report.controller';
import { validateId, validateReport } from '../middleware/validation';
import { verifyTokenMiddleware } from '../middleware/verifyTokenMiddleware';

const router = Router();

router.get('/list', [verifyTokenMiddleware, findAllReport]);
router.get('/detail/:id', [verifyTokenMiddleware, validateId, findReport]);
router.post('/add', [verifyTokenMiddleware, validateReport, createReport]);
router.delete('/delete/:id', [verifyTokenMiddleware, validateId, deleteReport]);

export { router as reportRoute };
