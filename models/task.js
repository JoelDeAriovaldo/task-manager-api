'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Task extends Model {
        static associate(models) {
            // define association here
            Task.belongsTo(models.User, { foreignKey: 'userId' });
        }
    }
    Task.init({
        title: DataTypes.STRING,
        description: DataTypes.STRING,
        status: DataTypes.STRING,
        userId: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Task',
    });
    return Task;
};
