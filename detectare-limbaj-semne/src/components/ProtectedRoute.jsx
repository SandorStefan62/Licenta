import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, ...rest }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const verifyToken = async (token) => {
        try {
            const response = await fetch('http://localhost:5000/proiect-licenta-fc2a8/europe-west1/api/verify-token', {
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
            alert("Error: " + error);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            verifyToken(token);
        } else {
            setIsAuthenticated(false);
            setIsLoading(false);
        }
    }, []);

    if (isLoading) {
        return (<></>);
    }

    return isAuthenticated ? React.cloneElement(children, { ...rest }) : <Navigate to="/Login" />;
}

export default ProtectedRoute;