import { useEffect, useRef } from "react";

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    let stream: MediaStream;

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: 1280,
            height: 720,
          },
        });

        const video = videoRef.current;
        if (!video) return;

        video.srcObject = stream;

        if (video.paused) {
          await video.play().catch((err) => {
            if (err.name !== "AbortError") {
              console.error("Camera play error:", err);
            }
          });
        }

        console.log("🎥 CAMERA STARTED");
      } catch (err) {
        console.error("Camera error:", err);
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  return videoRef;
}
