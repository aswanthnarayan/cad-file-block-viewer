-- Table for storing uploaded files
CREATE TABLE "Files" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    upload_date TIMESTAMP DEFAULT NOW(),
    parsed_data JSONB
);

-- Table for storing blocks (definitions and instances)
CREATE TABLE "Blocks" (
    id SERIAL PRIMARY KEY,
    file_id INTEGER NOT NULL REFERENCES "Files"(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(16) NOT NULL CHECK (type IN ('definition', 'instance')),
    coordinates JSONB NOT NULL DEFAULT '{}'
);

-- Indexes for performance
CREATE INDEX idx_blocks_file_id ON "Blocks"(file_id);
CREATE INDEX idx_blocks_name ON "Blocks"(name);
CREATE INDEX idx_blocks_type ON "Blocks"(type);