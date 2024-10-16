const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transaction');
const profileRoutes = require('./routes/profile');
require('dotenv').config(); // Require dotenv to use environment variables

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/profile', profileRoutes);

// MongoDB Connection (moved to a function)
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { // Use environment variable
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully'); // Log successful connection
    } catch (err) {
        console.error('Failed to connect to MongoDB', err); // Improved error handling
        process.exit(1); // Exit the process on connection failure
    }
};

if (require.main === module) {
    // Only run this if the file is executed directly, not if it is imported
    connectDB().then(() => {
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    });
}

module.exports = app; // Export the app for testing
