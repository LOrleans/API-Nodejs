// controllers/auth.controller.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import short from 'short-uuid';
import db from '../db.js';

// Função para gerar token JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// Registrar um novo usuário
export const registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    await db.read();
    const userExists = db.data.users.find((user) => user.email === email);

    if (userExists) {
        return res.status(400).json({ message: 'Usuário já existe.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
        id: short.generate(),
        name,
        email,
        password: hashedPassword,
        role: 'customer', // Papel padrão
    };

    db.data.users.push(newUser);
    await db.write();

    res.status(201).json({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        token: generateToken(newUser.id),
    });
};

// Autenticar (login) um usuário
export const loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    await db.read();
    const user = db.data.users.find((user) => user.email === email);

    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.id),
        });
    } else {
        res.status(401).json({ message: 'E-mail ou senha inválidos.' });
    }
};
