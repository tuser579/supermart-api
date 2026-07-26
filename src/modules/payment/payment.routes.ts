import { Router } from 'express';
import { paymentController } from './payment.controller';
import { authMiddleware } from '../auth/auth.middleware';

const router = Router();

// We can protect these routes so only logged in users can access them
router.use(authMiddleware);

router.post('/bank', paymentController.processBankTransfer);
router.post('/card', paymentController.processCardPayment);

// Saved Payment Methods
router.get('/methods', paymentController.getSavedMethods);
router.post('/methods', paymentController.addSavedMethod);
router.delete('/methods/:id', paymentController.deleteSavedMethod);

export const paymentRoutes = router;
