const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const sequelize = require('./config/config');
const { File, Block } = require('./models/associations');
const upload = require('./middlewares/multerConfig');
const fileRoutes = require('./routes/fileRoutes'); 

const app = express();
const port = process.env.PORT || 5000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

// CORS - restrict to frontend origin
app.use(cors({ origin: FRONTEND_ORIGIN,credentials: true }));

// JSON body parser
app.use(express.json());

// API routes
app.use('/api', fileRoutes);

// Serve uploaded files
app.use('/files', express.static(path.join(__dirname, 'uploads')));

// Error handling middleware (should be after all routes)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Sequelize DB connection
sequelize.authenticate()
    .then(() => {
        console.log('Connection to the database has been established successfully.');
        return sequelize.sync({ alter: true });
    })
    .then(() => {
        console.log('Database & tables created!');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});