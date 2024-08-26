"use client"
import { useEffect, useRef, useState } from "react";

const VideoRecorder: React.FC = () => {
  const videoLiveRef = useRef<HTMLVideoElement>(null);
  const videoRecordedRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const init = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (videoLiveRef.current) {
        videoLiveRef.current.srcObject = stream;
      }

      if (!MediaRecorder.isTypeSupported("video/webm")) {
        console.warn("video/webm is not supported");
        return;
      }

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "video/webm",
      });

      mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
        if (videoRecordedRef.current) {
          videoRecordedRef.current.src = URL.createObjectURL(event.data);
        }
      });
    };

    init();
  }, []);

  //   const handleRecording = () => {
  //     isRecording
  //       ? mediaRecorderRef.current?.stop()
  //       : mediaRecorderRef.current?.start();
  //     setIsRecording((prev) => !prev);
  //   };

  //   const [isRecording, setIsRecording] = useState(false);
  //   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoChunksRef = useRef<Blob[]>([]);

  const handleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
    } else {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "video/webm",
      });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          videoChunksRef.current.push(event.data);
          //   show recorded video in the view box
          if (videoRecordedRef.current) {
            videoRecordedRef.current.src = URL.createObjectURL(event.data);
          }
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(videoChunksRef.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);

        // automatically download the video
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = "recorded-video.webm";
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);

        // Clear the video chunks
        videoChunksRef.current = [];
      };

      mediaRecorderRef.current.start();
    }
    setIsRecording((prev) => !prev);
  };

  return (
    <div className="w-creen h-screen flex flex-col items-center justify-center align-middle p-4">
      <h1 className="text-3xl font-semibold mb-4 text-gray-600">
        Press the Red Button to Start the Recording!
      </h1>
      <div className="w-full flex flex-col sm:flex-row justify-center align-middle items-center mb-20 gap-20">
        <video
          ref={videoLiveRef}
          autoPlay
          muted
          playsInline
          className="w-[400px] h-[300px]  bg-black rounded"
        />
        <video
          ref={videoRecordedRef}
          controls
          playsInline
          className="w-[400px] h-[300px]  bg-black rounded"
        />
      </div>
      <div className="mb-4">
        <button
          id="recButton"
          onClick={handleRecording}
          className={`w-12 h-12 ${
            isRecording ? "bg-red-600 animate-recPulse" : "bg-red-800"
          } border-0 rounded-full m-4 outline-none cursor-pointer`}
        ></button>
      </div>
    </div>
  );
};

export default VideoRecorder;
