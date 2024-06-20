import React, { useEffect, useState } from "react";
import Motion from "../components/Motion";
import { AnimatePresence, motion } from "framer-motion";
import { jwtDecode } from "jwt-decode"

import Avatar from "../assets/placeholder.jpg"

function UserProfileComponent() {
    const [isEditingFirstName, setIsEditingFirstName] = useState(false);
    const [isEditingLastName, setIsEditingLastName] = useState(false);
    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [initialAnimationComplete, setInitialAnimationComplete] = useState(false);
    const [token, setToken] = useState(null);
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        role: ""
    })

    const handleEditFirstName = () => {
        setIsEditingFirstName(!isEditingFirstName);
    };

    const submitEditFirstName = async () => {
        console.log("am intrat in submit");
        try {
            const token = localStorage.getItem('token');
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.id;

            const response = await fetch(`https://europe-west1-proiect-licenta-fc2a8.cloudfunctions.net/api/user/${userId}/firstName`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ firstName: user.firstName }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data.message);
            } else {
                const errorData = await response.json();
                console.error("Failed to update first name: ", errorData.error);
            }
        } catch (error) {
            console.error("Error updating first name: ", error);
        } finally {
            setIsEditingFirstName(false);
            fetchUserData(token);
        }
    }

    const handleEditLastName = () => {
        setIsEditingLastName(!isEditingLastName);
    }

    const submitEditLastName = async () => {
        try {
            const token = localStorage.getItem('token');
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.id;

            const response = await fetch(`https://europe-west1-proiect-licenta-fc2a8.cloudfunctions.net/api/user/${userId}/lastName`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ lastName: user.lastName }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data.message);
            } else {
                const errorData = await response.json();
                console.error("Failed to update last name: ", errorData.error);
            }
        } catch (error) {
            console.error("Error updating last name: ", error);
        } finally {
            setIsEditingLastName(false);
            fetchUserData(token);
        }
    }

    const handleEditUsername = () => {
        setIsEditingUsername(!isEditingUsername);
    }

    const submitEditUsername = async () => {
        try {
            const token = localStorage.getItem('token');
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.id;

            const response = await fetch(`https://europe-west1-proiect-licenta-fc2a8.cloudfunctions.net/api/user/${userId}/username`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username: user.username }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data.message);
            } else {
                const errorData = await response.json();
                alert("Failed to update username: " + errorData.error);
                console.error("Failed to update username: ", errorData.error);
            }
        } catch (error) {
            console.error("Error updating username: ", error);
        } finally {
            setIsEditingUsername(false);
            fetchUserData(token);
        }
    }

    const fetchUserData = async (token) => {
        try {
            if (!token) {
                throw new Error("Token not found.");
            } else {
                const decodedToken = jwtDecode(token);
                const userId = decodedToken.id;
                const response = await fetch(`https://europe-west1-proiect-licenta-fc2a8.cloudfunctions.net/api/user/${userId}`);
                const data = await response.json();

                if (response.ok) {
                    if (!data.userData.firstName && !data.userData.lastName) {
                        setUser({
                            firstName: "",
                            lastName: "",
                            username: data.userData.username,
                            email: data.userData.email,
                            role: data.userData.role
                        });
                    } else if (!data.userData.firstName) {
                        setUser({
                            firstName: "",
                            lastName: data.userData.lastName,
                            username: data.userData.username,
                            email: data.userData.email,
                            role: data.userData.role
                        });
                    } else if (!data.userData.lastName) {
                        setUser({
                            firstName: data.userData.firstName,
                            lastName: "",
                            username: data.userData.username,
                            email: data.userData.email,
                            role: data.userData.role
                        });
                    } else {
                        setUser({
                            firstName: data.userData.firstName,
                            lastName: data.userData.lastName,
                            username: data.userData.username,
                            email: data.userData.email,
                            role: data.userData.role
                        });
                    }
                } else {
                    console.error("Failed to fetch user data: ", data.error);
                }
            }
        } catch (error) {
            console.error("Error fetching user: ", error);
        }
    }

    useEffect(() => {
        setToken(localStorage.getItem('token'));
        const token = localStorage.getItem('token');
        if (token) {
            fetchUserData(token);
        }
    }, [])

    return (
        <div className="w-full h-full absolute flex flex-row justify-center items-center gap-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: [null, 1.02, 1] }}
                transition={{ duration: 0.2, delay: 0.2 }}
                className="w-1/3 ml-4 h-9/10 bg-tertiary-color rounded-[30px] flex flex-col items-center"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: [null, 1.02, 1] }}
                    transition={{ duration: 0.2, delay: 0.5 }}
                    className="w-56 h-56 mt-6 bg-[#89abf5] rounded-full flex justify-center items-center"
                >
                    <img className="h-9/10 w-9/10 rounded-full" src={Avatar} alt="Avatar" />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: [null, 1.02, 1] }}
                    transition={{ duration: 0.2, delay: 0.6 }}
                    className="text-center"
                >
                    <h1 className="text-4xl font-bold mt-4">{user.username}</h1>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: [null, 1.02, 1] }}
                    transition={{ duration: 0.2, delay: 0.7 }}
                    onAnimationComplete={() => setInitialAnimationComplete(true)}
                    className="text-center"
                >
                    <h1 className="text-2xl font-bold mt-4">Rangul curent: Newbie</h1>
                </motion.div>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: [null, 1.02, 1] }}
                transition={{ duration: 0.2, delay: 0.3 }}
                className="w-2/3 h-9/10 mr-4 pt-2 bg-tertiary-color rounded-[30px] flex flex-col items-center"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: [null, 1.02, 1] }}
                    transition={{ duration: 0.2, delay: 0.5 }}
                    className="w-9/10 h-1/10 my-4 bg-[#89abf5] rounded-2xl flex items-center justify-between"
                >
                    <h1 className="text-2xl font-bold ml-4">
                        Prenume:&nbsp;
                        <motion.input
                            initial={{ backgroundColor: isEditingFirstName ? "#89abf5" : "var(--tertiary-color)", paddingLeft: isEditingFirstName ? "0" : "0.5rem" }}
                            animate={{ backgroundColor: isEditingFirstName ? "var(--tertiary-color)" : "#89abf5", paddingLeft: isEditingFirstName ? "0.5rem" : "0" }}
                            transition={{ duration: 0.2 }}
                            className={`bg-transparent border-none outline-none rounded-md`}
                            placeholder={user.firstName}
                            value={user.firstName}
                            onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                            disabled={!isEditingFirstName}
                        />
                    </h1>
                    <AnimatePresence>
                        {
                            isEditingFirstName &&
                            (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: [null, 1.2, 1] }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2, delay: initialAnimationComplete ? 0 : 0.5 }}
                                    whileHover={{ scale: [null, 1.3, 1.2] }}
                                    className="w-2/10 h-12 rounded-xl ml-32 text-xl font-bold bg-secondary-color"
                                    onClick={() => submitEditFirstName()}
                                >
                                    Schimbați prenumele
                                </motion.button>
                            )
                        }
                    </AnimatePresence>
                    <motion.button
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: [null, 1.02, 1] }}
                        transition={{ duration: 0.2, delay: initialAnimationComplete ? 0 : 0.5 }}
                        whileHover={{ scale: [null, 1.3, 1.2] }}
                        className="w-2/10 h-12 rounded-xl text-xl font-bold mr-4 bg-secondary-color"
                        onClick={() => handleEditFirstName()}
                    >
                        {isEditingFirstName ? "Anulați" : "Schimbați prenumele"}
                    </motion.button>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: [null, 1.02, 1] }}
                    transition={{ duration: 0.2, delay: 0.6 }}
                    className="w-9/10 h-1/10 my-2 bg-[#89abf5] rounded-2xl flex items-center justify-between"
                >
                    <h1 className="text-2xl font-bold ml-4">
                        Nume:&nbsp;
                        <motion.input
                            initial={{ backgroundColor: isEditingLastName ? "#89abf5" : "var(--tertiary-color)", paddingLeft: isEditingLastName ? 0 : "0.5rem" }}
                            animate={{ backgroundColor: isEditingLastName ? "var(--tertiary-color)" : "#89abf5", paddingLeft: isEditingLastName ? "0.5rem" : 0 }}
                            className={`bg-transparent border-none outline-none rounded-md`}
                            placeholder={user.lastName}
                            value={user.lastName}
                            onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                            disabled={!isEditingLastName}
                        />
                    </h1>
                    <AnimatePresence>
                        {
                            isEditingLastName &&
                            (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: [null, 1.2, 1] }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2, delay: initialAnimationComplete ? 0 : 0.5 }}
                                    whileHover={{ scale: [null, 1.3, 1.2] }}
                                    className="w-2/10 h-12 rounded-xl ml-32 text-xl font-bold bg-secondary-color"
                                    onClick={() => submitEditLastName()}
                                >
                                    Schimbați numele
                                </motion.button>
                            )
                        }
                    </AnimatePresence>
                    <motion.button
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: [null, 1.02, 1] }}
                        transition={{ duration: 0.2, delay: initialAnimationComplete ? 0 : 0.5 }}
                        whileHover={{ scale: [null, 1.3, 1.2] }}
                        className="w-2/10 h-12 rounded-xl text-xl font-bold mr-4 bg-secondary-color"
                        onClick={() => handleEditLastName()}
                    >
                        {isEditingLastName ? "Anulați" : "Schimbați numele"}
                    </motion.button>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: [null, 1.02, 1] }}
                    transition={{ duration: 0.2, delay: 0.7 }}
                    className="w-9/10 h-1/10 my-4 bg-[#89abf5] rounded-2xl flex items-center justify-between"
                >
                    <h1 className="text-2xl font-bold ml-4">
                        Username:&nbsp;
                        <motion.input
                            initial={{ backgroundColor: isEditingUsername ? "#89abf5" : "var(--tertiary-color)", paddingLeft: isEditingUsername ? 0 : "0.5rem" }}
                            animate={{ backgroundColor: isEditingUsername ? "var(--tertiary-color)" : "#89abf5", paddingLeft: isEditingUsername ? "0.5rem" : 0 }}
                            className={`bg-transparent border-none outline-none rounded-md`}
                            placeholder={user.username}
                            value={user.username}
                            onChange={(e) => setUser({ ...user, username: e.target.value })}
                            disabled={!isEditingUsername}
                        />
                    </h1>
                    <AnimatePresence>
                        {
                            isEditingUsername &&
                            (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: [null, 1.2, 1] }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2, delay: initialAnimationComplete ? 0 : 0.5 }}
                                    whileHover={{ scale: [null, 1.3, 1.2] }}
                                    className="w-2/10 h-12 rounded-xl ml-32 text-xl font-bold bg-secondary-color"
                                    onClick={() => submitEditUsername()}
                                >
                                    Schimbați username-ul
                                </motion.button>
                            )
                        }
                    </AnimatePresence>
                    <motion.button
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: [null, 1.02, 1] }}
                        transition={{ duration: 0.2, delay: initialAnimationComplete ? 0 : 0.5 }}
                        whileHover={{ scale: [null, 1.3, 1.2] }}
                        className="w-2/10 h-12 rounded-xl text-xl font-bold mr-4 bg-secondary-color"
                        onClick={() => handleEditUsername()}
                    >
                        {isEditingUsername ? "Anulați" : "Schimbați username-ul"}
                    </motion.button>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: [null, 1.02, 1] }}
                    transition={{ duration: 0.2, delay: 0.8 }}
                    className="w-9/10 h-1/10 my-2 bg-[#89abf5] rounded-2xl flex items-center justify-between"
                >
                    <h1 className="text-2xl font-bold ml-4">Email: {user.email}</h1>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: [null, 1.02, 1] }}
                    transition={{ duration: 0.2, delay: 0.9 }}
                    className="w-9/10 h-1/10 my-4 bg-[#89abf5] rounded-2xl flex items-center justify-between"
                >
                    <h1 className="text-2xl font-bold ml-4">Rol: {user.role}</h1>
                </motion.div>
            </motion.div>
        </div>
    );
}

const UserProfile = Motion(UserProfileComponent);

export default UserProfile;