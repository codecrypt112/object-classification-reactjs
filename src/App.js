import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
//import "./App.css";
import { useSpeechSynthesis } from 'react-speech-kit';

function App() {
  const webcamRef = useRef(null);
  const [objects, setObjects] = useState([]);
   const { speak } = useSpeechSynthesis();

  const runDetection = async () => {
    const net = await cocoSsd.load();
    setInterval(() => {
      detect(net);
    }, 100);
  };

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;
      const canvas = document.createElement("canvas");
      canvas.width = videoWidth;
      canvas.height = videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
      const input = tf.browser.fromPixels(canvas);
      const results = await net.detect(input);
      setObjects(results);
    }
  };

  useEffect(() => {
    runDetection();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          muted={true}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />
        {objects.map((object, index) => (
          <div key={index} className="object-box">
            
              <button onClick={() => speak({object.class})}>Speak</button>
          </div>
        ))}
      </header>
    </div>
  );
}

export default App;
