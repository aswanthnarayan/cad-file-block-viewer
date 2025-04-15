# CAD File Block Viewer

A full-stack web application for uploading, parsing, and interactively viewing blocks from CAD (DXF) files. Built with React, Express, Sequelize, and PostgreSQL.

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16+ recommended)
- PostgreSQL (set up a database instance)

### 1. Clone the Repository
```bash
git clone https://github.com/aswanthnarayan/cad-file-block-viewer.git
cd cad-file-block-viewer
```

### 2. Configure Environment Variables
Create a `.env` file in the root and backend directories

(see `.env.example` for example):
```
# Example for backend/.env
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_pass
DB_NAME=cad_file_viewer
DB_PORT=5432
FRONTEND_ORIGIN=http://localhost:5173
PORT=5000
```

### 3. Ensure Uploads Directory Exists
The backend expects an `uploads/` directory (inside `backend/`) to store uploaded DXF files. If it does not exist, it will be created automatically when the first file is uploaded. However, you can manually create it to avoid any initial warnings or errors:

```bash
mkdir -p backend/uploads
```

- The `uploads/` folder is gitignored by default.

### 4. Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

# Concurrently (for development)
cd backend
npm install -g concurrently
## Add following to package.json in backend
"dev": "concurrently \"nodemon server.js\" \"npm run dev --prefix ../frontend\""
## To run both frontend and backend
npm run dev

```

### 5. Database Migrations
Set up your PostgreSQL database and run migrations if required (see Sequelize CLI or sync in code).

### 6. Start the App
```bash
# In one terminal (backend)
cd backend
npm start

# In another terminal (frontend)
cd frontend
npm run dev
```

### 7. SQL Directory
- The `sql/` directory contains `schema.sql`, which defines the PostgreSQL tables for this project.
- You can use this SQL script to manually create the required tables before running the backend, or as a reference for your ORM migrations.
- To apply the schema directly:
  ```bash
  psql -U <your_db_user> -d <your_db_name> -f sql/schema.sql
  ```

---

## 📦 API Documentation

### File Endpoints
- `POST /api/upload` — Upload a DXF file (multipart/form-data, field: `file`)
- `GET /api/files/:fileId` — Get parsed file metadata and block info

### Block Endpoints
- `GET /api/files/:fileId/blocks` — List all blocks for a file (pagination supported)
- `GET /api/files/:fileId/blocks/search` — Search/filter blocks by name/type (pagination)
- `GET /api/blocks/:blockId` — Get details of a specific block

#### Common Query Params
- `page`, `limit` — Pagination
- `search` — Block name search (case-insensitive, partial)
- `filterType` — Filter by block type (`definition` or `instance`)

#### Error Handling
All API responses use `{ success, data, message, ... }`. Errors return HTTP 4xx/5xx with a message.

---

## 🗄️ Database Schema (Sequelize Models)

This application uses two main tables to store DXF file data and extracted blocks. Below are their purposes and detailed field explanations:

### File
**Purpose:** Stores metadata and parsed content for each uploaded DXF file.

| Field        | Type      | Description                                         |
|--------------|-----------|-----------------------------------------------------|
| id           | INTEGER   | Primary key (unique identifier for each file)       |
| name         | STRING    | Unique file name as stored on the server            |
| upload_date  | DATE      | Timestamp when the file was uploaded                |
| parsed_data  | JSONB     | Parsed DXF content (raw data for fast retrieval)    |

- **id:** Uniquely identifies each uploaded file.
- **name:** The filename, must be unique to avoid collisions.
- **upload_date:** When the file was uploaded (auto-set).
- **parsed_data:** Stores the full parsed DXF structure as JSON for quick backend/frontend access.

### Block
**Purpose:** Stores all blocks (definitions and instances) extracted from DXF files.

| Field       | Type            | Description                                                |
|-------------|-----------------|------------------------------------------------------------|
| id          | INTEGER         | Primary key (unique identifier for each block)             |
| file_id     | INTEGER         | Foreign key referencing the parent file                    |
| name        | STRING          | Name of the block in the DXF file                          |
| type        | ENUM            | 'definition' (template) or 'instance' (usage/insertion)    |
| coordinates | JSONB           | Position/basePoint (x, y, z) as JSON                       |

- **id:** Uniquely identifies each block.
- **file_id:** Links the block to its parent file (enables file-block queries).
- **name:** The block's name as found in the DXF.
- **type:** Distinguishes between a block definition and a block instance (insertion).
- **coordinates:** The block's position or basePoint, stored as a JSON object for flexibility (e.g., `{ "x": 10, "y": 5, "z": 0 }`).

#### Associations
- `File.hasMany(Block, { as: 'blocks' })` — Each file can have many blocks.
- `Block.belongsTo(File, { as: 'file' })` — Each block belongs to a single file.

---

## 🧪 Testing

### Backend Unit Tests
- **Framework:** Jest
- **Location:** `/backend/utils/dxfUtils.test.js`, `/backend/controllers/fileController.test.js`
- **How to run:**
  1. Navigate to the backend directory: `cd backend`
  2. Run: `npm test`
- **Coverage:**
  - Utility logic for extracting blocks from parsed DXF data.
  - Controller logic for retrieving block details by ID (including not-found cases).
- **Example Output:**
  ```
  PASS  utils/dxfUtils.test.js
  PASS  controllers/fileController.test.js
  Test Suites: 2 passed, 2 total
  Tests:       4 passed, 4 total
  ```

### Notes
- Tests use mocking to avoid real database access.
- Tests are self-contained and do not require any manual setup.
- You can extend the test suite to cover more endpoints and edge cases as needed.

---

## 🛠️ Library Choices & Reasoning
- **React**: Fast, component-driven UI development.
- **Three.js**: Efficient 3D rendering for DXF files.
- **dxf-parser**: Parses DXF files on the backend.
- **Express**: Minimal, flexible Node.js server.
- **Sequelize**: ORM for clean DB access and migrations.
- **Multer**: Handles secure file uploads.
- **Axios**: Promise-based HTTP client for API calls.
- **Material Tailwind**: Modern UI components for React.- Better Tables component
---

## ⚡ Challenges & Solutions
- **DXF Parsing**: Handling large/complex files required careful memory management and error handling.
- **Block Extraction**: Differentiating between block definitions and instances (insertions) and mapping them efficiently.
- **File Upload Security**: Restricted uploads to DXF files, set size limits, and cleaned up failed uploads.
- **Responsive UI**: Ensured the viewer and tables scale well on all devices.

---

## 🤖 AI Coding Assistant Usage
- Used AI assistants for:
  - Boilerplate generation (CRUD, routes, model definitions)
  - Refactoring for best practices (validation, error handling, code organization)
  - Generating code comments and documentation
  - Suggesting performance and security improvements
- All code was reviewed and tested by a human developer. AI was used as a productivity and learning tool, not as a replacement for critical thinking.

---

## 📬 Questions?
Open an issue or contact the maintainer for help!
