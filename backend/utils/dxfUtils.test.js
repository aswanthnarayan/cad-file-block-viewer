const { extractBlocks } = require('./dxfUtils');

describe('extractBlocks', () => {
  it('returns an array of blocks from parsed DXF data', () => {
    const parsedData = {
      blocks: {
        B1: { name: 'B1', basePoint: { x: 1, y: 2, z: 0 } },
        B2: { name: 'B2', basePoint: { x: 3, y: 4, z: 0 } }
      }
    };
    const result = extractBlocks(parsedData);
    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({ name: 'B1', coordinates: { x: 1, y: 2, z: 0 } });
  });

  it('returns an empty array for missing or empty blocks', () => {
    expect(extractBlocks({})).toEqual([]);
    expect(extractBlocks(null)).toEqual([]);
  });
});
