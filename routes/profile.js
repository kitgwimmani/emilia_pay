const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');

// Create a profile
router.post('/create', async (req, res) => {
    const { email, country, city, postal_code, phone_number, gender } = req.body;
    try {
        const profileExists = await Profile.findOne({ email });
        if (profileExists) return res.status(400).json({ message: 'Profile already exists' });

        const newProfile = new Profile({ email, country, city, postal_code, phone_number, gender });
        const savedProfile = await newProfile.save();
        res.status(201).json(savedProfile);
    } catch (error) {
        res.status(500).json({ message: 'Error creating profile' });
    }
});

// Get a profile by email
router.get('/:email', async (req, res) => {
    try {
        const profile = await Profile.findOne({ email: req.params.email });
        if (!profile) return res.status(404).json({ message: 'Profile not found' });
        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile' });
    }
});

module.exports = router;
