const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const chatRoutes = require('./routes/chat');
require('dotenv').config();

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
