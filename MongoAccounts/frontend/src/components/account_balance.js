import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function AccountBalance() {
    const navigate = useNavigate();

    const [balances, setBalances] = useState({ savings: 0, checking: 0 });
    const [updateBalances, setUpdateBalances] = useState({ savings: 0, checking: 0 });
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchBalances() {
            try {
                const response = await fetch('http://localhost:4000/account_balance', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.status === 401) {
                    navigate('/login');
                    return;
                }

                if (!response.ok) {
                    const message = `An error has occurred: ${response.statusText}`;
                    window.alert(message);
                    return;
                }

                const balancesData = await response.json();
                setBalances(balancesData);
            } catch (error) {
                console.error('Error fetching account balances:', error);
            }
        }

        fetchBalances();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newSavings = balances.savings + parseFloat(updateBalances.savings);
        const newChecking = balances.checking + parseFloat(updateBalances.checking);

        if (newSavings < 0 || newChecking < 0) {
            setError("Cannot withdraw beyond $0");
            return;
        }

        try {
            const response = await fetch('http://localhost:4000/update_balances', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ savings: newSavings, checking: newChecking }),
                credentials: 'include',
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }

            setBalances({ savings: newSavings, checking: newChecking });
            setUpdateBalances({ savings: 0, checking: 0 });
            setError(''); 
        } catch (error) {
            console.error('Error updating balances:', error);
            setError(error.message || 'Failed to update balances');
        }
    };

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
            <h3>Account Balance</h3>
            <Link to="/account_summary">
                <button>Back to Account Summary</button>
            </Link>

            <button onClick={handleLogout}>Logout</button>

            <p>Savings: ${balances.savings}</p>
            <p>Checking: ${balances.checking}</p>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="savings">Savings:</label>
                    <input
                        type="number"
                        id="savings"
                        name="savings"
                        value={updateBalances.savings}
                        onChange={(e) => setUpdateBalances({ ...updateBalances, savings: parseFloat(e.target.value) })}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="checking">Checking:</label>
                    <input
                        type="number"
                        id="checking"
                        name="checking"
                        value={updateBalances.checking}
                        onChange={(e) => setUpdateBalances({ ...updateBalances, checking: parseFloat(e.target.value) })}
                        required
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <br />
                <button type="submit">Update Balances</button>
            </form>
        </div>
    );
}
