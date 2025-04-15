const { getBlockById } = require('./fileController');
const Block = require('../models/Block');

jest.mock('../models/Block');

describe('getBlockById', () => {
  it('returns block data if found', async () => {
    const req = { params: { blockId: 1 } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    Block.findByPk.mockResolvedValue({ id: 1, name: 'BLOCK1' });

    await getBlockById(req, res);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: { id: 1, name: 'BLOCK1' }
    });
  });

  it('returns 404 if block not found', async () => {
    const req = { params: { blockId: 2 } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    Block.findByPk.mockResolvedValue(null);

    await getBlockById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Block not found.'
    });
  });
});
