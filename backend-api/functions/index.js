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

exports.api = functions.region('europe-west1').https.onRequest(app);