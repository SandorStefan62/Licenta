import React, { useEffect, useState } from "react";
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import Motion from "../components/Motion";
import FileInput from "../components/FileInput";

import Avatar from "../assets/placeholder.jpg";

function DictionaryComponent() {
    const [users, setUsers] = useState([{
        uid: "1",
        username: "john_doe",
        email: "john.doe@example.com",
        firstName: "John",
        lastName: "Doe",
        role: "Admin"
    },
    {
        uid: "2",
        username: "jane_smith",
        email: "jane.smith@example.com",
        firstName: "Jane",
        lastName: "Smith",
        role: "User"
    },
    {
        uid: "3",
        username: "mike_jones",
        email: "mike.jones@example.com",
        firstName: "Mike",
        lastName: "Jones",
        role: "Admin"
    },
    {
        uid: "4",
        username: "anna_brown",
        email: "anna.brown@example.com",
        firstName: "Anna",
        lastName: "Brown",
        role: "User"
    },
    {
        uid: "5",
        username: "sam_wilson",
        email: "sam.wilson@example.com",
        firstName: "Sam",
        lastName: "Wilson",
        role: "Admin"
    },
    {
        uid: "6",
        username: "emily_clark",
        email: "emily.clark@example.com",
        firstName: "Emily",
        lastName: "Clark",
        role: "User"
    },
    {
        uid: "7",
        username: "david_white",
        email: "david.white@example.com",
        firstName: "David",
        lastName: "White",
        role: "Admin"
    },
    {
        uid: "8",
        username: "lisa_thomas",
        email: "lisa.thomas@example.com",
        firstName: "Lisa",
        lastName: "Thomas",
        role: "User"
    },
    {
        uid: "9",
        username: "peter_green",
        email: "peter.green@example.com",
        firstName: "Peter",
        lastName: "Green",
        role: "Admin"
    },
    {
        uid: "10",
        username: "sophia_harris",
        email: "sophia.harris@example.com",
        firstName: "Sophia",
        lastName: "Harris",
        role: "User"
    },
    {
        uid: "11",
        username: "alex_smith",
        email: "alex.smith@example.com",
        firstName: "Alex",
        lastName: "Smith",
        role: "Admin"
    }]);
    const [user, setUser] = useState({
        uid: "",
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        role: ""
    });
    const [sortBy, setSortBy] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const [editingUserId, setEditingUserId] = useState(null);
    const [editValues, setEditValues] = useState({})

    const fetchAllUsers = async () => {
        try {
            const response = await fetch("http://localhost:5000/proiect-licenta-fc2a8/europe-west1/api/users");
            const data = await response.json();
            if (response.ok) {
                const updatedUsers = data.map(user => ({
                    uid: user.uid,
                    username: user.username,
                    email: user.email,
                    firstName: user.firstName || "",
                    lastName: user.lastName || "",
                    role: user.role
                }));
                setUsers(updatedUsers);
            }
        } catch (error) {
            console.error("Error fetching all users: ", error);
        }
    }

    const fetchAdminProfileData = async () => {
        const token = localStorage.getItem('token');
        try {
            if (!token) {
                throw new Error("Token not found.");
            } else {
                const decodedToken = jwtDecode(token);
                const userId = decodedToken.id;
                const response = await fetch(`http://localhost:5000/proiect-licenta-fc2a8/europe-west1/api/user/${userId}`, {
                    method: "GET"
                });
                const data = await response.json();

                if (response.ok) {
                    if (!data.userData.firstName && !data.userData.lastName) {
                        setUser({
                            uid: data.userData.uid,
                            firstName: "",
                            lastName: "",
                            username: data.userData.username,
                            email: data.userData.email,
                            role: data.userData.role
                        });
                    } else if (!data.userData.firstName) {
                        setUser({
                            uid: data.userData.uid,
                            firstName: "",
                            lastName: data.userData.lastName,
                            username: data.userData.username,
                            email: data.userData.email,
                            role: data.userData.role
                        });
                    } else if (!data.userData.lastName) {
                        setUser({
                            uid: data.userData.uid,
                            firstName: data.userData.firstName,
                            lastName: "",
                            username: data.userData.username,
                            email: data.userData.email,
                            role: data.userData.role
                        });
                    } else {
                        setUser({
                            uid: data.userData.uid,
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

    const handleSort = (key) => {
        if (sortBy === key) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(key);
            setSortOrder("asc");
        }

        const sortedUsers = [...users].sort((a, b) => {
            if (sortOrder === "asc") {
                return a[key].localeCompare(b[key], undefined, { sensitivity: 'base' });
            } else {
                return b[key].localeCompare(a[key], undefined, { sensitivity: 'base' });
            }
        });

        setUsers(sortedUsers);
    }

    const handleEditClick = (userId, user) => {
        if (editingUserId === userId) {
            setEditingUserId(null);
            setEditValues({});
        } else {
            setEditingUserId(userId);
            setEditValues(user);
        }
    }

    const handleChange = (e, field) => {
        setEditValues({
            ...editValues,
            [field]: e.target.value,
        });
    }

    const submitEditFields = async () => {
        const uid = editingUserId;
        try {
            const response = await fetch(`http://localhost:5000/proiect-licenta-fc2a8/europe-west1/api/user/${uid}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: editValues.username,
                    firstName: editValues.firstName,
                    lastName: editValues.lastName,
                    role: editValues.role
                }),
            });
            if (response.ok) {
                if (editingUserId === user.uid) {
                    fetchAdminProfileData();
                }
                fetchAllUsers();
                setEditingUserId(null);
                setEditValues({});
            } else {
                alert("Failed to update user.");
                throw new Error("Failed to update user");
            }
        } catch (error) {
            console.error("Error updating user:", error);
        }
    }

    const handleDeleteUser = async () => {
        const uid = editingUserId;
        console.log(uid);
        try {
            const response = await fetch(`http://localhost:5000/proiect-licenta-fc2a8/europe-west1/api/user/${uid}`, {
                method: "DELETE"
            });

            if (response.ok) {
                fetchAllUsers();
                setEditingUserId(null);
                setEditValues({});
            } else {
                alert("Failed to delete user.");
                throw new Error("Failed to delete user");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    }

    useEffect(() => {
        fetchAdminProfileData();
        fetchAllUsers();
    }, [])

    return (
        <div className="w-full h-full absolute flex flex-col items-center gap-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: [null, 1.02, 1] }}
                transition={{ duration: 0.2, delay: 0.1 }}
                className="h-3/5 mt-14 rounded-[30px] flex flex-row justify-center bg-tertiary-color" style={{ width: "97%" }}
            >
                <div className="w-9/10 my-6 flex flex-col items-center rounded-3xl overflow-hidden no-scrollbar">
                    <LayoutGroup>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: [null, 1.02, 1] }}
                            transition={{ duration: 0.2, delay: 0.3 }}
                            className="w-full h-full bg-[#89abf5] no-scrollbar flex flex-col items-center overflow-x-hidden"
                        >
                            <h1 className="my-2">(Click on the table headers to sort entries by field)</h1>
                            <table className="min-w-full rounded-xl border-spacing-0 border-separate">
                                <thead className="sticky top-0">
                                    <tr className="rounded-xl">
                                        <th
                                            className="w-2/10 py-2 px-4 bg-secondary-color text-left cursor-pointer rounded-tl-3xl"
                                            onClick={() => handleSort('username')}
                                        >
                                            Username {sortBy === 'username' && (sortOrder === 'asc' ? '▲' : '▼')}
                                        </th>
                                        <th
                                            className="w-2/10 py-2 px-4 bg-secondary-color text-left cursor-pointer"
                                            onClick={() => handleSort('email')}
                                        >
                                            Email {sortBy === 'email' && (sortOrder === 'asc' ? '▲' : '▼')}
                                        </th>
                                        <th
                                            className="w-1/10 py-2 px-4 bg-secondary-color text-left cursor-pointer"
                                            onClick={() => handleSort('firstName')}
                                        >
                                            First Name {sortBy === 'firstName' && (sortOrder === 'asc' ? '▲' : '▼')}
                                        </th>
                                        <th
                                            className="w-1/10 py-2 px-4 bg-secondary-color text-left cursor-pointer"
                                            onClick={() => handleSort('lastName')}
                                        >
                                            Last Name {sortBy === 'lastName' && (sortOrder === 'asc' ? '▲' : '▼')}
                                        </th>
                                        <th
                                            className="w-2/10 py-2 px-4 bg-secondary-color text-left cursor-pointer"
                                            onClick={() => handleSort('role')}
                                        >
                                            Role {sortBy === 'role' && (sortOrder === 'asc' ? '▲' : '▼')}
                                        </th>
                                        <th className="py-2 px-4 bg-secondary-color text-left rounded-tr-3xl">Edit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user, index) => (
                                        <motion.tr
                                            key={user.uid}
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="h-16 odd:bg-[#89abf599] even:bg-[#89abf5] last:rounded-bl-3xl"
                                        >
                                            <td className="py-2 px-4 border-0 border-b-2 border-solid border-b-blue-300">
                                                {editingUserId === user.uid ? (
                                                    <motion.input
                                                        initial={{ backgroundColor: (editingUserId === user.uid) ? "#89abf5" : "var(--tertiary-color)", paddingLeft: (editingUserId === user.uid) ? "0" : "0.5rem" }}
                                                        animate={{ backgroundColor: (editingUserId === user.uid) ? "var(--tertiary-color)" : "#89abf5", paddingLeft: (editingUserId === user.uid) ? "0.5rem" : "0" }}
                                                        transition={{ duration: 0.2 }}
                                                        className="bg-transparent border-none outline-none rounded-md"
                                                        placeholder="Username"
                                                        value={editValues.username}
                                                        onChange={(e) => handleChange(e, 'username')}
                                                    />
                                                ) : (
                                                    user.username
                                                )}
                                            </td>
                                            <td className="py-2 px-4 border-0 border-b-2 border-solid border-b-blue-300">
                                                {user.email}
                                            </td>
                                            <td className="py-2 px-4 border-0 border-b-2 border-solid border-b-blue-300">
                                                {editingUserId === user.uid ? (
                                                    <motion.input
                                                        initial={{ backgroundColor: (editingUserId === user.uid) ? "#89abf5" : "var(--tertiary-color)", paddingLeft: (editingUserId === user.uid) ? "0" : "0.5rem" }}
                                                        animate={{ backgroundColor: (editingUserId === user.uid) ? "var(--tertiary-color)" : "#89abf5", paddingLeft: (editingUserId === user.uid) ? "0.5rem" : "0" }}
                                                        transition={{ duration: 0.2 }}
                                                        className="bg-transparent border-none outline-none rounded-md"
                                                        placeholder="First Name"
                                                        value={editValues.firstName}
                                                        onChange={(e) => handleChange(e, 'firstName')}
                                                    />
                                                ) : (
                                                    user.firstName
                                                )}
                                            </td>
                                            <td className="py-2 px-4 border-0 border-b-2 border-solid border-b-blue-300">
                                                {editingUserId === user.uid ? (
                                                    <motion.input
                                                        initial={{ backgroundColor: (editingUserId === user.uid) ? "#89abf5" : "var(--tertiary-color)", paddingLeft: (editingUserId === user.uid) ? "0" : "0.5rem" }}
                                                        animate={{ backgroundColor: (editingUserId === user.uid) ? "var(--tertiary-color)" : "#89abf5", paddingLeft: (editingUserId === user.uid) ? "0.5rem" : "0" }}
                                                        transition={{ duration: 0.2 }}
                                                        className="bg-transparent border-none outline-none rounded-md"
                                                        placeholder="Last Name"
                                                        value={editValues.lastName}
                                                        onChange={(e) => handleChange(e, 'lastName')}
                                                    />
                                                ) : (
                                                    user.lastName
                                                )}
                                            </td>
                                            <td className="py-2 px-4 border-0 border-b-2 border-solid border-b-blue-300">
                                                {editingUserId === user.uid ? (
                                                    <motion.input
                                                        initial={{ backgroundColor: (editingUserId === user.uid) ? "#89abf5" : "var(--tertiary-color)", paddingLeft: (editingUserId === user.uid) ? "0" : "0.5rem" }}
                                                        animate={{ backgroundColor: (editingUserId === user.uid) ? "var(--tertiary-color)" : "#89abf5", paddingLeft: (editingUserId === user.uid) ? "0.5rem" : "0" }}
                                                        transition={{ duration: 0.2 }}
                                                        className="bg-transparent border-none outline-none rounded-md"
                                                        placeholder="Role"
                                                        value={editValues.role}
                                                        onChange={(e) => handleChange(e, 'role')}
                                                    />
                                                ) : (
                                                    user.role
                                                )}
                                            </td>
                                            <td className="py-2 px-4 border-0 border-b-2 border-solid border-b-blue-300">
                                                <div className="flex justify-between">
                                                    <button onClick={() => handleEditClick(user.uid, user)}>
                                                        {editingUserId === user.uid ? "Anulare" : "Editați parametri"}
                                                    </button>
                                                    <AnimatePresence>
                                                        {
                                                            (editingUserId === user.uid) &&
                                                            (
                                                                <>
                                                                    <motion.button
                                                                        initial={{ opacity: 0, scale: 0.95 }}
                                                                        animate={{ opacity: 1, scale: [null, 1.2, 1] }}
                                                                        exit={{ opacity: 0, scale: 0.95 }}
                                                                        transition={{ duration: 0.2 }}
                                                                        whileHover={{ scale: [null, 1.3, 1.2] }}
                                                                        onClick={() => submitEditFields()}
                                                                    >
                                                                        Trimiteți
                                                                    </motion.button>
                                                                    <motion.button
                                                                        initial={{ opacity: 0, scale: 0.95 }}
                                                                        animate={{ opacity: 1, scale: [null, 1.2, 1] }}
                                                                        exit={{ opacity: 0, scale: 0.95 }}
                                                                        transition={{ duration: 0.2 }}
                                                                        whileHover={{ scale: [null, 1.3, 1.2] }}
                                                                        className="mr-4"
                                                                        onClick={() => handleDeleteUser()}
                                                                    >
                                                                        Ștergeți
                                                                    </motion.button>
                                                                </>
                                                            )
                                                        }
                                                    </AnimatePresence>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </motion.div>
                    </LayoutGroup>
                </div>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: [null, 1.02, 1] }}
                transition={{ duration: 0.2, delay: 0.2 }}
                className="h-2/5 mb-14 rounded-[30px] px-24 flex items-center justify-between bg-tertiary-color"
                style={{ width: "97%" }}
            >
                <div className="flex flex-col items-center pb-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: [null, 1.02, 1] }}
                        transition={{ duration: 0.2, delay: 0.5 }}
                        className="tall:w-56 tall:h-56 w-24 h-24 scale-25 mt-6 bg-[#89abf5] rounded-full flex justify-center items-center"
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
                        <h1 className="text-2xl font-bold mt-4">{user.role}</h1>
                    </motion.div>
                </div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: [null, 1.02, 1] }}
                    transition={{ duration: 0.2, delay: 0.6 }}
                    className="w-1/3 h-full flex flex-col items-center justify-center"
                >
                    <div className="w-full">
                        <h1 className="text-l text-center">Încărcați videoclipuri LMG</h1>
                        <h1 className="text-sm text-center">Fișierul trebuie să fie de format .mp4 și să nu depășească 10MB.</h1>
                    </div>
                    <FileInput />
                </motion.div>
            </motion.div>
        </div>
    )
}

const Admin = Motion(DictionaryComponent)

export default Admin