import React, { useRef, useEffect } from "react"
import { Holistic } from "@mediapipe/holistic"
import * as Camera from "@mediapipe/camera_utils"


function DetectareHolistica() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const effectRan = useRef(false)

    function onResults(results) {
        const canvasElement = canvasRef.current;
        const canvasCtx = canvasElement.getContext('2d');

        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

        //deseneaza punctele cheie ale fetei
        if (results.faceLandmarks) {
            for (const landmark of results.faceLandmarks) {
                canvasCtx.beginPath();
                canvasCtx.arc(landmark.x * canvasElement.width, landmark.y * canvasElement.height, 1, 0, 2 * Math.PI);
                canvasCtx.fillStyle = 'rgba(255, 255, 0, 0.5)';
                canvasCtx.fill();
            }
        }

        //deseneaza punctele cheie ale corpului
        if (results.poseLandmarks) {
            for (const landmark of results.poseLandmarks) {
                canvasCtx.beginPath();
                canvasCtx.arc(landmark.x * canvasElement.width, landmark.y * canvasElement.height, 2, 0, 2 * Math.PI);
                canvasCtx.fillStyle = 'rgba(0, 255, 255, 0.5';
                canvasCtx.fill();
            }
        }

        //deseneaza pucntele cheie ale mainii stangi
        if (results.leftHandLandmarks) {
            for (const landmark of results.leftHandLandmarks) {
                canvasCtx.beginPath();
                canvasCtx.arc(landmark.x * canvasElement.width, landmark.y * canvasElement.height, 2, 0, 2 * Math.PI);
                canvasCtx.fillStyle = 'rgba(0, 252, 124, 0.5';
                canvasCtx.fill();
            }
        }

        //deseneaza punctele cheie ale mainii drepte
        if (results.rightHandLandmarks) {
            for (const landmark of results.rightHandLandmarks) {
                canvasCtx.beginPath();
                canvasCtx.arc(landmark.x * canvasElement.width, landmark.y * canvasElement.height, 2, 0, 2 * Math.PI);
                canvasCtx.fillStyle = 'rgba(43, 75, 238, 0.5';
                canvasCtx.fill();
            }
        }

        canvasCtx.restore();
    }

    useEffect(() => {
        if (effectRan.current === false) {
            const holistic = new Holistic({
                locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`,
            });

            holistic.setOptions({
                modelComplexity: 1,
                smoothLandmarks: true,
                enableSegmentation: true,
                smoothSegmentation: true,
                refineFaceLandmarks: true,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5,
            });

            holistic.onResults(onResults);

            if (typeof videoRef.current !== "undefined" && videoRef.current !== null) {
                const camera = new Camera.Camera(videoRef.current, {
                    onFrame: async () => {
                        try {
                            await holistic.send({ image: videoRef.current });
                        } catch (error) {
                            console.error("Eroare la trimiterea video-ului spre MediaPipe: ", error);
                        }
                    },
                    width: 640,
                    height: 480,
                });
                camera.start();
            }

            return () => {
                effectRan.current = true;
            }
        }
    }, []);

    return (
        <div>
            <video ref={videoRef} style={{ display: 'none' }}></video>
            <canvas ref={canvasRef} width="640" height="480"></canvas>
        </div>
    )
}

export default DetectareHolistica