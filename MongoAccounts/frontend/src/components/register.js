import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
    const [form, setForm] = useState({
        firstname: '',
        lastname: '',
        email: '',
        phoneNumber: '',
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
        console.log('Form data before submission:', form);

        try {
            const response = await fetch('http://localhost:4000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
                credentials: 'include',
            });
            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorMessage = await response.text();
                console.log('Error message:', errorMessage);
                throw new Error(errorMessage);
            }

            console.log('Registration successful');
            navigate('/account_summary');

        } catch (error) {
            console.log('Error during registration:', error.message);
            setError(error.message);
        }
    };

    return (
        <div>
            <h2>Register</h2>
            {error && <p style={{ color: 'red' }}>{"Email already in use"}</p>}
            <form onSubmit={handleSubmit}>
                <label htmlFor="firstname">First Name:</label>
                <input type="text" id="firstname" value={form.firstname} onChange={handleChange} required />
                <br />
                <label htmlFor="lastname">Last Name:</label>
                <input type="text" id="lastname" value={form.lastname} onChange={handleChange} required />
                <br />
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" value={form.email} onChange={handleChange} required />
                <br />
                <label htmlFor="phoneNumber">Phone Number:</label>
                <input type="tel" id="phoneNumber" name="phoneNumber" pattern="[0-9]{10}" title="Please enter a 10-digit phone number" value={form.phoneNumber} onChange={handleChange} required  />
                <br />
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" value={form.password} onChange={handleChange} required />
                <br />
                <button type="submit">Register</button>
            </form>

            <p>Already have an account? <Link to="/login">Log in here</Link></p>
        </div>
    );
};

