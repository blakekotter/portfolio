import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        async function logout() {
            const response = await fetch('http://localhost:4000/logout', {
                method: "POST",
                credentials: "include",
            });
            if (!response.ok) {
                const message = `An error has occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
            navigate('/login'); // Redirect to login page after logout
        }

        logout(); 
    }, [navigate]);

    return (
        <div>
            <h3>Logging out...</h3>
        </div>
    );
}

