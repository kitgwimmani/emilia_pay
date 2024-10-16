const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    postal_code: { type: String, required: true },
    phone_number: { type: String, required: false },
    gender: { type: String, required: false }
});

module.exports = mongoose.model('Profile', ProfileSchema);
