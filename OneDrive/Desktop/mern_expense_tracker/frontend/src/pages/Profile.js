import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { removeToken } from '../utils/auth';
import '../App.css';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await api.get('/auth/me');
            setUser(response.data);
            setFormData({
                name: response.data.name,
                email: response.data.email
            });
        } catch (err) {
            console.error('Error fetching user:', err);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            await api.put('/auth/update-profile', formData);
            setSuccess('Profile updated successfully!');
            fetchUser();
        } catch (err) {
            setError(err.response?.data?.msg || 'Update failed');
        }
    };

    const handleLogout = () => {
        removeToken();
        navigate('/login');
    };

    if (!user) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>Profile</h1>
                <div className="header-actions">
                    <button onClick={() => navigate('/dashboard')} className="btn-secondary">
                        Back to Dashboard
                    </button>
                    <button onClick={handleLogout} className="btn-secondary">
                        Logout
                    </button>
                </div>
            </div>

            <div className="profile-box">
                <h2>Update Profile</h2>
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary">Update Profile</button>
                </form>

                <div className="profile-info">
                    <h3>Account Information</h3>
                    <p><strong>Member since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;
