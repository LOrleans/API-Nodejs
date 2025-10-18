// controllers/product.controller.js
import { validationResult } from 'express-validator';
import short from 'short-uuid';
import db from '../db.js';

// Criar produto (apenas manager)
export const createProduct = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, price, stock } = req.body;
    const newProduct = { id: short.generate(), name, description, price, stock };

    db.data.products.push(newProduct);
    await db.write();
    res.status(201).json(newProduct);
};

// Obter todos os produtos (qualquer usuário logado)
export const getProducts = async (req, res) => {
    await db.read();
    res.json(db.data.products);
};

// Obter um produto por ID (qualquer usuário logado)
export const getProductById = async (req, res) => {
    await db.read();
    const product = db.data.products.find(p => p.id === req.params.id);
    if (!product) {
        return res.status(404).json({ message: 'Produto não encontrado.' });
    }
    res.json(product);
};

// Atualizar produto (apenas manager)
export const updateProduct = async (req, res) => {
    await db.read();
    const productIndex = db.data.products.findIndex(p => p.id === req.params.id);
    if (productIndex === -1) {
        return res.status(404).json({ message: 'Produto não encontrado.' });
    }

    const product = { ...db.data.products[productIndex], ...req.body };
    db.data.products[productIndex] = product;
    await db.write();
    res.json(product);
};

// Deletar produto (apenas manager)
export const deleteProduct = async (req, res) => {
    await db.read();
    const initialLength = db.data.products.length;
    db.data.products = db.data.products.filter(p => p.id !== req.params.id);

    if (db.data.products.length === initialLength) {
        return res.status(404).json({ message: 'Produto não encontrado.' });
    }

    await db.write();
    res.json({ message: 'Produto removido com sucesso.' });
};
