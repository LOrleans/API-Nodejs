// middlewares/auth.middleware.js
import jwt from 'jsonwebtoken';
import db from '../db.js';

export const protect = (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extrai o token do cabeçalho
            token = req.headers.authorization.split(' ')[1];

            // Verifica o token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Anexa o usuário à requisição (sem a senha)
            const user = db.data.users.find(u => u.id === decoded.id);
            if (!user) {
                return res.status(401).json({ message: 'Usuário não encontrado.' });
            }
            req.user = { id: user.id, name: user.name, email: user.email, role: user.role };

            next();
        } catch (error) {
            res.status(401).json({ message: 'Não autorizado, token inválido.' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Não autorizado, sem token.' });
    }
};

// Middleware para verificar o papel (role)
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Acesso negado. Você não tem permissão para realizar esta ação.' });
        }
        next();
    };
};
