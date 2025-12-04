const express = require('express');
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');
const router = express.Router();

// GET /api/expenses - Get all expenses for logged-in user
router.get('/', auth, async (req, res) => {
    try {
        const expenses = await Expense.find({ userId: req.user }).sort({ date: -1 });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
});

// POST /api/expenses - Create new expense
router.post('/', auth, async (req, res) => {
    try {
        const { title, amount, category, date } = req.body;

        const expense = await Expense.create({
            title,
            amount,
            category,
            date: date || Date.now(),
            userId: req.user
        });

        res.status(201).json(expense);
    } catch (error) {
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
});

// PUT /api/expenses/:id - Update expense
router.put('/:id', auth, async (req, res) => {
    try {
        const { title, amount, category, date } = req.body;

        // Find expense and verify ownership
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ msg: 'Expense not found' });
        }

        if (expense.userId.toString() !== req.user) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        // Update expense
        expense.title = title || expense.title;
        expense.amount = amount || expense.amount;
        expense.category = category || expense.category;
        expense.date = date || expense.date;

        await expense.save();

        res.json(expense);
    } catch (error) {
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
});

// DELETE /api/expenses/:id - Delete expense
router.delete('/:id', auth, async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ msg: 'Expense not found' });
        }

        if (expense.userId.toString() !== req.user) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Expense.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Expense deleted' });
    } catch (error) {
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
});

module.exports = router;