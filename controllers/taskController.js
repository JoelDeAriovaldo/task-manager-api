const queryDb = require('../db');
const logger = require('../logger'); // Import the logger
const { DatabaseError } = require('../errors');

exports.getAllTasks = async (req, res, next) => {
    try {
        const tasks = await queryDb('SELECT * FROM tasks');
        res.json(tasks);
    } catch (err) {
        logger.error('Error fetching tasks:', err);
        next(new DatabaseError('Internal server error'));
    }
};

exports.createTask = async (req, res) => {
    const { title, description, status } = req.body;
    const task = { title, description, status };
    try {
        await queryDb('INSERT INTO tasks SET ?', task);
        res.status(201).json(task);
    } catch (err) {
        logger.error('Error creating task:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, status } = req.body;
    try {
        await queryDb('UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?', [title, description, status, id]);
        res.json({ message: 'Tarefa atualizada com sucesso' });
    } catch (err) {
        logger.error('Error updating task:', err);
        res.status(500).json({ message: 'Erro do Servidor Interno' });
    }
};

exports.deleteTask = async (req, res) => {
    const { id } = req.params;
    try {
        await queryDb('DELETE FROM tasks WHERE id = ?', [id]);
        res.json({ message: 'Tarefa excluída com sucesso' });
    } catch (err) {
        logger.error('Error deleting task:', err);
        res.status(500).json({ message: 'Erro do Servidor Interno' });
    }
};
