import express from 'express';
import { createOrder, getOrders, getOrderById, updateOrderStatus } from '../controllers/order.controller.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';
import { orderValidationRules } from '../middlewares/validators.js';

const router = express.Router();

// Todas as rotas de pedidos precisam de autenticação
router.use(protect);

router.route('/')
    .post(authorize('customer'), orderValidationRules(), createOrder) // Apenas customers podem criar pedidos
    .get(getOrders); // Lógica de autorização está no controller

router.route('/:id')
    .get(getOrderById) // Lógica de autorização está no controller
    .put(authorize('manager'), updateOrderStatus); // Apenas managers podem atualizar status

export default router;
