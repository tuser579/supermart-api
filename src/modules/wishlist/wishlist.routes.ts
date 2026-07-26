import { Router } from 'express';
import * as wishlistController from './wishlist.controller';
import { authenticate } from '../../shared/middlewares/auth';

const router = Router();

router.use(authenticate);

router.get('/', wishlistController.getWishlist);
router.post('/', wishlistController.addToWishlist);
router.delete('/:productId', wishlistController.removeFromWishlist);

export default router;
