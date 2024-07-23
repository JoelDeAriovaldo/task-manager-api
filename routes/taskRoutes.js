const express = require('express');
const router = express.Router();
const queryDb = require('../db');

// Get all tasks
router.get('/tasks', async (req, res) => {
    try {
        const tasks = await queryDb('SELECT * FROM tasks');
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Create a new task
router.post('/tasks', async (req, res) => {
    const { title, description, status } = req.body;
    const task = { title, description, status };
    try {
        await queryDb('INSERT INTO tasks SET ?', task);
        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update a task
router.put('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, status } = req.body;
    try {
        await queryDb('UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?', [title, description, status, id]);
        res.json({ message: 'Tarefa atualizada com sucesso' });
    } catch (err) {
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
        res.status(500).json({ message: 'Erro do Servidor Interno' });
    }
});

module.exports = router;
