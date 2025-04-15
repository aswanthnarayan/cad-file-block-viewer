const File = require('../models/File');
const Block = require('../models/Block');
const DxfParser = require('dxf-parser');
const fs = require('fs');
const { Op } = require('sequelize');

// --- Helper functions ---
function validatePagination(query) {
    let page = parseInt(query.page) || 1;
    let limit = parseInt(query.limit) || 10;
    if (page < 1) page = 1;
    if (limit < 1) limit = 10;
    return { page, limit };
}

function validateString(str, fallback = '') {
    return typeof str === 'string' ? str : fallback;
}

function handleError(res, error, message = 'Internal Server Error', status = 500) {
    console.error(error);
    res.status(status).json({ success: false, message, error: error.message });
}

// --- Upload and process CAD files ---
/**
 * Upload a DXF file, parse it, and store block definitions and instances.
 * @route POST /api/files/upload
 */
exports.uploadFile = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ success: false, message: 'No file uploaded.' });
        }
        // Parse DXF file
        const parser = new DxfParser();
        const dxfData = fs.readFileSync(file.path, 'utf8');
        const parsedData = parser.parseSync(dxfData);
        // Save File metadata with parsed data for efficent 3d render
        const newFile = await File.create({ name: file.filename, parsed_data: parsedData });
        // Save block definitions (BLOCKS section)
        let blockCount = 0;
        if (parsedData.blocks) {
            for (const [blockName, blockData] of Object.entries(parsedData.blocks)) {
                blockCount++;
                let coords = { x: 0, y: 0, z: 0 };
                if (blockData.basePoint) {
                    coords = {
                        x: blockData.basePoint.x || 0,
                        y: blockData.basePoint.y || 0,
                        z: blockData.basePoint.z || 0
                    };
                }
                await Block.create({
                    file_id: newFile.id,
                    name: blockName,
                    coordinates: coords,
                    type: 'definition',
                });
            }
        }
        // Save block insertions (INSERT entities)
        const insertEntities = parsedData.entities.filter(entity => entity.type === 'INSERT');
        for (const insert of insertEntities) {
            let coords = { x: 0, y: 0, z: 0 };
            if (insert.position) {
                coords = {
                    x: insert.position.x || 0,
                    y: insert.position.y || 0,
                    z: insert.position.z || 0
                };
            }
            await Block.create({
                file_id: newFile.id,
                name: insert.name,
                coordinates: coords,
                type: 'instance',
            });
        }
        res.status(200).json({
            success: true,
            message: 'File uploaded and processed successfully.',
            fileId: newFile.id,
            blockDefinitionsFound: blockCount,
            blockInsertionsFound: insertEntities.length
        });
    } catch (error) {
        handleError(res, error, 'Error processing file.');
    }
};

/**
 * Get paginated blocks for a file.
 * @route GET /api/files/:fileId/blocks
 */
exports.getBlocks = async (req, res) => {
    const { fileId } = req.params;
    const { page, limit } = validatePagination(req.query);
    const offset = (page - 1) * limit;
    try {
        const blocks = await Block.findAndCountAll({
            where: { file_id: fileId },
            attributes: ['id', 'type', 'name', 'coordinates'],
            limit,
            offset,
        });
        res.status(200).json({
            success: true,
            total: blocks.count,
            pages: Math.ceil(blocks.count / limit),
            data: blocks.rows,
        });
    } catch (error) {
        handleError(res, error, 'Error retrieving blocks.');
    }
};

/**
 * Get details of a specific block.
 * @route GET /api/files/:fileId/blocks/:blockId
 */
exports.getBlockById = async (req, res) => {
    const { blockId: id } = req.params;
    try {
        const block = await Block.findByPk(id);
        if (!block) {
            return res.status(404).json({ success: false, message: 'Block not found.' });
        }
        res.status(200).json({ success: true, data: block });
    } catch (error) {
        handleError(res, error, 'Error retrieving block.');
    }
};

/**
 * Get parsed file data by ID.
 * @route GET /api/files/:fileId
 */
exports.getParsedFileById = async (req, res) => {
    const fileId = req.params.fileId;
    try {
        const file = await File.findOne({
            where: { id: fileId },
            include: [
                { model: Block, as: 'blocks' },
            ],
        });
        if (!file) {
            return res.status(404).json({ success: false, message: 'File not found' });
        }
        res.status(200).json({
            success: true,
            filePath: file.name,
            parsedData: file.parsed_data,
        });
    } catch (error) {
        handleError(res, error);
    }
};

/**
 * Search/filter blocks with pagination.
 * @route GET /api/files/:fileId/blocks/search
 */
exports.searchBlocks = async (req, res) => {
    const fileId = req.params.fileId;
    const { page, limit } = validatePagination(req.query);
    const offset = (page - 1) * limit;
    const search = validateString(req.query.search);
    const filterType = validateString(req.query.filterType);
    try {
        const whereClause = { file_id: fileId };
        if (search) {
            whereClause.name = { [Op.iLike]: `%${search}%` };
        }
        if (filterType) {
            whereClause.type = filterType;
        }
        const blocks = await Block.findAndCountAll({
            where: whereClause,
            attributes: ['id', 'type', 'name', 'coordinates'],
            limit,
            offset,
        });
        res.status(200).json({
            success: true,
            total: blocks.count,
            pages: Math.ceil(blocks.count / limit),
            data: blocks.rows,
        });
    } catch (error) {
        handleError(res, error, 'Error searching/filtering blocks.');
    }
};
