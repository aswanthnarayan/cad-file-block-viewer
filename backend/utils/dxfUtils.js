// Utility to extract blocks from parsed DXF data
function extractBlocks(parsedData) {
  if (!parsedData || !parsedData.blocks) return [];
  return Object.values(parsedData.blocks).map(block => ({
    name: block.name,
    type: block.type || 'definition',
    coordinates: block.basePoint || { x: 0, y: 0, z: 0 }
  }));
}
module.exports = { extractBlocks };
