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

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [action, setAction] = useState("Sign Up");
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/");
    }

    return (
        <div className="w-full h-screen flex justify-center items-center">
            <form onSubmit={handleLogin} className="flex flex-col m-auto bg-primary-color pb-8 w-128 rounded-3xl">
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
                                        <img className="w-" src={User} alt="User" />
                                        <input type="text" placeholder="Enter Username" />
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
                                        <input type="email" placeholder="Enter Email" />
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
                                        <input type="password" placeholder="Enter Password" />
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
                                        <input type="text" placeholder="Enter Username or Email" />
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
                                        <input type="password" placeholder="Enter Password" />
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
                                onClick={() => { setAction("Sign Up") }}
                            >
                                Sign Up
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: [null, 1.3, 1.2] }}
                                transition={{ duration: 0.2 }}
                                type="button"
                                style={(action === "Login" ? {} : { color: "rgba(4, 110, 143, 0.3)", backgroundColor: "var(--tertiary-color)" })}
                                onClick={() => { setAction("Login") }}
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