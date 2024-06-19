const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const { FieldValue } = require("firebase-admin/firestore");

admin.initializeApp({
    serviceAccountId: process.env.SERVICE_ACCOUNT_ID
});

const auth = admin.auth();
const db = admin.firestore();
const app = express();

app.use(cors({
    origin: ['http://localhost:5173', 'https://sandorstefan62.github.io/']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Hello World!");
});

//user signup
app.post("/signup", async (req, res) => {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password || !role) {
        return res.status(400).send({ error: 'Missing required fields' });
    }

    if (password.length < 6) {
        return res.status(403).send({ error: "Parola trebuie să aibă cel puțin 6 caractere" });
    }

    try {
        const usernameSnapshot = await db.collection('useres').where('username', "==", username).get();
        if (!usernameSnapshot.empty) {
            return res.status(400).send({ message: 'Username is already taken' });
        }

        const emailSnapshot = await db.collection('users').where('email', "==", email).get();
        if (!emailSnapshot.empty) {
            return res.status(400).send({ message: 'Email is already in use' });
        }

        const userRecord = await admin.auth().createUser({
            email: email,
            password: password,
            displayName: username
        });

        const userRef = db.collection('users').doc();
        await userRef.set({
            uid: userRecord.uid,
            username: username,
            email: email,
            role: role,
            firstName: "",
            lastName: "",
            progress: 0
        });

        res.status(201).send({ message: 'User created successfully', uid: userRecord.uid });
    } catch (error) {
        console.error('Error creating new user:', error);
        res.status(500).send({ error: 'Error creating new user' });
    }
});

app.post("/login", async (req, res) => {
    const { identifier } = req.body;
    if (!identifier) {
        return res.status(400).send({ error: "Missing credentials" });
    }

    try {
        let userDoc;
        const userSnapshot = await db.collection("users").where("email", "==", identifier).get();
        if (!userSnapshot.empty) {
            userDoc = userSnapshot.docs[0];
        } else {
            const userSnapshotByUsername = await db.collection("users").where("username", "==", identifier).get();
            if (userSnapshotByUsername.empty) {
                return res.status(400).send({ error: "Invalid Username/Email." });
            }
            userDoc = userSnapshotByUsername.docs[0];
        }
        const userData = userDoc.data();
        await auth.setCustomUserClaims(userData.uid, { id: userDoc.id, role: userData.role });
        return res.status(200).send({ email: userData.email, message: "Successful" });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).send({ error: 'Error logging in user' });
    }
})

//verify user token 
app.post('/verify-token', async (req, res, next) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).send({ error: "Token is required." });
    }

    try {
        const decodedToken = await auth.verifyIdToken(token);
        return res.status(200).send({ message: "Success", decodedToken });
    } catch (error) {
        if (error.code === 'auth/id-token-expired') {
            return res.status(401).send({ error: "Token has expired." });
        } else if (error.code === 'auth/argument-error') {
            return res.status(400).send({ error: "Invalid token." });
        } else {
            console.error("Error verifying token: ", error);
            return res.status(500).send({ error: "Internal Server Error." });
        }
    }
});

//get user by id
app.get("/user/:id", async (req, res) => {
    const userId = req.params.id;
    try {
        const userReference = await db.collection("users").doc(userId).get();

        if (!userReference.exists) {
            return res.status(404).send({ error: "User not found." });
        }

        const userData = userReference.data();
        return res.status(200).send({ userData });
    } catch (error) {
        console.error("Error retrieving user data: ", error);
        return res.status(500).send({ error: "Inter Server Error" });
    }
});

//update user first name by id
app.patch("/user/:id/firstName", async (req, res) => {
    const userId = req.params.id;
    const { firstName } = req.body;

    try {
        const userReference = await db.collection("users").doc(userId);
        await userReference.update({ firstName });
        return res.status(200).send({ message: "First name updated successfully." });
    } catch (error) {
        console.error("Error updating first name: ", error);
        return res.status(500).send({ error: "Internal Server Error" });
    }
});

//update user last name by id
app.patch("/user/:id/lastName", async (req, res) => {
    const userId = req.params.id;
    const { lastName } = req.body;

    try {
        const userReference = await db.collection("users").doc(userId);
        await userReference.update({ lastName });
        return res.status(200).send({ message: "Last name updated successfully." });
    } catch (error) {
        console.error("Error updating last name: ", error);
        return res.status(500).send({ error: "Internal Server Error" });
    }
});

//update user username by id
app.patch("/user/:id/username", async (req, res) => {
    const userId = req.params.id;
    const { username } = req.body;
    try {
        const existingUserSnapshot = await db.collection("users").where("username", "==", username).get();

        if (!existingUserSnapshot.empty) {
            return res.status(400).send({ error: "Username already exists." });
        }

        const userReference = db.collection("users").doc(userId);
        await userReference.update({ username });
        return res.status(200).send({ message: "Username updated successfully." });
    } catch (error) {
        console.error("Error updating username: ", error);
        return res.status(500).send({ error: "Internal Server Error" });
    }
});

//edits user params by id
app.patch("/user/:id", async (req, res) => {
    const userId = req.params.id;
    const { username, firstName, lastName, role } = req.body;

    try {
        const updateData = {};
        if (username) updateData.username = username;
        if (firstName) updateData.firstName = firstName;
        if (lastName) updateData.lastName = lastName;
        if (role) updateData.role = role;

        const userSnapshot = await db.collection('users').where("uid", "==", userId).get();

        if (userSnapshot.empty) {
            return res.status(404).send({ error: "User not found" });
        }

        const userDoc = userSnapshot.docs[0].ref;
        await userDoc.update(updateData);

        return res.status(200).send({ message: "User updated successfully." });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
})

//fetches all users from db
app.get('/users', async (req, res) => {
    try {
        const usersSnapshot = await db.collection('users').get();
        const users = [];

        usersSnapshot.forEach((doc) => {
            users.push({ ...doc.data() });
        });

        return res.status(200).send(users);
    } catch (error) {
        console.error('Error fetching users: ', error);
        return res.status(500).send({ error: "Internal Server Error" });
    }
})

//deletes a user by id
app.delete("/user/:id", async (req, res) => {
    const userId = req.params.id;
    console.log(userId);

    try {
        const userSnapshot = await db.collection('users').where("uid", "==", userId).get();

        if (userSnapshot.empty) {
            return res.status(404).send({ error: "User not found" });
        }

        const userDoc = userSnapshot.docs[0].ref;
        await userDoc.delete();

        await auth.deleteUser(userId);

        res.status(200).json({ message: `User with ID ${userId} deleted successfully.` });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user.' });
    }
})

app.patch('/user/:id/progress', async (req, res) => {
    const userId = req.params.id;
    console.log(userId);

    try {
        const userSnapshot = await db.collection('users').where("uid", "==", userId).get();
        if (userSnapshot.empty) {
            return res.status(404).send({ error: "User not found" });
        }

        const userDoc = userSnapshot.docs[0].ref;

        await userDoc.update({
            progress: FieldValue.increment(1),
        });

        return res.status(200).send({ message: "User progress updated successfully" });
    } catch (error) {
        console.error('Error updating user progress: ', error);
        return res.status(500).send({ error: "Internal Server Error" });
    }
})

exports.api = functions.region('europe-west1').https.onRequest(app);