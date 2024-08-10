import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
    const [form, setForm] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { id, value } = e.target;
        setForm(prevForm => ({
            ...prevForm,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Login form submitted');
        console.log('Form data:', form);

        try {
            const response = await fetch('http://localhost:4000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
                credentials: 'include',
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorMessage = await response.json();
                console.error('Error message:', errorMessage);
                throw new Error(errorMessage);
            }

            console.log('Login successful');
            navigate('/account_summary'); // Navigate to account summary page

        } catch (error) {
            console.error('Email or password not recognized');
            setError(error.message);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{"Invalid email or password'"}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input type="email" id="email" value={form.email} onChange={handleChange} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" id="password" value={form.password} onChange={handleChange} required
                    />
                </div>
                <br />
                <button type="submit">Login</button>
            </form>
            <p>Don't have an account? <Link to="/register">Register here</Link></p>
        </div>
    );
};

