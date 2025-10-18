// middlewares/validators.js
import { body } from 'express-validator';

export const userValidationRules = () => [
    body('name')
      .notEmpty().withMessage('O nome é obrigatório.'),
    body('email')
      .notEmpty().withMessage('O nome é obrigatório.')
      .isEmail().withMessage('Forneça um e-mail válido.'),
    body('password')
      .notEmpty().withMessage('A senha é obrigatória.')
      .isLength({ min: 6 }).withMessage('A senha deve ter no mínimo 6 caracteres.'),
    body('role')
      .optional().isIn(['customer', 'manager'])
      .withMessage('O papel deve ser "customer" ou "manager".')
];

export const loginValidationRules = () => [
    body('email')
      .notEmpty().withMessage('O email é obrigatório.')
      .isEmail().withMessage('Forneça um e-mail válido.'),
    body('password')
      .notEmpty().withMessage('A senha é obrigatória.')
];

export const productValidationRules = () => [
    body('name')
      .notEmpty().withMessage('O nome do produto é obrigatório.'),
    body('price')
      .notEmpty().withMessage('O preço do produto é obrigatório.')
      .isFloat({ gt: 0 }).withMessage('O preço deve ser um número maior que zero.'),
    body('stock')
      .notEmpty().withMessage('O estoque do produto é obrigatório.')
      .isInt({ gt: -1 }).withMessage('O estoque deve ser um número inteiro não negativo.')
];

export const orderValidationRules = () => [
    body('items')
      .isArray({ min: 1 }).withMessage('O pedido deve conter pelo menos um item.'),
    body('items.*.productId')
      .notEmpty().withMessage('O ID do produto é obrigatório.'),
    body('items.*.quantity')
      .notEmpty().withMessage('A quantidade é obrigatória.')
      .isInt({ gt: 0 }).withMessage('A quantidade deve ser um número inteiro maior que zero.')
];
