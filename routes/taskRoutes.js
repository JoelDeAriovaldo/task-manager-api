// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all tasks
router.get('/tasks', async (req, res) => {
    const tasks = await db.query('SELECT * FROM tasks');
    res.json(tasks);
});

// Create a new task
router.post('/tasks', async (req, res) => {
    const { description } = req.body;
    const task = { description };
    await db.query('INSERT INTO tasks SET?', task);
    res.status(201).json(task);
});

// Update a task
router.put('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { description } = req.body;
    await db.query('UPDATE tasks SET description =? WHERE id =?', description, id);
    res.json({ message: 'Task updated successfully' });
});

// Delete a task
router.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    await db.query('DELETE FROM tasks WHERE id =?', id);
    res.json({ message: 'Task deleted successfully' });
});

module.exports = router;