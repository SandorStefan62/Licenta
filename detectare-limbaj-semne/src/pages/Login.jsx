import React, { useState, useRef, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion"
import { auth } from "../firebase.config";
import { sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithRedirect, signOut } from "firebase/auth";

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
    const [resetEmail, setResetEmail] = useState("");
    const [showResetPassword, setShowResetPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("https://europe-west1-proiect-licenta-fc2a8.cloudfunctions.net/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ identifier, password })
            });

            const data = await response.json();
            if (response.ok) {
                const userCredential = await signInWithEmailAndPassword(auth, data.email, password);
                const user = userCredential.user;
                if (user.emailVerified) {
                    const token = await user.getIdToken();
                    localStorage.setItem("token", token);
                    setIsLoggedIn(true);
                    clearFields();
                    navigate("/");
                } else {
                    alert("Logarea a eșuat: email-ul nu a fost verificat încă.");
                }
            } else {
                alert("Logare eșuată: " + data.error);
            }
        } catch (error) {
            console.error("Eroare la logare: ", error);
            alert("Credențiale invalide. Vă rugăm să incercați din nou.");
        }
    }

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("https://europe-west1-proiect-licenta-fc2a8.cloudfunctions.net/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, email, password, role: "user" })
            });

            const data = await response.json();
            if (response.ok) {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                await sendEmailVerification(userCredential.user);
                setAction("Login");
                clearFields();
                alert("Înregistrarea a fost executată cu succes. Vă rugăm să verificați email-ul.");
                await signOut(auth);
                setAction("Login");
            } else {
                alert("Înregistrare eșuată: " + data.error);
            }
        } catch (error) {
            console.error("Error during registration: ", error);
        }
    }

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            await sendPasswordResetEmail(auth, resetEmail);
            alert("Email-ul pentru schimbarea parolei a fost trimis!");
            setShowResetPassword(false);
        } catch (error) {
            console.error("Eroare la schimbarea parolei: ", error);
            alert("Failed to send password reset email.");
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
                                            placeholder="Introduceți username-ul"
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
                                            placeholder="Introduceți email-ul"
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
                                            placeholder="Introduceți parola"
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
                                            placeholder="Introduceți username sau email"
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
                                            placeholder="Introduceți parola"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </Input>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                    {action === "Login" && <div className="w-80 mt-1.5 ml-24 text-xl text-right cursor-pointer" onClick={() => setShowResetPassword(true)}>Ați uitat parola?</div>}
                    <div className="flex flex-col items-center pt-4">
                        <ActionContainer>
                            <motion.button
                                whileHover={{ scale: [null, 1.3, 1.2] }}
                                transition={{ duration: 0.2 }}
                                type="button"
                                style={(action === "Sign Up" ? {} : { color: "rgba(4, 110, 143, 0.3)", backgroundColor: "var(--tertiary-color)" })}
                                onClick={() => { setAction("Sign Up"); clearFields() }}
                            >
                                Înregistrare
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: [null, 1.3, 1.2] }}
                                transition={{ duration: 0.2 }}
                                type="button"
                                style={(action === "Login" ? {} : { color: "rgba(4, 110, 143, 0.3)", backgroundColor: "var(--tertiary-color)" })}
                                onClick={() => { setAction("Login"); clearFields() }}
                            >
                                Logare
                            </motion.button>
                        </ActionContainer>
                        <button type="submit">Trimiteți</button>
                    </div>
                </motion.div>
            </form>
            <AnimatePresence>
                {showResetPassword && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="w-full h-full fixed top-0 left-0 flex justify-center items-center bg-black bg-opacity-50"
                    >
                        <motion.div
                            initial={{ opacity: 0.1, scale: 0.95 }}
                            animate={{ opacity: 1, scale: [null, 1.02, 1] }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="w-1/3 bg-primary-color p-4 rounded-lg"
                        >
                            <h2 className="text-2xl mb-4">Schimbați parola</h2>
                            <form className="flex flex-col items-center" onSubmit={handleResetPassword}>
                                <div className="w-7/10 flex justify-center">
                                    <Input>
                                        <img src={Letter} alt="Email" />
                                        <input
                                            type="email"
                                            placeholder="Introduceți email-ul"
                                            value={resetEmail}
                                            onChange={(e) => setResetEmail(e.target.value)}
                                            required
                                        />
                                    </Input>
                                </div>
                                <div className="flex justify-between w-9/10 mt-4">
                                    <motion.button
                                        type="submit"
                                        className="flex justify-center items-center w-32 h-12 bg-secondary-color rounded-3xl text-white font-bold text-sm"
                                        whileHover={{ scale: [null, 1.2, 1.1] }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        Trimiteți email pentru resetare
                                    </motion.button>
                                    <motion.button
                                        type="button"
                                        className="flex justify-center items-center w-24 h-12 bg-tertiary-color rounded-3xl text-white font-bold text-sm"
                                        whileHover={{ scale: [null, 1.2, 1.1] }}
                                        transition={{ duration: 0.2 }}
                                        onClick={() => setShowResetPassword(false)}
                                    >
                                        Anulați
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    )
}

export default Login