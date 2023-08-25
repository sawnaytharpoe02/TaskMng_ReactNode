import { Router } from 'express';
import {
  createEmployee,
  deleteEmployee,
  findAllEmployee,
  findEmployee,
  updateEmployee,
} from '../controllers/employee.controller';
import { uploadImage } from '../middleware/upload';
import { validateEmployee, validateId } from '../middleware/validation';
import { verifyTokenMiddleware, verifyDeleteUserMiddleware } from '../middleware/verifyTokenMiddleware';
const router = Router();

router.get('/list', [verifyTokenMiddleware, findAllEmployee]);
router.get('/detail/:id', [verifyTokenMiddleware, validateId, findEmployee]);
router.post('/add', [verifyTokenMiddleware, uploadImage, validateEmployee, createEmployee]);
router.put('/edit/:id', [verifyTokenMiddleware, uploadImage, updateEmployee]);
router.delete('/delete/:id', [verifyTokenMiddleware, validateId, verifyDeleteUserMiddleware, deleteEmployee]);

export { router as employeeRoute };
