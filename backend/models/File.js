const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/config');

/**
 * File model: stores uploaded DXF file metadata and parsed data.
 */
class File extends Model {}

// Define the File model with validation and indexing
File.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    upload_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    parsed_data: {
        type: DataTypes.JSONB, 
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'File',
    tableName: 'Files',
    indexes: [
        { fields: ['name'] }, // Index for fast search
    ],
});

module.exports = File;
