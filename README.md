# Video Recorder in Next.js

```markdown
# Video Recorder Component

This is a React component built with Next.js and Tailwind CSS that allows users to record video and audio from their device. The recorded video is automatically downloaded when the recording is stopped.

## Features

- **Start/Stop Recording**: Toggle the recording on and off with a single button.
- **Auto-Download**: The recorded video is automatically downloaded when the recording is stopped.
- **Responsive Design**: Styled with Tailwind CSS for a sleek, responsive interface.

## Installation

To use this component in your Next.js project, follow these steps:

### 1. Clone the repository

```bash
git clone https://github.com/your-username/video-recorder-component.git
cd video-recorder-component
```

### Add Tailwind CSS

Added custom animation in tailwind  `tailwind.config.js`:

1. ```javascript
   // tailwind.config.js
   module.exports = {
     content: [
       './pages/**/*.{js,ts,jsx,tsx}',
       './components/**/*.{js,ts,jsx,tsx}',
     ],
     theme: {
       extend: {
         keyframes: {
           pulse: {
             '0%': { boxShadow: '0px 0px 5px 0px rgba(173,0,0,.3)' },
             '65%': { boxShadow: '0px 0px 5px 13px rgba(173,0,0,.3)' },
             '90%': { boxShadow: '0px 0px 5px 13px rgba(173,0,0,0)' },
           },
         },
         animation: {
           pulse: 'pulse 1.5s linear infinite',
         },
       },
     },
     plugins: [],
   };
   ```

   Video recording component

```tsx
import { useState, useRef } from 'react';

const VideoRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoChunksRef = useRef<Blob[]>([]);

  const handleRecording = async () => {
    if (isRecording) {
      // Stop recording
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    } else {
      // Start recording
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'video/webm',
      });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          videoChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(videoChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);

        // Automatically download the recorded video
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'recorded-video.webm';
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);

        // Clear the video chunks
        videoChunksRef.current = [];
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    }
  };

  return (
    <button
      id="recButton"
      onClick={handleRecording}
      className={`w-[35px] h-[35px] ${isRecording ? 'bg-red animate-pulse' : 'bg-darkred'} border-0 rounded-full m-4 outline-none cursor-pointer`}
    />
  );
};

export default VideoRecorder;
```

### 5. Usage

To use the `RecordingButton` component in your application, import it and include it in your JSX:

```tsx
import VideoRecorder from '../components/VideoRecorder';

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <VideoRecorder />
    </div>
  );
}
```

### Change Download Format

The component currently records and downloads the video in `video/webm` format. If you need a different format, you can modify the `mimeType` in the `MediaRecorder` configuration.
