require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const urlRoutes = require('./routes/urlRoutes');

const app = express();

// Bypass DB & Cache for Local Testing mode
console.log('Running in IN-MEMORY Mode (No MongoDB/Redis required)');

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/', urlRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
