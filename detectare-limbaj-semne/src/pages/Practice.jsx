import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";

import Motion from "../components/Motion";
import DetectareHolistica from "../components/detectareHolistica";

function PracticeComponent() {
    const [predcition, setPrediction] = useState('');
    const location = useLocation();
    const videoName = location.state?.videoName || '';
    const [progressUpdated, setProgressUpdated] = useState(false);
    const [user, setUser] = useState({});

    const fetchUserData = async (token) => {
        try {
            if (!token) {
                throw new Error("Token not found.");
            } else {
                const decodedToken = jwtDecode(token);
                const userId = decodedToken.id;
                const response = await fetch(`http://localhost:5000/proiect-licenta-fc2a8/europe-west1/api/user/${userId}`);
                const data = await response.json();

                if (response.ok) {
                    if (!data.userData.firstName && !data.userData.lastName) {
                        setUser({
                            firstName: "",
                            lastName: "",
                            username: data.userData.username,
                            email: data.userData.email,
                            role: data.userData.role,
                            id: data.userData.uid,
                            progress: data.userData.progress
                        });
                    } else if (!data.userData.firstName) {
                        setUser({
                            firstName: "",
                            lastName: data.userData.lastName,
                            username: data.userData.username,
                            email: data.userData.email,
                            role: data.userData.role,
                            id: data.userData.uid,
                            progress: data.userData.progress
                        });
                    } else if (!data.userData.lastName) {
                        setUser({
                            firstName: data.userData.firstName,
                            lastName: "",
                            username: data.userData.username,
                            email: data.userData.email,
                            role: data.userData.role,
                            id: data.userData.uid,
                            progress: data.userData.progress
                        });
                    } else {
                        setUser({
                            firstName: data.userData.firstName,
                            lastName: data.userData.lastName,
                            username: data.userData.username,
                            email: data.userData.email,
                            role: data.userData.role,
                            id: data.userData.uid,
                            progress: data.userData.progress
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

    function removeDiacritics(input) {
        const diacriticsMap = {
            'ă': 'a', 'â': 'a', 'î': 'i', 'ș': 's', 'ț': 't',
            'Ă': 'A', 'Â': 'A', 'Î': 'I', 'Ș': 'S', 'Ț': 'T'
        };

        return input.replace(/[ăâîșțĂÂÎȘȚ]/g, match => diacriticsMap[match]);
    }

    const handlePredictionChange = async (predictedAction) => {
        setPrediction(predictedAction);
        const formatedPrediction = removeDiacritics(predcition);
        if ((formatedPrediction.toLowerCase() === videoName.toLowerCase()) && !progressUpdated) {
            setTimeout(async () => {
                try {
                    const response = await fetch(`http://localhost:5000/proiect-licenta-fc2a8/europe-west1/api/user/${user.id}/progress`, {
                        method: "PATCH"
                    });

                    if (response.ok) {
                        alert("Ati ghicit cuvântul, felicitări!");
                        setProgressUpdated(true);
                        fetchUserData(localStorage.getItem('token'));
                    }
                } catch (error) {
                    console.error("Error updating user progress: ", error);
                }
            }, 100);
        }
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetchUserData(token);
    }, [])

    return (
        <div className="w-full h-full absolute flex flex-row justify-center items-center gap-4">
            <motion.div
                className="w-full h-9/10 mx-4 rounded-[30px] bg-tertiary-color"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: [null, 1.02, 1] }}
                transition={{ duration: 0.2, delay: 0.2 }}
            >
                <div className="w-full h-2/3 pt-4 gap-4 flex flex-col items-center">
                    <h1 className="text-3xl font-bold underline">Detectarea cuvintelor mimate</h1>
                    <DetectareHolistica onPredictionChange={handlePredictionChange} />
                </div>
                <div className="w-full h-1/3 pt-4 gap-4 flex flex-col items-center">
                    <motion.div
                        className="w-1/2 h-full pt-4 mb-8 rounded-3xl bg-blue-300 gap-4 flex flex-col items center"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: [null, 1.02, 1] }}
                        transition={{ duration: 0.2, delay: 0.3 }}
                    >
                        <h1 className="text-4xl text-center">Bun venit pe pagina de detectare a limbajului semnelor</h1>
                        <h1 className="text-xl text-center">Vă rugăm să vă centrați în cadrul camerei video în așa fel încât să se vadă jumătatea de sus a corpului. După care încercați să reproduceți mișcarea prezentată în videoclipul cuvântului selectat.</h1>
                        <h1 className="text-2xl text-center">Cuvânt detectat: {predcition}</h1>
                        <h1>Scor: {user.progress}</h1>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    )
}

const Practice = Motion(PracticeComponent)

export default Practice