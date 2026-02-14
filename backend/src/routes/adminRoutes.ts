import { Router } from 'express';
import * as adminController from '../controllers/adminController';
import { adminAuth } from '../middleware/adminAuth';

const router = Router();

// POST /api/admin/places
router.post('/', adminAuth, adminController.createPlace);

// DELETE /api/admin/places/:id
router.delete('/:id', adminAuth, adminController.deletePlace);

export default router;
