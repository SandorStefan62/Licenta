import React, { useEffect, useState } from "react";
import Motion from "../components/Motion";
import { motion } from "framer-motion";
import ReactPlayer from "react-player";
import { storage } from "../firebase.config";
import { ref, listAll, getDownloadURL, getMetadata, updateMetadata } from "firebase/storage";

function DictionaryComponent({ isAdmin }) {
    const [videoUrls, setVideoUrls] = useState([]);
    const [currentVideo, setCurrentVideo] = useState(null);
    const [newDescription, setNewDescription] = useState("");
    const [playerKeys, setPlayerKeys] = useState({});

    const fetchVideoUrls = async () => {
        const videosRef = ref(storage, "videos/");

        try {
            const videosList = await listAll(videosRef);
            const videoUrls = await Promise.all(
                videosList.items.map(async (item) => {
                    const url = await getDownloadURL(item);
                    const metadata = await getMetadata(item);
                    return {
                        name: item.name.replace('.mp4', ''),
                        description: metadata.customMetadata.description || "Nu exista instructiuni pentru acest cuvant",
                        url,
                        ref: item
                    };
                })
            );
            setVideoUrls(videoUrls);

            const initialPlayerKeys = videoUrls.reduce((keys, video, index) => {
                keys[video.name] = index;
                return keys;
            }, {});

            setPlayerKeys(initialPlayerKeys);
        } catch (error) {
            console.error('Error fetching videos:', error);
        }
    };

    const handleSendEditedDescription = async (video) => {
        if (!video) {
            alert("Nu s-a scris nimic in campul de editare!");
            return;
        }

        try {
            const newMetadata = {
                customMetadata: {
                    description: newDescription,
                }
            }

            const videoRef = ref(storage, `videos/${video.name}.mp4`);

            await updateMetadata(videoRef, newMetadata);

            setVideoUrls((prevVideoUrls) =>
                prevVideoUrls.map((v) =>
                    v.name === video.name ? { ...v, description: newDescription } : v
                )
            );
        } catch (error) {
            console.log("Error updating video metadata: ", error);
        }
    }

    const handleEditClick = (video) => {
        if (currentVideo === video) {
            handleSendEditedDescription(video);
            setCurrentVideo(null);
        } else {
            setCurrentVideo(video);
        }
    }

    const handleDescriptionChange = (e) => {
        setNewDescription(e.target.value);
    }

    const handleVideoEnd = (videoName) => {
        setPlayerKeys(prevPlayerKeys => ({
            ...prevPlayerKeys,
            [videoName]: prevPlayerKeys[videoName] + 1
        }));
    }

    useEffect(() => {
        console.log("Dictionary isAdmin: ", isAdmin);
        fetchVideoUrls();
    }, []);

    return (
        <div className="w-full flex flex-col items-center gap-4 p-4">
            {videoUrls.map((video, index) => (
                <div key={index} className="w-9/10 h-96 bg-tertiary-color rounded-[30px] flex items-center">
                    <div className="w-5/10 h-full flex flex-col items-center">
                        <h1 className="my-4">{video.name}</h1>
                        <div className="w-9/10 h-8/10 bg-white rounded-3xl shadow-lg overflow-hidden">
                            <div className="w-full h-full">
                                <ReactPlayer
                                    key={playerKeys[video.name]}
                                    url={video.url}
                                    width="100%"
                                    height="100%"
                                    controls
                                    light={false}
                                    style={{ backgroundColor: 'black' }}
                                    onEnded={() => handleVideoEnd(video.name)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="w-5/10 h-9/10 mr-4 rounded-xl bg-blue-300">
                        <div className="w-full h-1/2">
                            <h1 className="pt-4 pl-4 text-4xl font-bold mb-2">Instrucțiuni:</h1>
                            {(currentVideo === video) ?
                                <motion.input
                                    initial={{ backgroundColor: (currentVideo === video) ? "bg-blue-300" : "var(--tertiary-color)", paddingLeft: (currentVideo === video) ? 0 : "0.5rem" }}
                                    animate={{ backgroundColor: (currentVideo === video) ? "var(--tertiary-color)" : "bg-blue-300", paddingLeft: (currentVideo === video) ? "0.5rem" : 0 }}
                                    className={`w-full h-full placeholder:text-white bg-transparent border-none outline-none rounded-md`}
                                    type="text"
                                    placeholder={video.description}
                                    value={newDescription}
                                    onChange={(e) => handleDescriptionChange(e)}
                                />
                                :
                                <p className="pl-4 text-xl">{video.description}</p>
                            }
                        </div>
                        <div className="w-full h-1/2 flex items-end justify-end pr-4 pb-4 gap-4">
                            {
                                isAdmin && <motion.button
                                    className="flex items-center justify-center w-64 h-12 bg-secondary-color rounded-xl text-xl font-bold pb-1"
                                    whileHover={{ scale: [null, 1.3, 1.2] }}
                                    transition={{ duration: 0.2 }}
                                    type="button"
                                    onClick={() => handleEditClick(video)}
                                >
                                    {(currentVideo === video) ? "Trimiteți" : "Modificati instrucțiunile"}
                                </motion.button>
                            }
                            <motion.button
                                className="flex items-center justify-center w-48 h-12 bg-secondary-color rounded-xl text-xl font-bold pb-1"
                                whileHover={{ scale: [null, 1.3, 1.2] }}
                                transition={{ duration: 0.2 }}
                                type="button"
                            >
                                Exersați cuvântul
                            </motion.button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

const Dictionary = Motion(DictionaryComponent);

export default Dictionary;