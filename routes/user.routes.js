import express from 'express';
import { createUser, getUsers, getUserById, updateUser, deleteUser } from '../controllers/user.controller.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';
import { userValidationRules } from '../middlewares/validators.js';

const router = express.Router();

// Todas as rotas de usuário são protegidas e só para managers
router.use(protect, authorize('manager'));

router.route('/')
    .post(userValidationRules(), createUser)
    .get(getUsers);

router.route('/:id')
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser);

export default router;
