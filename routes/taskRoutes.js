const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const queryDb = require('../db');
const logger = require('../logger'); // Import the logger
const { DatabaseError, AuthError } = require('../errors');

// Get all tasks
router.get('/tasks', async (req, res, next) => {
    try {
        const tasks = await queryDb('SELECT * FROM tasks');
        res.json(tasks);
    } catch (err) {
        logger.error('Error fetching tasks:', err);
        next(new DatabaseError('Internal server error'));
    }
});

// Create a new task
router.post('/tasks',
    [
        check('title', 'Title is required').not().isEmpty(),
        check('description', 'Description is required').not().isEmpty(),
        check('status', 'Status must be a valid value').isIn(['pending', 'in-progress', 'completed'])
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, description, status } = req.body;
        const task = { title, description, status };
        try {
            await queryDb('INSERT INTO tasks SET ?', task);
            res.status(201).json(task);
        } catch (err) {
            logger.error('Error creating task:', err);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

// Update a task
router.put('/tasks/:id',
    [
        check('title', 'Title is required').not().isEmpty(),
        check('description', 'Description is required').not().isEmpty(),
        check('status', 'Status must be a valid value').isIn(['pending', 'in-progress', 'completed'])
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { title, description, status } = req.body;
        try {
            await queryDb('UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?', [title, description, status, id]);
            res.json({ message: 'Tarefa atualizada com sucesso' });
        } catch (err) {
            logger.error('Error updating task:', err);
            res.status(500).json({ message: 'Erro do Servidor Interno' });
        }
    });

// Delete a task
router.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await queryDb('DELETE FROM tasks WHERE id = ?', [id]);
        res.json({ message: 'Tarefa excluída com sucesso' });
    } catch (err) {
        logger.error('Error deleting task:', err);
        res.status(500).json({ message: 'Erro do Servidor Interno' });
    }
});

module.exports = router;
