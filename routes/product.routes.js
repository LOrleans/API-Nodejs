import express from 'express';
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct } from '../controllers/product.controller.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';
import { productValidationRules } from '../middlewares/validators.js';

const router = express.Router();

// Rotas de leitura são para todos os usuários logados
router.route('/').get(protect, getProducts);
router.route('/:id').get(protect, getProductById);

// Rotas de escrita (CUD) são apenas para managers
router.route('/')
    .post(protect, authorize('manager'), productValidationRules(), createProduct);

router.route('/:id')
    .put(protect, authorize('manager'), updateProduct)
    .delete(protect, authorize('manager'), deleteProduct);

export default router;
