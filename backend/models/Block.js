const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/config');

/**
 * Block model: stores both block definitions and instances for a DXF file.
 * - type: 'definition' or 'instance'
 * - coordinates: position or basePoint (x, y, z)
 */
class Block extends Model {}

Block.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    file_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Files',
            key: 'id',
        },
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM('definition', 'instance'),
        allowNull: false,
    },
    coordinates: {
        type: DataTypes.JSONB, 
        allowNull: false,
        defaultValue: {},
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    modelName: 'Block',
    tableName: 'Blocks',
    indexes: [
        { fields: ['file_id'] },
        { fields: ['name'] },
        { fields: ['type'] },
    ],
});

module.exports = Block;
