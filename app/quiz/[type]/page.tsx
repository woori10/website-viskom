"use client";

import Container from "@/component/ui/Container";
import { Huruf, hurufList } from "@/lib/data/huruf";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function countFingers(landmarks: any) {
  let count = 0;

  // index
  if (landmarks[8].y < landmarks[6].y) count++;

  // middle
  if (landmarks[12].y < landmarks[10].y) count++;

  // ring
  if (landmarks[16].y < landmarks[14].y) count++;

  // pinky
  if (landmarks[20].y < landmarks[18].y) count++;

  return count;
}

export default function QuizDetail() {
  const params = useParams<{ type: string }>();
  const rawType = params.type;
  const type = Array.isArray(rawType) ? rawType[0] : rawType;

  const filteredHuruf = hurufList.filter(
    (h) => h.type.toLowerCase() === type?.toLowerCase(),
  );

  const videoRef = useRef<HTMLVideoElement>(null);

  const [huruf, setHuruf] = useState<Huruf | null>(null);
  const [fingerCount, setFingerCount] = useState(0);
  const [videoReady, setVideoReady] = useState(false);

  const router = useRouter();

  // RANDOM HURUF
  useEffect(() => {
    if (filteredHuruf.length > 0) {
      const random =
        filteredHuruf[Math.floor(Math.random() * filteredHuruf.length)];
      setHuruf(random);
    }
  }, [type]);

  // CAMERA
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

        await video.play();

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

  // MEDIA PIPE (ONLY RUN WHEN VIDEO READY)
  useEffect(() => {
    if (!videoReady) return;

    let hands: any;
    let camera: any;

    async function init() {
      const video = videoRef.current;

      if (!video) return;

      console.log("🚀 INIT MEDIAPIPE");

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

        const count = countFingers(landmarks);
        setFingerCount(count);
      });

      camera = new Camera(video, {
        onFrame: async () => {
          if (video.readyState >= 2) {
            await hands.send({ image: video });
          }
        },
        width: 640,
        height: 480,
      });

      camera.start();
    }

    init();

    return () => {
      camera?.stop?.();
    };
  }, [videoReady]);

  if (!huruf) return <div>Loading...</div>;

  return (
    <section className="pt-24 md:pt-16 pb-18">
      <Container>
        <div className="mb-10">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-base font-medium text-text-secondary uppercase hover:text-primary transition"
          >
            <ArrowLeft className="w-6 h-6" />
            Kembali
          </button>
        </div>

        <h1 className="text-2xl text-center mb-8 md:mb-16 font-bold">
          Tebak Huruf {type === "hiragana" ? "Hiragana" : "Katakana"}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* CAMERA */}
          <div className="relative w-full aspect-video overflow-hidden rounded-xl shadow-md">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              onLoadedMetadata={() => {
                console.log("🎥 VIDEO READY");
                setVideoReady(true);
              }}
              className="w-full h-full object-cover scale-x-[-1]"
            />

            <div className="absolute top-4 right-4 bg-black/50 text-white px-4 py-2 rounded-lg">
              {fingerCount}
            </div>
          </div>

          {/* QUESTION */}
          <div className="py-4 rounded-xl bg-gray-100 flex flex-col items-center justify-center">
            <p className="text-3xl font-bold">{huruf.char}</p>
            <p className="text-lg text-text-primary">{huruf.romaji}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
