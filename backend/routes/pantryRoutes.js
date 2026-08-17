import express from 'express';
import {
    getPantryItems,
    addPantryItem,
    deletePantryItem,
} from '../controllers/pantryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All pantry routes are protected with authMiddleware
router.route('/').get(protect, getPantryItems).post(protect, addPantryItem);
router.route('/:id').delete(protect, deletePantryItem);

export default router;