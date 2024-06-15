import React, { useState, useRef, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion"

//All the svg files
import User from "../assets/user.svg";
import Letter from "../assets/letter.svg";
import Lock from "../assets/lock.svg";

const Input = styled.div`
display: flex;
flex-direction: row;
align-items: center;
background-color: var(--tertiary-color);
width: 20rem;
height: 4rem;
border-radius: 0.33rem;

img {
    width: 1.2rem;
    margin: 0 0.75rem;
}

input {
    width: 16rem;
    height: 1.5rem;
    background: transparent;
    border: none;
    outline: none;
}

input::placeholder {
    color: white;
}
`;

const ActionContainer = styled.div`
display: flex;
gap: 2rem;
margin: 0.875rem auto;

button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 10rem;
    height: 3rem;
    background: #56E39F;
    border-radius: 2rem;
    font-size: 1.5rem;
    font-weight: 700;
    padding-bottom: 4px;
}
`;

function Login({ setIsLoggedIn }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [action, setAction] = useState("Sign Up");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/proiect-licenta-fc2a8/europe-west1/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ identifier, password })
            });

            const data = await response.json();
            if (response.ok) {
                const token = data.token;
                localStorage.setItem("token", token);
                setIsLoggedIn(true);
                navigate("/");
            } else {
                alert("Login failed: " + data.error);
            }
        } catch (error) {
            console.error("Error during login: ", error);
            alert("Error during login. Please try again.");
        }
    }

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/proiect-licenta-fc2a8/europe-west1/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, email, password, role: "user" })
            });

            const data = await response.json();
            if (response.ok) {
                setAction("Login");
                alert("Registration successful! Please log in.");
            } else {
                alert("Registration failed: " + data.message);
            }
        } catch (error) {
            console.error("Error during registration: ", error);
        }
    }

    const handleSubmit = (e) => {
        if (action === "Sign Up") {
            handleSignUp(e);
        } else {
            handleLogin(e);
        }
    }

    const clearFields = () => {
        setUsername("");
        setEmail("");
        setIdentifier("");
        setPassword("");
    }

    return (
        <div className="w-full h-screen flex justify-center items-center">
            <form onSubmit={handleSubmit} className="flex flex-col m-auto bg-primary-color pb-8 w-128 rounded-3xl">
                <motion.div
                    initial={{ height: action === "Sign Up" ? '32rem' : '28rem' }}
                    animate={{ height: action === "Sign Up" ? '32rem' : '28rem' }}
                    transition={{ duration: 0.1 }}
                    className="flex flex-col"
                >
                    <div className="flex flex-col items-center gap-2.5 w-full mt-8">
                        <motion.h1
                            key={action}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.2 }}
                            className="text-5xl font-bold"
                        >
                            {action}
                        </motion.h1>
                        <div className="w-16 h-1.5 bg-white rounded-xl"></div>
                    </div>
                    <div className="mt-8 flex flex-col items-center gap-6">
                        <AnimatePresence mode="wait">
                            {action === "Sign Up" ? (
                                <>
                                    <Input
                                        as={motion.div}
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        transition={{ duration: 0.2, delay: 0.1 }}
                                        key="signup-username"
                                    >
                                        <img src={User} alt="User" />
                                        <input
                                            type="text"
                                            placeholder="Enter Username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                    </Input>
                                    <Input
                                        as={motion.div}
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        transition={{ duration: 0.2, delay: 0.2 }}
                                        key="signup-email"
                                    >
                                        <img src={Letter} alt="Email" />
                                        <input
                                            type="email"
                                            placeholder="Enter Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </Input>
                                    <Input
                                        as={motion.div}
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        transition={{ duration: 0.2, delay: 0.3 }}
                                        key="signup-password"
                                    >
                                        <img src={Lock} alt="Password" />
                                        <input
                                            type="password"
                                            placeholder="Enter Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </Input>
                                </>
                            ) : (
                                <>
                                    <Input
                                        as={motion.div}
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        transition={{ duration: 0.2, delay: 0.1 }}
                                        key="login-username"
                                    >
                                        <img src={User} alt="User" />
                                        <input
                                            type="text"
                                            placeholder="Enter Username or Email"
                                            value={identifier}
                                            onChange={(e) => setIdentifier(e.target.value)}
                                        />
                                    </Input>
                                    <Input
                                        as={motion.div}
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        transition={{ duration: 0.2, delay: 0.2 }}
                                        key="login-password"
                                    >
                                        <img src={Lock} alt="Password" />
                                        <input
                                            type="password"
                                            placeholder="Enter Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </Input>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-80 mt-1.5 text-xl text-right cursor-pointer">Forgot Password?</div>
                        <ActionContainer>
                            <motion.button
                                whileHover={{ scale: [null, 1.3, 1.2] }}
                                transition={{ duration: 0.2 }}
                                type="button"
                                style={(action === "Sign Up" ? {} : { color: "rgba(4, 110, 143, 0.3)", backgroundColor: "var(--tertiary-color)" })}
                                onClick={() => { setAction("Sign Up"); clearFields() }}
                            >
                                Sign Up
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: [null, 1.3, 1.2] }}
                                transition={{ duration: 0.2 }}
                                type="button"
                                style={(action === "Login" ? {} : { color: "rgba(4, 110, 143, 0.3)", backgroundColor: "var(--tertiary-color)" })}
                                onClick={() => { setAction("Login"); clearFields() }}
                            >
                                Login
                            </motion.button>
                        </ActionContainer>
                        <button type="submit">Submit</button>
                    </div>
                </motion.div>
            </form>
        </div >
    )
}

export default Login