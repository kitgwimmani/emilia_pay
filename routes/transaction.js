const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// Create a transaction
router.post('/create', async (req, res) => {
    const { transaction_id, transaction_date, email, original_currency, exchange_currency, amount, transaction_point, transaction_status } = req.body;
    
    try {
        const newTransaction = new Transaction({
            transaction_id,
            transaction_date,
            email,
            original_currency,
            exchange_currency,
            amount,
            transaction_point,
            transaction_status
        });

        const savedTransaction = await newTransaction.save();
        res.status(201).json(savedTransaction);
    } catch (error) {
        res.status(500).json({ error: 'Error creating transaction' });
    }
});

// Get all transactions
router.get('/', async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching transactions' });
    }
});

// Update transaction
router.put('/:id', async (req, res) => {
    try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedTransaction);
    } catch (error) {
        res.status(500).json({ error: 'Error updating transaction' });
    }
});

// Delete transaction
router.delete('/:id', async (req, res) => {
    try {
        await Transaction.findByIdAndDelete(req.params.id);
        res.status(204).send(); // No content
    } catch (error) {
        res.status(500).json({ error: 'Error deleting transaction' });
    }
});

module.exports = router;
