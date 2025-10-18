// controllers/user.controller.js
import { validationResult } from 'express-validator';
import short from 'short-uuid';
import bcrypt from 'bcryptjs';
import db from '../db.js';

// Criar um novo usuário (apenas manager)
export const createUser = async (req, res) => {
    // Validação
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role = 'customer' } = req.body;

    await db.read();
    if (db.data.users.find(u => u.email === email)) {
        return res.status(400).json({ message: 'E-mail já cadastrado.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = { id: short.generate(), name, email, password: hashedPassword, role };
    db.data.users.push(newUser);
    await db.write();

    // Não retornar a senha
    const { password: _, ...userResponse } = newUser;
    res.status(201).json(userResponse);
};

// Obter todos os usuários (apenas manager)
export const getUsers = async (req, res) => {
    await db.read();
    // Não retornar a senha
    const users = db.data.users.map(({ password, ...user }) => user);
    res.json(users);
};

// Obter um usuário por ID (apenas manager)
export const getUserById = async (req, res) => {
    await db.read();
    const user = db.data.users.find(u => u.id === req.params.id);
    if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    const { password, ...userResponse } = user;
    res.json(userResponse);
};

// Atualizar um usuário (apenas manager)
export const updateUser = async (req, res) => {
    await db.read();
    const userIndex = db.data.users.findIndex(u => u.id === req.params.id);
    if (userIndex === -1) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const { name, email, role } = req.body;
    const user = db.data.users[userIndex];

    if (name) user.name = name;
    if (role) user.role = role;
    if (email && email !== user.email) {
        if (db.data.users.some(u => u.email === email)) {
            return res.status(400).json({ message: 'E-mail já em uso.' });
        }
        user.email = email;
    }

    db.data.users[userIndex] = user;
    await db.write();

    const { password, ...userResponse } = user;
    res.json(userResponse);
};

// Deletar um usuário (apenas manager)
export const deleteUser = async (req, res) => {
    await db.read();
    const initialLength = db.data.users.length;
    db.data.users = db.data.users.filter(u => u.id !== req.params.id);

    if (db.data.users.length === initialLength) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    await db.write();
    res.json({ message: 'Usuário removido com sucesso.' });
};
