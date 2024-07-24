const { Task } = require('../models');
const { DatabaseError } = require('../errors');
const logger = require('../logger');

exports.getTasks = async (req, res, next) => {
    try {
        const tasks = await Task.findAll({ where: { userId: req.user.id } });
        res.json(tasks);
    } catch (err) {
        logger.error('Erro na obtenção de tarefas:', err);
        next(new DatabaseError('Erro interno do servidorr'));
    }
};

exports.createTask = async (req, res, next) => {
    const { title, description, status } = req.body;
    try {
        const task = await Task.create({ title, description, status, userId: req.user.id });
        res.status(201).json(task);
    } catch (err) {
        logger.error('Erro ao criar tarefa:', err);
        next(new DatabaseError('Erro interno do servidor'));
    }
};

exports.updateTask = async (req, res, next) => {
    const { id } = req.params;
    const { title, description, status } = req.body;
    try {
        const [updated] = await Task.update(
            { title, description, status },
            { where: { id, userId: req.user.id } }
        );
        if (!updated) {
            return res.status(404).json({ message: 'Tarefa não encontrada' });
        }
        res.json({ message: 'Tarefa atualizada com sucesso' });
    } catch (err) {
        logger.error('Erro ao atualizar a tarefa:', err);
        next(new DatabaseError('Erro do Servidor Interno'));
    }
};

exports.deleteTask = async (req, res, next) => {
    const { id } = req.params;
    try {
        const deleted = await Task.destroy({ where: { id, userId: req.user.id } });
        if (!deleted) {
            return res.status(404).json({ message: 'Tarefa não encontrada' });
        }
        res.json({ message: 'Tarefa excluída com sucesso' });
    } catch (err) {
        logger.error('Erro ao eliminar tarefa:', err);
        next(new DatabaseError('Erro do Servidor Interno'));
    }
};
