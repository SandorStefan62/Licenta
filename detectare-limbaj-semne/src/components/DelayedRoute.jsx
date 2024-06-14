import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DelayedRoute = ({ delay, path }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate(path);
        }, delay);

        return () => clearTimeout(timer);
    }, [delay, path, navigate]);

    return <div>Loading...</div>;
};

export default DelayedRoute;