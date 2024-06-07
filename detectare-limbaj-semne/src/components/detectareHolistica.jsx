import React, { useRef, useEffect } from "react"
import {
    Holistic,
    POSE_LANDMARKS,
    HAND_CONNECTIONS,
    FACEMESH_TESSELATION,
    FACEMESH_RIGHT_EYE,
    FACEMESH_RIGHT_EYEBROW,
    FACEMESH_LEFT_EYE,
    FACEMESH_LEFT_EYEBROW,
    FACEMESH_FACE_OVAL,
    FACEMESH_LIPS
} from "@mediapipe/holistic"
import * as Camera from "@mediapipe/camera_utils"
import * as drawingUtils from "@mediapipe/drawing_utils"


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

        //deseneaza punctele cheie ale corpului
        canvasCtx.lineWidth = 5;
        if (results.poseLandmarks) {
            for (const landmark of results.poseLandmarks) {
                canvasCtx.beginPath();
                canvasCtx.arc(landmark.x * canvasElement.width, landmark.y * canvasElement.height, 2, 0, 2 * Math.PI);
                canvasCtx.fillStyle = "rgba(0, 255, 255, 0.5)";
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

        drawingUtils.drawConnectors(canvasCtx, results.poseLandmarks, POSE_LANDMARKS, { color: 'white' });


        drawingUtils.drawConnectors(canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS, { color: 'white' });
        drawingUtils.drawLandmarks(canvasCtx, results.rightHandLandmarks, {
            color: 'white',
            fillColor: 'rgb(0,217,231)',
            lineWidth: 2,
            radius: (data) => drawingUtils.lerp(data.from.z, -0.15, .1, 10, 1)
        });
        drawingUtils.drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS, { color: 'white' });
        drawingUtils.drawLandmarks(canvasCtx, results.leftHandLandmarks, {
            color: 'white',
            fillColor: 'rgb(255,138,0)',
            lineWidth: 2,
            radius: (data) => drawingUtils.lerp(data.from.z, -0.15, .1, 10, 1)
        });

        drawingUtils.drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION, { color: '#C0C0C070', lineWidth: 1 });
        drawingUtils.drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_RIGHT_EYE, { color: 'rgb(0,217,231)' });
        drawingUtils.drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_RIGHT_EYEBROW, { color: 'rgb(0,217,231)' });
        drawingUtils.drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_LEFT_EYE, { color: 'rgb(255,138,0)' });
        drawingUtils.drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_LEFT_EYEBROW, { color: 'rgb(255,138,0)' });
        drawingUtils.drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_FACE_OVAL, { color: '#E0E0E0', lineWidth: 5 });
        drawingUtils.drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_LIPS, { color: '#E0E0E0', lineWidth: 5 });

        canvasCtx.restore();
    }

    useEffect(() => {
        if (effectRan.current === false) {
            const holistic = new Holistic({
                locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`,
            });

            holistic.setOptions({
                modelComplexity: 1,
                selfieMode: true,
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
                    width: 1920,
                    height: 1080,
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
            <canvas ref={canvasRef} width="960" height="540"></canvas>
        </div>
    )
}

export default DetectareHolistica