import React, { useRef, useEffect, useState, act } from "react"
import {
    Holistic,
    POSE_LANDMARKS,
    POSE_LANDMARKS_LEFT,
    POSE_LANDMARKS_RIGHT,
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
import * as tf from "@tensorflow/tfjs"

function DetectareHolistica() {
    const videoRef = useRef(null);
    const hiddenCanvasRef = useRef(null);

    const effectRan = useRef(false)
    const holisticRef = useRef(null);
    const cameraRef = useRef(null);

    //model variables
    const [model, setModel] = useState(null);
    const [predictions, setPredictions] = useState([]);
    const [sentence, setSentence] = useState([]);
    const [frames, setFrames] = useState([]);
    const [modelLoaded, setModelLoaded] = useState(false);
    const actions = ["buna ziua", "multumesc", "salut"];
    const treshold = 0.5;

    //load the model
    const loadModel = async () => {
        try {
            const loadedModel = await tf.loadLayersModel('../../cuvintejs/model.json');
            console.log("Successfully loaded model: ", loadedModel);
            setModel(loadedModel);
            setModelLoaded(true);
        } catch (error) {
            console.error("Eroare la incarcarea modelului:", error);
        }
    };

    //extract key values from mediapipe
    function extractKeyValues(results) {
        let corp = [];
        if (results.poseLandmarks) {
            corp = results.poseLandmarks.map(rez => [rez.x, rez.y, rez.z, rez.visibility]).flat();
        } else {
            corp = Array(132).fill(0);
        }

        let fata = [];
        if (results.faceLandmarks) {
            const filteredFaceLandmarks = results.faceLandmarks.slice(0, 468);
            fata = filteredFaceLandmarks.map(rez => [rez.x, rez.y, rez.z]).flat();
        } else {
            fata = Array(1404).fill(0);
        }

        let manaStanga = [];
        if (results.leftHandLandmarks) {
            manaStanga = results.leftHandLandmarks.map(rez => [rez.x, rez.y, rez.z]).flat();
        } else {
            manaStanga = Array(63).fill(0);
        }

        let manaDreapta = [];
        if (results.rightHandLandmarks) {
            manaDreapta = results.rightHandLandmarks.map(rez => [rez.x, rez.y, rez.z]).flat();
        } else {
            manaDreapta = Array(63).fill(0);
        }

        return [...corp, ...fata, ...manaStanga, ...manaDreapta];
    }

    function removeElements(landmarks, elements) {
        return landmarks.filter((_, index) => !Object.values(elements).includes(index));
    }

    function onResults(results) {
        const canvasElement = hiddenCanvasRef.current;
        const canvasCtx = canvasElement.getContext('2d');

        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
        canvasCtx.lineWidth = 5;

        if (results.poseLandmarks) {
            const filteredLandmarks = removeElements(results.poseLandmarks, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 16, 17, 18, 19, 20, 21, 22]);

            drawingUtils.drawConnectors(canvasCtx, filteredLandmarks, POSE_LANDMARKS, { color: 'white' })
            drawingUtils.drawLandmarks(
                canvasCtx,
                filteredLandmarks.filter((_, index) => Object.values(POSE_LANDMARKS_LEFT).includes(index)),
                { visibilityMin: 0.65, color: 'white', fillColor: 'rgb(86, 227, 159)' }
            );
            drawingUtils.drawLandmarks(
                canvasCtx,
                filteredLandmarks.filter((_, index) => Object.values(POSE_LANDMARKS_RIGHT).includes(index)),
                { visibilityMin: 0.65, color: 'white', fillColor: 'rgb(0, 217, 231)' }
            )
        }

        if (results.rightHandLandmarks) {
            drawingUtils.drawConnectors(canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS, { color: 'white' });
            drawingUtils.drawLandmarks(canvasCtx, results.rightHandLandmarks, {
                color: 'white',
                fillColor: 'rgb(0,217,231)',
                lineWidth: 2,
                radius: (data) => drawingUtils.lerp(data.from.z, -0.15, .1, 10, 1)
            });
        }

        if (results.leftHandLandmarks) {
            drawingUtils.drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS, { color: 'white' });
            drawingUtils.drawLandmarks(canvasCtx, results.leftHandLandmarks, {
                color: 'white',
                fillColor: 'rgb(86, 227, 159)',
                lineWidth: 2,
                radius: (data) => drawingUtils.lerp(data.from.z, -0.15, .1, 10, 1)
            });
        }

        if (results.faceLandmarks) {
            drawingUtils.drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION, { color: '#C0C0C070', lineWidth: 1 });
            drawingUtils.drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_RIGHT_EYE, { color: 'rgb(0,217,231)' });
            drawingUtils.drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_RIGHT_EYEBROW, { color: 'rgb(0,217,231)' });
            drawingUtils.drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_LEFT_EYE, { color: 'rgb(86, 227, 159)' });
            drawingUtils.drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_LEFT_EYEBROW, { color: 'rgb(86, 227, 159)' });
            drawingUtils.drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_FACE_OVAL, { color: '#E0E0E0', lineWidth: 5 });
            drawingUtils.drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_LIPS, { color: '#E0E0E0', lineWidth: 5 });
        }

        canvasCtx.restore();

        if (model) {
            const puncteCheie = extractKeyValues(results);
            setFrames(prevFrames => {
                const updatedFrames = [puncteCheie, ...prevFrames.slice(0, 59)];
                if (updatedFrames.length === 60) {
                    const prediction = model.predict(tf.tensor([updatedFrames])).arraySync()[0];
                    if (prediction) {
                        const maxPrediction = tf.tensor(prediction).argMax().dataSync()[0];
                        if (prediction[maxPrediction] > treshold) {
                            // console.log(actions[maxPrediction] + " " + Date(Date.now()));
                            setSentence(prevSentence => {
                                const updatedSentence = [...prevSentence];
                                if (updatedSentence.length === 0 || actions[maxPrediction] !== updatedSentence[updatedSentence.length - 1]) {
                                    updatedSentence.push(actions[maxPrediction]);
                                }
                                if (updatedSentence.length > 5) {
                                    updatedSentence.shift();
                                }
                                return updatedSentence;
                            })
                        }
                    }
                }
                return updatedFrames;
            });
        }
        else {
            console.log("Model is not loaded yet")
        }
    }

    useEffect(() => {
        loadModel();

        if (modelLoaded) {
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
                            if (videoRef.current) {
                                try {
                                    await holistic.send({ image: videoRef.current });
                                } catch (error) {
                                    console.error("Eroare la trimiterea video-ului spre MediaPipe: ", error);
                                }
                            }
                        },
                        width: 1920,
                        height: 1080,

                    });
                    camera.start();

                    holisticRef.current = holistic;
                    cameraRef.current = camera;
                }
                effectRan.current = true;
            }
        }
        return () => {
            effectRan.current = false;
            if (cameraRef.current) {
                cameraRef.current.stop();
            }
            if (holisticRef.current) {
                holisticRef.current.close()
            }
        }
    }, [modelLoaded]);

    return (
        <div style={{ width: '960px', height: '540px' }}>
            <video ref={videoRef} style={{ display: 'none' }}></video>
            <canvas ref={hiddenCanvasRef} width="1920" height="1080" style={{ maxWidth: '100%' }}></canvas>
            <div>{sentence.join(' ')}</div>
        </div>
    )
}

export default DetectareHolistica