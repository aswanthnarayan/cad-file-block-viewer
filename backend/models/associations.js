const File = require('./File');
const Block = require('./Block');

// Each File has many Blocks, each Block belongs to a File
File.hasMany(Block, { foreignKey: 'file_id', as: 'blocks', onDelete: 'CASCADE' });
Block.belongsTo(File, { foreignKey: 'file_id', as: 'file' });

module.exports = { File, Block };
