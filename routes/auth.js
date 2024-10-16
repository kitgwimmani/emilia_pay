const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Adjust the path as necessary
const nodemailer = require('nodemailer'); // Uncommented the import statement
const router = express.Router();

// User Registration Route
router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check for existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' }); // Ensure this is handled
        }

        // Create a new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            email,
            password: hashedPassword,
            otp_code: null, // Initialize OTP code as null
            isVerified: false // Initialize verification status
        });
        await newUser.save();

        return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during registration:', error); // Log the error for debugging
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// OTP Verification
router.post('/verify_otp', async (req, res) => {
    const { email, otp } = req.body;

    try {
        // 1. Check if the user exists by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // 2. Compare the provided OTP with the stored OTP
        if (user.otp_code !== otp) {
            return res.status(400).json({ message: 'Invalid OTP code' });
        }

        // 3. Update the user's verification status
        user.isVerified = true;
        user.otp_code = null; // Clear OTP after successful verification
        await user.save();

        return res.status(200).json({ message: 'User verified successfully' });
    } catch (error) {
        console.error('Error during OTP verification:', error); // Log the error for debugging
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// Endpoint to create OTP and send it via email
router.post('/create_otp', async (req, res) => {
    const { email } = req.body;

    try {
        // 1. Check if the user exists by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // 2. Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // 3. Update the user's OTP code in the database
        user.otp_code = otp;
        await user.save();
        return res.status(200).json({ message: 'OTP sent successfully to your email' });
        
        /*
        // 4. Configure the email transport using Nodemailer
        let transporter = nodemailer.createTransport({
            service: 'gmail', // Use your email service (e.g., Gmail)
            auth: {
                user: process.env.EMAIL_USER, // Use environment variable for security
                pass: process.env.EMAIL_PASS, // Use environment variable for security
            }
        });

        // 5. Set up the email options
        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}. It is valid for 10 minutes.`
        };

        // 6. Send the email
        try {
            const info = await transporter.sendMail(mailOptions);
            return res.status(200).json({ message: 'OTP sent successfully to your email', info: info.response });
        } catch (error) {
            console.error('Error sending email:', error); // Log email sending errors
            return res.status(500).json({ message: 'Error sending email', error: error.message });
        }
            */

    } catch (error) {
        
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

module.exports = router;
