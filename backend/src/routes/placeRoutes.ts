import { Router } from 'express';
import * as placeController from '../controllers/placeController';

const router = Router();

router.get('/', placeController.getAllPlaces);
router.get('/saved', placeController.getSavedPlaces);
router.get('/:id', placeController.getPlaceById);
router.post('/', placeController.createPlace);
router.put('/:id', placeController.updatePlace);
router.patch('/:id/save', placeController.savePlace);
router.patch('/:id/unsave', placeController.unsavePlace);
router.delete('/:id', placeController.deletePlace);

export default router;
