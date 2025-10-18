// controllers/order.controller.js
import { validationResult } from 'express-validator';
import short from 'short-uuid';
import db from '../db.js';

// Criar um novo pedido (apenas customer)
export const createOrder = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { items } = req.body;
    const userId = req.user.id;

    await db.read();
    let totalAmount = 0;
    const orderItems = [];

    // Validação de estoque e cálculo do total
    for (const item of items) {
        const product = db.data.products.find(p => p.id === item.productId);
        if (!product) {
            return res.status(404).json({ message: `Produto com ID ${item.productId} não encontrado.` });
        }
        if (product.stock < item.quantity) {
            return res.status(400).json({ message: `Estoque insuficiente para o produto ${product.name}.` });
        }
        
        // Atualiza o estoque
        product.stock -= item.quantity;
        
        totalAmount += product.price * item.quantity;
        orderItems.push({
            productId: product.id,
            name: product.name,
            quantity: item.quantity,
            price: product.price
        });
    }

    const newOrder = {
        id: short.generate(),
        userId,
        items: orderItems,
        totalAmount,
        status: 'pending', // pending, processing, shipped, delivered, cancelled
        createdAt: new Date().toISOString()
    };

    db.data.orders.push(newOrder);
    await db.write();

    res.status(201).json(newOrder);
};

// Obter todos os pedidos (manager) ou apenas os seus (customer)
export const getOrders = async (req, res) => {
    await db.read();
    if (req.user.role === 'manager') {
        res.json(db.data.orders);
    } else {
        const userOrders = db.data.orders.filter(o => o.userId === req.user.id);
        res.json(userOrders);
    }
};

// Obter um pedido por ID
export const getOrderById = async (req, res) => {
    await db.read();
    const order = db.data.orders.find(o => o.id === req.params.id);

    if (!order) {
        return res.status(404).json({ message: 'Pedido não encontrado.' });
    }

    // Customer só pode ver seu próprio pedido
    if (req.user.role === 'customer' && order.userId !== req.user.id) {
        return res.status(403).json({ message: 'Acesso negado.' });
    }

    res.json(order);
};

// Atualizar status de um pedido (apenas manager)
export const updateOrderStatus = async (req, res) => {
    const { status } = req.body;
    if (!status) {
        return res.status(400).json({ message: 'O status é obrigatório.' });
    }

    await db.read();
    const orderIndex = db.data.orders.findIndex(o => o.id === req.params.id);

    if (orderIndex === -1) {
        return res.status(404).json({ message: 'Pedido não encontrado.' });
    }

    db.data.orders[orderIndex].status = status;
    await db.write();

    res.json(db.data.orders[orderIndex]);
};
