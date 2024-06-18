import React, { useState } from "react";

import Upload from "../assets/upload.svg";
import { storage } from "../firebase.config";
import { getDownloadURL, uploadBytesResumable, ref } from "firebase/storage";

function FileInput() {
    const [file, setFile] = useState(undefined);
    const [message, setMessage] = useState("");

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        console.log(selectedFile);
        if (selectedFile) {
            setFile(selectedFile);
        }
    }

    const handleFileUpload = async () => {
        if (!file) {
            setMessage("Nu s-a ales niciun fișier");
            alert("Alertă: " + message);
            return;
        }

        const fileSizeLimit = 10 * 1024 * 1024 //10mb
        if (file.size > fileSizeLimit) {
            alert("Fișierul depășește limita de 10MB.");
            return;
        }

        const allowedFileType = "video/mp4";
        if (file.type !== allowedFileType) {
            alert("Doar fișiere de tip .mp4 sunt permise.");
            return;
        }

        const storageRef = ref(storage, `videos/${file.name}`);
        const metadata = {
            customMetadata: {
                description: ""
            }
        }

        const uploadTask = uploadBytesResumable(storageRef, file, metadata);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + "% done");
            },
            (error) => {
                console.error("Error uploading file: ", error);
                alert("Eroare la încărcarea fișierului");
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log("File available at: ", downloadURL);
                    alert("Fișierul a fost încărcat cu succes");
                })
            }
        )
    }

    return (
        <div className="tall:h-6/10 tall:w-1/2 h-5/10 w-2/3 bg-[#89abf5] rounded-2xl m-0 pt-2 flex flex-col gap-y-4">
            <h1 className="tall:text-2xl text-sm font-bold text-center">Încărcați Videoclipul</h1>
            <div className="tall:h-1/2 h-6/10 flex flex-col items-center">
                <div className="w-2/3 h-9/10 pb-4 rounded-xl border-2 relative border-dashed flex flex-col">
                    <img className="w-9/10 h-9/10 self-center" src={Upload} alt="Upload" />
                    <p className="text-sm text-center">Încărcați videoclipul aici</p>
                    <input className="opacity-0 absolute w-full h-full cursor-pointer top-0 left-0" type="file" onChange={handleFileChange} />
                </div>
                <button
                    className="tall:mt-4 tall:px-4 tall:py-2 mt-1 px-1 py-0.5 bg-secondary-color text-white text-sm font-bold rounded-lg"
                    onClick={handleFileUpload}
                >
                    Încărcați
                </button>
            </div>
            {message && <p className="text-center mt-8">{message}</p>}
        </div>
    )
}

export default FileInput