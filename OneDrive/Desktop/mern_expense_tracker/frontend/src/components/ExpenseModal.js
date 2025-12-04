import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import '../App.css';

const ExpenseModal = ({ titleToEdit, onClose, existingTitles = [] }) => {
    const [title, setTitle] = useState('');
    const [entries, setEntries] = useState([{
        id: null,
        category: '',
        customCategory: '',
        amount: '',
        date: new Date().toISOString().split('T')[0]
    }]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (titleToEdit) {
            // Editing mode: fetch all expenses with this title
            fetchExpensesByTitle(titleToEdit);
        }
    }, [titleToEdit]);

    const fetchExpensesByTitle = async (titleName) => {
        setLoading(true);
        try {
            const response = await api.get('/expenses');
            const titleExpenses = response.data.filter(exp => exp.title === titleName);

            if (titleExpenses.length > 0) {
                setTitle(titleName);
                const formattedEntries = titleExpenses.map(exp => {
                    const predefinedCategories = ['Food', 'Rent', 'Travel', 'Shopping'];
                    const isCustomCategory = !predefinedCategories.includes(exp.category);

                    return {
                        id: exp._id,
                        category: isCustomCategory ? 'Other' : exp.category,
                        customCategory: isCustomCategory ? exp.category : '',
                        amount: exp.amount,
                        date: new Date(exp.date).toISOString().split('T')[0]
                    };
                });
                setEntries(formattedEntries);
            }
        } catch (err) {
            setError('Failed to fetch expenses');
        } finally {
            setLoading(false);
        }
    };

    const handleAddEntry = () => {
        setEntries([...entries, {
            id: null,
            category: '',
            customCategory: '',
            amount: '',
            date: new Date().toISOString().split('T')[0]
        }]);
    };

    const handleRemoveEntry = (index) => {
        if (entries.length === 1) {
            setError('You must have at least one category entry');
            return;
        }
        const newEntries = entries.filter((_, i) => i !== index);
        setEntries(newEntries);
    };

    const handleEntryChange = (index, field, value) => {
        const newEntries = [...entries];
        newEntries[index][field] = value;
        setEntries(newEntries);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!title.trim()) {
            setError('Please enter a title');
            return;
        }

        // Validate all entries
        for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];

            if (!entry.category) {
                setError(`Entry ${i + 1}: Please select a category`);
                return;
            }

            if (entry.category === 'Other' && !entry.customCategory.trim()) {
                setError(`Entry ${i + 1}: Please enter a custom category name`);
                return;
            }

            if (!entry.amount || parseFloat(entry.amount) <= 0) {
                setError(`Entry ${i + 1}: Please enter a valid amount`);
                return;
            }

            if (!entry.date) {
                setError(`Entry ${i + 1}: Please select a date`);
                return;
            }
        }

        setLoading(true);

        try {
            // Get current expenses for this title if editing
            let currentExpenses = [];
            if (titleToEdit) {
                const response = await api.get('/expenses');
                currentExpenses = response.data.filter(exp => exp.title === titleToEdit);
            }

            // Process each entry
            for (const entry of entries) {
                const finalCategory = entry.category === 'Other'
                    ? entry.customCategory.trim()
                    : entry.category;

                const expenseData = {
                    title: title.trim(),
                    amount: parseFloat(entry.amount),
                    category: finalCategory,
                    date: entry.date
                };

                if (entry.id) {
                    // Update existing expense
                    await api.put(`/expenses/${entry.id}`, expenseData);
                } else {
                    // Create new expense
                    await api.post('/expenses', expenseData);
                }
            }

            // Delete removed expenses (ones that were in original but not in current entries)
            if (titleToEdit) {
                const currentEntryIds = entries.filter(e => e.id).map(e => e.id);
                const expensesToDelete = currentExpenses.filter(exp => !currentEntryIds.includes(exp._id));

                for (const expense of expensesToDelete) {
                    await api.delete(`/expenses/${expense._id}`);
                }
            }

            onClose();
        } catch (err) {
            setError(err.response?.data?.msg || 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content multi-category-modal" onClick={(e) => e.stopPropagation()}>
                <h2>{titleToEdit ? `Edit "${titleToEdit}" Categories` : 'Add Expense'}</h2>
                {error && <div className="error-message">{error}</div>}

                {loading && <div className="loading-message">Loading...</div>}

                <form onSubmit={handleSubmit}>
                    {/* Title Input */}
                    <div className="form-group">
                        <label>Title / Event Name</label>
                        <input
                            type="text"
                            list="title-suggestions"
                            placeholder="e.g., Trip, Birthday Party, Monthly Bills"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={!!titleToEdit}
                            required
                        />
                        <datalist id="title-suggestions">
                            {existingTitles.map((titleName, index) => (
                                <option key={index} value={titleName} />
                            ))}
                        </datalist>
                    </div>

                    {/* Category Entries */}
                    <div className="category-entries-section">
                        <label>Category Entries</label>

                        {entries.map((entry, index) => (
                            <div key={index} className="category-entry-row">
                                <div className="entry-number">{index + 1}</div>

                                <div className="entry-fields">
                                    <div className="form-group-inline">
                                        <select
                                            value={entry.category}
                                            onChange={(e) => handleEntryChange(index, 'category', e.target.value)}
                                            required
                                        >
                                            <option value="">Select category</option>
                                            <option value="Food">🍔 Food</option>
                                            <option value="Rent">🏠 Rent</option>
                                            <option value="Travel">✈️ Travel</option>
                                            <option value="Shopping">🛍️ Shopping</option>
                                            <option value="Other">✨ Other (Custom)</option>
                                        </select>
                                    </div>

                                    {entry.category === 'Other' && (
                                        <div className="form-group-inline">
                                            <input
                                                type="text"
                                                placeholder="Custom category"
                                                value={entry.customCategory}
                                                onChange={(e) => handleEntryChange(index, 'customCategory', e.target.value)}
                                                required
                                            />
                                        </div>
                                    )}

                                    <div className="form-group-inline">
                                        <input
                                            type="number"
                                            step="0.01"
                                            placeholder="Amount"
                                            value={entry.amount}
                                            onChange={(e) => handleEntryChange(index, 'amount', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="form-group-inline">
                                        <input
                                            type="date"
                                            value={entry.date}
                                            onChange={(e) => handleEntryChange(index, 'date', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    className="btn-remove-entry"
                                    onClick={() => handleRemoveEntry(index)}
                                    disabled={entries.length === 1}
                                    title="Remove entry"
                                >
                                    🗑️
                                </button>
                            </div>
                        ))}

                        <button
                            type="button"
                            className="btn-add-entry"
                            onClick={handleAddEntry}
                        >
                            + Add Another Category
                        </button>
                    </div>

                    <div className="modal-actions">
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : (titleToEdit ? 'Update All' : 'Save All')}
                        </button>
                        <button type="button" onClick={onClose} className="btn-secondary" disabled={loading}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ExpenseModal;
