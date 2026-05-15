"use client";

import Container from "@/component/ui/Container";
import { useCamera } from "@/hooks/useCamera";
import { Huruf, hurufList } from "@/lib/data/huruf";
import { ArrowLeft, Camera, RotateCcw, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// Types for landmarks
type Point = { x: number; y: number };

export default function WritingPractice() {
  const params = useParams<{ type: string }>();
  const rawType = params.type;
  const type = Array.isArray(rawType) ? rawType[0] : rawType;

  const router = useRouter();

  const [huruf, setHuruf] = useState<Huruf | null>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isWriting, setIsWriting] = useState(false);

  const videoRef = useCamera();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
  const [strokes, setStrokes] = useState<Point[][]>([]);

  // RANDOM HURUF
  useEffect(() => {
    const filtered = hurufList.filter(
      (h) => h.type.toLowerCase() === type?.toLowerCase(),
    );

    if (filtered.length > 0) {
      const random = filtered[Math.floor(Math.random() * filtered.length)];
      setHuruf(random);
    }
  }, [type]);

  // HAND TRACKING AND DRAWING LOGIC
  const strokesRef = useRef<Point[][]>([]);
  const currentStrokeRef = useRef<Point[]>([]);
  const isShiftPressedRef = useRef(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Shift") isShiftPressedRef.current = true;
      if (e.code === "Space") handleReset();
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Shift") isShiftPressedRef.current = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const handleReset = () => {
    strokesRef.current = [];
    currentStrokeRef.current = [];
    setStrokes([]);
    // The canvas will be cleared in the onResults loop
  };

  const handleSave = () => {
    if (
      strokesRef.current.length === 0 &&
      currentStrokeRef.current.length === 0
    )
      return;

    const saveCanvas = document.createElement("canvas");
    saveCanvas.width = 1280;
    saveCanvas.height = 720;
    const sctx = saveCanvas.getContext("2d");
    if (!sctx) return;

    sctx.fillStyle = "#050301";
    sctx.fillRect(0, 0, saveCanvas.width, saveCanvas.height);

    sctx.shadowColor = "#F5D061";
    sctx.shadowBlur = 15;
    sctx.strokeStyle = "#F5D061";
    sctx.lineWidth = 6;
    sctx.lineCap = "round";
    sctx.lineJoin = "round";

    [...strokesRef.current, currentStrokeRef.current].forEach((stroke) => {
      if (stroke.length < 2) return;
      sctx.beginPath();
      sctx.moveTo(stroke[0].x, stroke[0].y);
      for (let i = 1; i < stroke.length; i++) {
        sctx.lineTo(stroke[i].x, stroke[i].y);
      }
      sctx.stroke();
    });

    setCapturedImage(saveCanvas.toDataURL("image/png"));
    handleReset();
  };

  useEffect(() => {
    if (!videoReady || !canvasRef.current || !drawingCanvasRef.current) return;

    let hands: any;
    let camera: any;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const drawingCanvas = drawingCanvasRef.current;
    const dctx = drawingCanvas.getContext("2d");

    if (!ctx || !dctx) return;

    canvas.width = 1280;
    canvas.height = 720;
    drawingCanvas.width = 1280;
    drawingCanvas.height = 720;

    let lastSaveTime = 0;
    let lastResetTime = 0;
    let sx: number | null = null;
    let sy: number | null = null;

    async function init() {
      const video = videoRef.current;
      if (!video) return;

      const { Hands } = await import("@mediapipe/hands");
      const cameraUtils = await import("@mediapipe/camera_utils");

      hands = new Hands({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      });

      hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      hands.onResults((results: any) => {
        if (!ctx || !dctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw Buttons
        const saveBox = { x1: 20, y1: 20, x2: 250, y2: 120 };
        const resetBox = {
          x1: canvas.width - 250,
          y1: 20,
          x2: canvas.width - 20,
          y2: 120,
        };

        ctx.strokeStyle = "#00ff00";
        ctx.lineWidth = 3;
        ctx.strokeRect(
          saveBox.x1,
          saveBox.y1,
          saveBox.x2 - saveBox.x1,
          saveBox.y2 - saveBox.y1,
        );
        ctx.fillStyle = "#00ff00";
        ctx.font = "bold 40px Arial";
        ctx.fillText("SAVE", 70, 85);

        ctx.strokeStyle = "#ffa500";
        ctx.lineWidth = 3;
        ctx.strokeRect(
          resetBox.x1,
          resetBox.y1,
          resetBox.x2 - resetBox.x1,
          resetBox.y2 - resetBox.y1,
        );
        ctx.fillStyle = "#ffa500";
        ctx.fillText("RESET", resetBox.x1 + 45, 85);

        // Dark Overlay Effect from index.html
        ctx.fillStyle = "rgba(10, 6, 2, 0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        let leftHand: any = null;
        let rightHand: any = null;

        if (results.multiHandLandmarks && results.multiHandedness) {
          for (let i = 0; i < results.multiHandLandmarks.length; i++) {
            const landmarks = results.multiHandLandmarks[i];
            const label = results.multiHandedness[i].label;
            console.log(label);
            // Anatomical Right = Drawing, Anatomical Left = Control
            if (label === "Left") rightHand = landmarks;
            else leftHand = landmarks;
          }
        }

        let writingActive = isShiftPressedRef.current;

        if (leftHand) {
          const isOpen = isHandOpen(leftHand);
          // If hand is NOT open (i.e. closed/fist), writing is active
          if (!isOpen) writingActive = true;

          ctx.fillStyle = !isOpen ? "#00ff00" : "#ff0000";
          ctx.font = "24px Arial";
          ctx.fillText(!isOpen ? "AKTIF MENULIS" : "TANGAN TERBUKA", 300, 50);

          checkButtons(
            leftHand,
            canvas.width,
            canvas.height,
            saveBox,
            resetBox,
          );
        }

        setIsWriting(writingActive);

        if (rightHand) {
          const rx = (1 - rightHand[8].x) * canvas.width;
          const ry = rightHand[8].y * canvas.height;

          if (sx === null || sy === null) {
            sx = rx;
            sy = ry;
          } else {
            sx += (rx - sx) * 0.45;
            sy += (ry - sy) * 0.45;
          }

          // Cursor
          ctx.beginPath();
          ctx.arc(sx, sy, 6, 0, Math.PI * 2);
          ctx.fillStyle = writingActive ? "#ffffff" : "rgba(245, 208, 97, 0.4)";
          ctx.fill();

          if (writingActive) {
            currentStrokeRef.current.push({ x: sx, y: sy });
          } else {
            if (currentStrokeRef.current.length > 0) {
              strokesRef.current.push([...currentStrokeRef.current]);
              currentStrokeRef.current = [];
              setStrokes([...strokesRef.current]);
            }
          }

          checkButtons(
            rightHand,
            canvas.width,
            canvas.height,
            saveBox,
            resetBox,
          );
        } else {
          sx = null;
          sy = null;
          if (currentStrokeRef.current.length > 0) {
            strokesRef.current.push([...currentStrokeRef.current]);
            currentStrokeRef.current = [];
            setStrokes([...strokesRef.current]);
          }
        }

        // Draw persistent strokes with index.html style
        dctx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
        dctx.shadowColor = "#F5D061";
        dctx.shadowBlur = 15;
        dctx.strokeStyle = "#F5D061";
        dctx.lineWidth = 6;
        dctx.lineCap = "round";
        dctx.lineJoin = "round";

        [...strokesRef.current, currentStrokeRef.current].forEach((stroke) => {
          if (stroke.length < 2) return;
          dctx.beginPath();
          dctx.moveTo(stroke[0].x, stroke[0].y);
          for (let i = 1; i < stroke.length; i++) {
            dctx.lineTo(stroke[i].x, stroke[i].y);
          }
          dctx.stroke();
        });
      });

      function isHandOpen(landmarks: any) {
        let openFingers = 0;
        const tips = [8, 12, 16, 20];
        const pips = [6, 10, 14, 18];
        const wrist = landmarks[0];
        for (let i = 0; i < tips.length; i++) {
          const tipDist = Math.hypot(
            landmarks[tips[i]].x - wrist.x,
            landmarks[tips[i]].y - wrist.y,
          );
          const pipDist = Math.hypot(
            landmarks[pips[i]].x - wrist.x,
            landmarks[pips[i]].y - wrist.y,
          );
          if (tipDist > pipDist) openFingers++;
        }
        return openFingers >= 3;
      }

      function checkButtons(
        landmarks: any,
        w: number,
        h: number,
        saveBox: any,
        resetBox: any,
      ) {
        const tips = [4, 8, 12, 16, 20];
        let fingersInSave = 0;
        let fingersInReset = 0;
        for (const id of tips) {
          const cx = (1 - landmarks[id].x) * w;
          const cy = landmarks[id].y * h;
          if (
            cx >= saveBox.x1 &&
            cx <= saveBox.x2 &&
            cy >= saveBox.y1 &&
            cy <= saveBox.y2
          )
            fingersInSave++;
          if (
            cx >= resetBox.x1 &&
            cx <= resetBox.x2 &&
            cy >= resetBox.y1 &&
            cy <= resetBox.y2
          )
            fingersInReset++;
        }
        const now = Date.now();
        if (fingersInSave >= 3 && now - lastSaveTime > 2000) {
          handleSave();
          lastSaveTime = now;
        }
        if (fingersInReset >= 3 && now - lastResetTime > 1000) {
          handleReset();
          lastResetTime = now;
        }
      }

      camera = new cameraUtils.Camera(video, {
        onFrame: async () => {
          if (video.readyState >= 2) {
            await hands.send({ image: video });
          }
        },
        width: 1280,
        height: 720,
      });

      camera.start();
    }

    init();

    return () => {
      camera?.stop?.();
      hands?.close?.();
    };
  }, [videoReady]);

  if (!huruf)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );

  return (
    <section className="pt-16 md:pt-14 pb-24 min-h-screen bg-gray-50">
      <Container>
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Latihan Menulis {type === "hiragana" ? "Hiragana" : "Katakana"}
          </h1>
          <div className="w-10"></div> {/* Spacer */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* CAMERA SECTION */}
          <div className="lg:col-span-8">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black aspect-video border-4 border-white">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                onLoadedMetadata={() => setVideoReady(true)}
                className="w-full h-full object-cover scale-x-[-1]"
              />

              {/* Overlay Canvas for UI (Buttons, Cursor, Status) */}
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
              />

              {/* Drawing Canvas for persistent strokes */}
              <canvas
                ref={drawingCanvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
              />

              {!videoReady && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white gap-4">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-lg font-medium">Memulai Kamera...</p>
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Tangan Kiri Terbuka: Berhenti</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Tangan Kiri Tertutup: Menulis</span>
              </div>
              <div className="flex items-center gap-2 font-medium text-blue-600">
                <span>Gunakan Jari Telunjuk Tangan Kanan untuk Menulis</span>
              </div>
            </div>
          </div>

          {/* QUESTION AND RESULT SECTION */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center justify-center border-t-4 border-primary">
              <span className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">
                Tulis Huruf Ini
              </span>
              {/* <p className="text-8xl font-bold text-gray-900 mb-2">
                {huruf.char}
              </p> */}
              <p className="text-2xl font-medium text-primary">
                {huruf.romaji}
              </p>
              <img
                src={huruf.strokeOrder}
                alt={`Stroke order ${huruf.char}`}
                className="w-22 h-22 object-contain"
              />
            </div>

            {/* Captured Image Display */}
            <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col gap-4 border border-gray-100 min-h-[200px]">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-primary" />
                  Hasil Tulisan
                </h3>
                {capturedImage && (
                  <button
                    onClick={() => setCapturedImage(null)}
                    className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                    title="Hapus hasil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {capturedImage ? (
                <div className="relative group">
                  <img
                    src={capturedImage}
                    alt="Hasil Tulisan"
                    className="w-full rounded-xl border-2 border-gray-200 shadow-inner bg-black"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                    <p className="text-white text-sm font-medium">
                      Terakhir Diambil
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
                  <div className="bg-gray-50 p-4 rounded-full mb-3">
                    <RotateCcw className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-sm">
                    Gunakan fitur SAVE pada kamera untuk menampilkan hasil di
                    sini
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
