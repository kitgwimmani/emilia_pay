const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    transaction_id: { type: String, required: true },
    transaction_date: { type: Date, required: true },
    email: { type: String, required: true },
    original_currency: { type: String, required: true },
    exchange_currency: { type: String, required: true },
    amount: { type: String, required: true },
    transaction_point: { type: String, required: false },
    transaction_status: { type: Boolean, required: false },
});

module.exports = mongoose.model('Transaction', TransactionSchema);
