import { Router } from 'express';
import { addressController } from './address.controller';
import { authMiddleware } from '../../shared/middleware/auth.middleware';
import { validate } from '../../shared/middleware/validation.middleware';
import { createAddressSchema, updateAddressSchema } from './address.validation';

const router = Router();

// All address routes require authentication
router.use(authMiddleware);

// GET /api/v1/addresses — list all user's saved addresses
router.get('/', addressController.list);

// POST /api/v1/addresses — save a new address
router.post('/', validate(createAddressSchema), addressController.create);

// PUT /api/v1/addresses/:id — update an address
router.put('/:id', validate(updateAddressSchema), addressController.update);

// DELETE /api/v1/addresses/:id — delete an address
router.delete('/:id', addressController.delete);

// PATCH /api/v1/addresses/:id/default — set as default
router.patch('/:id/default', addressController.setDefault);

export default router;
