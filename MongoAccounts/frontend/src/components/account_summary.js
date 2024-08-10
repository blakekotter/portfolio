import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function AccountSummary() {
    const [account, setAccount] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchAccountSummary() {
            try {
                console.log('Fetching account summary...');
                const response = await fetch('http://localhost:4000/account_summary', {
                    method: 'GET',
                    credentials: 'include', // Ensure credentials are included
                });

                console.log('Response status:', response.status);

                if (response.status === 401) {
                    console.log('Unauthorized: Redirecting to login');
                    navigate('/login');
                    return;
                }

                if (!response.ok) {
                    const message = `An error has occurred: ${response.statusText}`;
                    console.error(message);
                    window.alert(message);
                    return;
                }

                const account = await response.json();
                console.log('Account data received:', account);
                setAccount(account);
            } catch (error) {
                console.error('Error fetching account summary:', error);
            }
        }

        fetchAccountSummary();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:4000/logout', {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                navigate('/login');
            } else {
                window.alert('Failed to logout');
            }
        } catch (error) {
            console.error('Logout error:', error);
            window.alert('Failed to logout');
        }
    };

    return (
        <div>
            <h3>Account Summary</h3>
            <p>First Name: {account.firstname}</p>
            <p>Last Name: {account.lastname}</p>
            <p>Email: {account.email}</p>
            <p>Phone Number: {account.phoneNumber}</p>

            <Link to="/account_balance">
                <button>View Account Balance</button>
            </Link>

            {/* Logout button */}
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}
