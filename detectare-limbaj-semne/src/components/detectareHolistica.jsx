import React, { useRef, useEffect } from "react"
import { Holistic } from "@mediapipe/holistic"
import { Camera } from "@mediapipe/camera_utils"

function DetectareHolistica() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        const holistic = new Holistic({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`
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

        const camera = new Camera(videoRef.current, {
            onFrame: async () => {
                try {
                    await holistic.send({ image: videoRef.current });
                } catch (error) {
                    console.error("Error in sending image to Holistic:", error);
                }
            },
            width: 640,
            height: 480,
        });

        camera.start();

        function onResults(results) {
            const canvasElement = canvasRef.current;
            const canvasCtx = canvasElement.getContext('2d');

            canvasCtx.save();
            canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
            canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

            if (results.faceLandmarks) {
                for (const landmark of results.faceLandmarks) {
                    canvasCtx.beginPath();
                    canvasCtx.arc(landmark.x * canvasElement.width, landmark.y * canvasElement.height, 1, 0, 2 * Math.PI);
                    canvasCtx.fillStyle = 'rgba(255, 255, 0, 0.5)';
                    canvasCtx.fill();
                }
            }

            canvasCtx.restore();
        }

        return () => {
            holistic.close();
        };
    }, []);

    return (
        <div>
            <video ref={videoRef} style={{ display: 'none' }}></video>
            <canvas ref={canvasRef} width="640" height="480"></canvas>
        </div>
    );
}

export default DetectareHolistica