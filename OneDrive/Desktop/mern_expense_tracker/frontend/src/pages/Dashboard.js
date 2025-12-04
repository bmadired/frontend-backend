import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pie, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
} from 'chart.js';
import api from '../api/axios';
import { removeToken } from '../utils/auth';
import ExpenseModal from '../components/ExpenseModal';
import '../App.css';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
);

const Dashboard = () => {
    const [expenses, setExpenses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [titleToEdit, setTitleToEdit] = useState(null);
    const [user, setUser] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        fetchUser();
        fetchExpenses();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await api.get('/auth/me');
            setUser(response.data);
        } catch (err) {
            console.error('Error fetching user:', err);
        }
    };

    const fetchExpenses = async () => {
        try {
            const response = await api.get('/expenses');
            setExpenses(response.data);
        } catch (err) {
            console.error('Error fetching expenses:', err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this expense?')) {
            try {
                await api.delete(`/expenses/${id}`);
                fetchExpenses();
            } catch (err) {
                console.error('Error deleting expense:', err);
            }
        }
    };

    const handleEdit = (expense) => {
        setTitleToEdit(expense.title);
        setShowModal(true);
    };

    const handleAdd = () => {
        setTitleToEdit(null);
        setShowModal(true);
    };

    const handleLogout = () => {
        removeToken();
        navigate('/login');
    };

    const handleModalClose = () => {
        setShowModal(false);
        setTitleToEdit(null);
        fetchExpenses();
    };

    // Get all unique groups (titles)
    const allGroups = [...new Set(expenses.map(exp => exp.title))];

    // Filter expenses by selected group
    const filteredExpenses = selectedGroup === 'all'
        ? expenses
        : expenses.filter(exp => exp.title === selectedGroup);

    // Calculate analytics based on filtered expenses
    const totalSpending = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    const categoryTotals = filteredExpenses.reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
        return acc;
    }, {});

    // Category colors
    const categoryColors = {
        'Food': '#FF6384',
        'Rent': '#36A2EB',
        'Travel': '#FFCE56',
        'Shopping': '#4BC0C0'
    };

    const getCategoryColor = (category) => {
        return categoryColors[category] || '#9B59B6';
    };

    const getCategoryIcon = (category) => {
        const icons = {
            'Food': '🍔',
            'Rent': '🏠',
            'Travel': '✈️',
            'Shopping': '🛍️'
        };
        return icons[category] || '✨';
    };

    // Pie chart data (always uses filtered category totals)
    const pieChartData = {
        labels: Object.keys(categoryTotals),
        datasets: [
            {
                label: 'Spending',
                data: Object.values(categoryTotals),
                backgroundColor: Object.keys(categoryTotals).map(cat => getCategoryColor(cat)),
                borderColor: '#fff',
                borderWidth: 3,
            },
        ],
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 15,
                    font: {
                        size: 13,
                        family: "'Segoe UI', sans-serif"
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${label}: $${value.toFixed(2)} (${percentage}%)`;
                    }
                }
            }
        }
    };

    // Bar chart data logic
    let barChartLabels, barChartValues, barChartColors;

    if (selectedGroup === 'all') {
        // Show Title breakdown when viewing all
        const barChartStats = expenses.reduce((acc, exp) => {
            const label = exp.title;
            if (!acc[label]) {
                acc[label] = { amount: 0 };
            }
            acc[label].amount += exp.amount;
            return acc;
        }, {});
        barChartLabels = Object.keys(barChartStats);
        barChartValues = barChartLabels.map(label => barChartStats[label].amount);
        // Generate consistent colors for titles
        barChartColors = barChartLabels.map((_, index) => {
            const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
            return colors[index % colors.length];
        });
    } else {
        // Show simple Category breakdown when a specific title is selected
        barChartLabels = Object.keys(categoryTotals);
        barChartValues = Object.values(categoryTotals);
        barChartColors = Object.keys(categoryTotals).map(cat => getCategoryColor(cat));
    }

    const barChartData = {
        labels: barChartLabels,
        datasets: [
            {
                label: 'Amount Spent',
                data: barChartValues,
                backgroundColor: barChartColors,
                borderRadius: 8,
                barThickness: 50,
            },
        ],
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `$${context.parsed.y.toFixed(2)}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return '$' + value;
                    }
                },
                grid: {
                    color: '#f0f0f0'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    };

    const categoryCount = filteredExpenses.reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + 1;
        return acc;
    }, {});

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div className="header-left">
                    <h1>💰 Expense Tracker</h1>
                    {user && <p className="user-greeting">Welcome back, {user.name}!</p>}
                </div>
                <div className="header-actions">
                    {allGroups.length > 0 && (
                        <select
                            value={selectedGroup}
                            onChange={(e) => setSelectedGroup(e.target.value)}
                            className="group-filter-select"
                            style={{
                                padding: '10px 16px',
                                borderRadius: '8px',
                                border: '2px solid #e1e8ed',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                marginRight: '10px',
                                backgroundColor: 'white'
                            }}
                        >
                            <option value="all">🏷️ All Titles</option>
                            {allGroups.map(group => (
                                <option key={group} value={group}>{group}</option>
                            ))}
                        </select>
                    )}
                    <button onClick={handleAdd} className="btn-add-expense">
                        + Add Expense
                    </button>
                    <button onClick={() => navigate('/profile')} className="btn-secondary">
                        Profile
                    </button>
                    <button onClick={handleLogout} className="btn-secondary">
                        Logout
                    </button>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card total-spending">
                    <div className="stat-icon">💵</div>
                    <div className="stat-content">
                        <h3>Total Spending</h3>
                        <p className="stat-value">${totalSpending.toFixed(2)}</p>
                    </div>
                </div>

                <div className="stat-card total-transactions">
                    <div className="stat-icon">📊</div>
                    <div className="stat-content">
                        <h3>Total Transactions</h3>
                        <p className="stat-value">{filteredExpenses.length}</p>
                    </div>
                </div>

                <div className="stat-card categories-count">
                    <div className="stat-icon">🏷️</div>
                    <div className="stat-content">
                        <h3>Categories Used</h3>
                        <p className="stat-value">{Object.keys(categoryTotals).length}</p>
                    </div>
                </div>

                <div className="stat-card avg-expense">
                    <div className="stat-icon">📈</div>
                    <div className="stat-content">
                        <h3>Average Expense</h3>
                        <p className="stat-value">
                            ${filteredExpenses.length > 0 ? (totalSpending / filteredExpenses.length).toFixed(2) : '0.00'}
                        </p>
                    </div>
                </div>
            </div>

            {Object.keys(categoryTotals).length > 0 && (
                <div className="charts-grid">
                    <div className="chart-card">
                        <h3>📊 {selectedGroup === 'all' ? 'Spending by Title (Bar Chart)' : `Spending Breakdown for ${selectedGroup}`}</h3>
                        <div className="chart-wrapper">
                            <Bar
                                key={`bar-${selectedGroup}-${JSON.stringify(barChartLabels)}`}
                                data={barChartData}
                                options={barOptions}
                            />
                        </div>
                    </div>

                    <div className="chart-card">
                        <h3>🥧 Category Distribution (Pie Chart)</h3>
                        <div className="chart-wrapper">
                            <Pie
                                key={`pie-${selectedGroup}-${JSON.stringify(Object.keys(categoryTotals))}`}
                                data={pieChartData}
                                options={pieOptions}
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="category-breakdown">
                <h3>📋 Category Breakdown</h3>
                <div className="category-cards">
                    {Object.entries(categoryTotals).map(([category, total]) => (
                        <div key={category} className="category-card" style={{ borderLeftColor: getCategoryColor(category) }}>
                            <div className="category-header">
                                <span className="category-icon" style={{ backgroundColor: getCategoryColor(category) }}>
                                    {getCategoryIcon(category)}
                                </span>
                                <h4>{category}</h4>
                            </div>
                            <div className="category-stats">
                                <div className="category-stat">
                                    <span className="stat-label">Total</span>
                                    <span className="stat-amount">${total.toFixed(2)}</span>
                                </div>
                                <div className="category-stat">
                                    <span className="stat-label">Transactions</span>
                                    <span className="stat-count">{categoryCount[category] || 0}</span>
                                </div>
                                <div className="category-stat">
                                    <span className="stat-label">Percentage</span>
                                    <span className="stat-percent">
                                        {totalSpending > 0 ? ((total / totalSpending) * 100).toFixed(1) : 0}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="expenses-section">
                <div className="section-header">
                    <h3>💳 {selectedGroup === 'all' ? 'Recent Transactions' : `${selectedGroup} Transactions`}</h3>
                    <span className="transaction-count">{filteredExpenses.length} transactions</span>
                </div>

                <div className="expenses-list">
                    {filteredExpenses.length === 0 ? (
                        <div className="no-expenses">
                            <p>📝 {selectedGroup === 'all' ? 'No expenses yet. Start tracking by adding your first expense!' : `No expenses in "${selectedGroup}" title.`}</p>
                        </div>
                    ) : (
                        filteredExpenses.map((expense) => (
                            <div key={expense._id} className="expense-item-modern">
                                <div className="expense-icon" style={{ backgroundColor: getCategoryColor(expense.category) }}>
                                    {getCategoryIcon(expense.category)}
                                </div>
                                <div className="expense-details">
                                    <h4>{expense.title}</h4>
                                    <div className="expense-meta">
                                        <span className="expense-category-tag" style={{ backgroundColor: getCategoryColor(expense.category) + '20', color: getCategoryColor(expense.category) }}>
                                            {expense.category}
                                        </span>
                                        <span className="expense-date">
                                            {new Date(expense.date).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                </div>
                                <div className="expense-amount-section">
                                    <span className="expense-amount-modern">${expense.amount.toFixed(2)}</span>
                                    <div className="expense-actions-modern">
                                        <button onClick={() => handleEdit(expense)} className="btn-icon-edit" title="Edit">
                                            ✏️
                                        </button>
                                        <button onClick={() => handleDelete(expense._id)} className="btn-icon-delete" title="Delete">
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {showModal && (
                <ExpenseModal
                    titleToEdit={titleToEdit}
                    onClose={handleModalClose}
                    existingTitles={allGroups}
                />
            )}
        </div>
    );
};

export default Dashboard;
