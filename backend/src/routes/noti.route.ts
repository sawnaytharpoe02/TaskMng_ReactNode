import { Router } from 'express';
import { createNotification, editNotification, findAllNotifications } from '../controllers/noti.controller';

const router = Router();

router.get('/list', findAllNotifications);
router.post('/add', createNotification);
router.put('/edit/:id', editNotification);

export { router as notificationRoute };
