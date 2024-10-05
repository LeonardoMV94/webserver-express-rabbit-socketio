
import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import logger from '../config/logger';
import { db } from '../database/db.client';

const router = Router();


// Crear un nuevo usuario
router.post('/', async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        const user = await db.user.create({
            data: {
                name,
                email,
                password: await bcrypt.hash(password, 10),
            },
        });
        logger.info(`Usuario creado: ${user.id}`);
        res.status(201).json(user);
    } catch (error) {
        logger.error('Error al crear usuario:', error);
        res.status(500).json({ error: 'Error al crear usuario' });
    }
});

// Obtener todos los usuarios
router.get('/', async (_req: Request, res: Response) => {
    try {
        const users = await db.user.findMany({
            select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
        });
        res.json(users);
    } catch (error) {
        logger.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});

// Obtener un usuario por ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await db.user.findUnique({
            where: { id },
            select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
        });
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        logger.error('Error al obtener usuario:', error);
        res.status(500).json({ error: 'Error al obtener usuario' });
    }
});

// Actualizar un usuario
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;
        const updatedUser = await db.user.update({
            where: { id },
            data: { name, email },
        });
        logger.info(`Usuario actualizado: ${id}`);
        res.json(updatedUser);
    } catch (error) {
        logger.error('Error al actualizar usuario:', error);
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
});

// Eliminar un usuario
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await db.user.delete({ where: { id } });
        logger.info(`Usuario eliminado: ${id}`);
        res.status(204).send();
    } catch (error) {
        logger.error('Error al eliminar usuario:', error);
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
});

export default router;
