import { countFingers } from "@/utils/countFingers";
import { useEffect } from "react";

export function useHandTracking(
  videoRef: any,
  videoReady: boolean,
  setFingerCount: any,
) {
  useEffect(() => {
    if (!videoReady) return;

    let hands: any;
    let camera: any;

    async function init() {
      const video = videoRef.current;
      if (!video) return;

      const { Hands } = await import("@mediapipe/hands");
      const cameraUtils = await import("@mediapipe/camera_utils");

      const Camera = cameraUtils.Camera;

      hands = new Hands({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.6,
        minTrackingConfidence: 0.6,
      });

      hands.onResults((results: any) => {
        const landmarks = results.multiHandLandmarks?.[0];

        if (!landmarks) {
          setFingerCount(0);
          return;
        }

        setFingerCount(countFingers(landmarks));
      });

      camera = new Camera(video, {
        onFrame: async () => {
          if (video.readyState >= 2) {
            await hands.send({ image: video });
          }
        },
      });

      camera.start();
    }

    init();

    return () => {
      camera?.stop?.();
    };
  }, [videoReady]);
}
