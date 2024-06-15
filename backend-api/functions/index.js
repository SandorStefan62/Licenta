const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
require("dotenv").config();
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;

admin.initializeApp();

const db = admin.firestore();
const app = express();

app.use(cors({
    origin: 'http://localhost:5173'
}));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

//user signup
app.post("/signup", async (req, res) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
        return res
            .status(400)
            .send({ error: "Username, email and password are required." });
    } else if (!role || (role !== "admin" && role !== "user")) {
        return res.status(400).send({ error: "Invalid role." });
    } else {
        try {
            const userSnapshot = await db
                .collection("users")
                .where("email", "==", email)
                .get();
            if (!userSnapshot.empty) {
                return res
                    .status(400)
                    .send({ error: "User already exists." });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const userRef = db.collection("users").doc();
            await userRef.set({
                username,
                email,
                password: hashedPassword,
                role,
                firstName: "",
                lastName: "",
                progress: "",
            });

            return res
                .status(201)
                .send({ message: "User created successfully." });
        } catch (error) {
            console.error("Error creating user: ", error);
            return res
                .status(500)
                .send({ error: "Internal Server Error" });
        }
    }
});

//user login
app.post("/login", async (req, res) => {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
        return res
            .status(400)
            .send({ error: "Identifier (username/email) and password are required." });
    } else {
        try {
            const userSnapshot = await db
                .collection("users")
                .where("email", "==", identifier)
                .get();
            let userDoc;
            if (!userSnapshot.empty) {
                userDoc = userSnapshot.docs[0];
            } else {
                const userSnapshotByUsername = await db
                    .collection("users")
                    .where("username", "==", identifier)
                    .get();
                if (userSnapshotByUsername.empty) {
                    return res.status(400).send({ error: "Invalid Username/Email." });
                }
                userDoc = userSnapshotByUsername.docs[0];
            }


            const userData = userDoc.data();
            console.log(userDoc.id);

            const passwordMatch = await bcrypt.compare(password, userData.password);
            if (!passwordMatch) {
                return res
                    .status(400)
                    .send({ error: "Invalid Password." });
            }

            const issuedAt = new Date();
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + 1);

            const token = jwt.sign({
                id: userDoc.id,
                username: userData.username,
                role: userData.role,
                iat: Math.floor(issuedAt.getTime() / 1000),
                exp: Math.floor(expiresAt.getTime() / 1000),
            }, jwtSecret);

            return res.status(200).send({
                message: "Login successful.",
                token: token,
            });
        } catch (error) {
            console.error("error loggin in user: ", error);
            return res
                .status(500)
                .send({ error: "Internal Server Error" });
        }
    }
});

//verify user token 
app.post('/verify-token', (req, res, next) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).send({ error: "Token is required." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
            console.error('Error verifying token: ', error);
            return res.status(401).send({ error: "Invalid token." });
        }

        return res.status(200).send({ success: true });
    });
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

    console.log(username);

    try {
        const userReference = db.collection("users").doc(userId);
        await userReference.update({ username });
        return res.status(200).send({ message: "Username updated successfully." });
    } catch (error) {
        console.error("Error updating username: ", error);
        return res.status(500).send({ error: "Internal Server Error" });
    }
});

exports.api = functions.region('europe-west1').https.onRequest(app);