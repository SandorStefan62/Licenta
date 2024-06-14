import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const verifyToken = async (token) => {
        try {
            const response = await fetch('https://europe-west1-proiect-licenta-fc2a8.cloudfunctions.net/api/verify-token', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token }),
            });

            if (response.ok) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error("Error verifying token: ", error);
            setIsAuthenticated(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            verifyToken(token);
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    if (!isAuthenticated) {
        return <div>Loading...</div>
    }

    return isAuthenticated ? children : <Navigate to="/Login" />;
}

export default ProtectedRoute;