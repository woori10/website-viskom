"use client";

import Container from "@/component/ui/Container";
import { useCamera } from "@/hooks/useCamera";
import { Huruf, hurufList } from "@/lib/data/huruf";
import {
  ArrowLeft,
  Award,
  Check,
  ChevronRight,
  HelpCircle,
  Sparkles,
  X,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// Types
interface Point {
  x: number;
  y: number;
}

interface QuizQuestion {
  correctHuruf: Huruf;
  options: Huruf[];
  correctIndex: number;
}

// Hand Gesture Option Configuration
const OPTION_DETAILS = [
  { id: 1, label: "☝️ Jari 1", color: "from-blue-500/10 to-indigo-500/10" },
  { id: 2, label: "✌️ Jari 2", color: "from-emerald-500/10 to-teal-500/10" },
  { id: 3, label: "🤟 Jari 3", color: "from-amber-500/10 to-orange-500/10" },
  { id: 4, label: "✋ Jari 4", color: "from-rose-500/10 to-red-500/10" },
];

export default function QuizDetail() {
  const params = useParams<{ type: string }>();
  const rawType = params.type;
  const type = Array.isArray(rawType) ? rawType[0] : rawType;

  const router = useRouter();

  // Core Game State
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [userAnswerIndex, setUserAnswerIndex] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [autoNextCountdown, setAutoNextCountdown] = useState<number | null>(
    null,
  );

  // Hand / Camera States
  const [fingerCount, setFingerCount] = useState(0);
  const [videoReady, setVideoReady] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoverProgress, setHoverProgress] = useState<number>(0);

  // References for React states inside MediaPipe closure
  const questionRef = useRef<QuizQuestion | null>(null);
  const isAnsweredRef = useRef(false);
  const userAnswerIndexRef = useRef<number | null>(null);

  // Auto-next timers refs
  const autoNextTimeoutRef = useRef<any>(null);
  const autoNextIntervalRef = useRef<any>(null);

  useEffect(() => {
    questionRef.current = question;
  }, [question]);

  useEffect(() => {
    isAnsweredRef.current = isAnswered;
  }, [isAnswered]);

  useEffect(() => {
    userAnswerIndexRef.current = userAnswerIndex;
  }, [userAnswerIndex]);

  // Hover refs to track duration
  const hoveredIndexRef = useRef<number | null>(null);
  const hoverStartTimeRef = useRef<number | null>(null);
  const hoverProgressRef = useRef<number>(0);

  // Camera & Canvas Refs
  const videoRef = useCamera();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate dynamic MCQ question
  const generateQuestion = (currentType: string): QuizQuestion | null => {
    const filtered = hurufList.filter(
      (h) => h.type.toLowerCase() === currentType?.toLowerCase(),
    );
    if (filtered.length === 0) return null;

    // Pick random target
    const correctHuruf = filtered[Math.floor(Math.random() * filtered.length)];

    // Get 3 distractors
    const distractors = filtered.filter(
      (h) => h.romaji !== correctHuruf.romaji,
    );
    const shuffledDistractors = [...distractors].sort(
      () => 0.5 - Math.random(),
    );
    const selectedDistractors = shuffledDistractors.slice(0, 3);

    // Combine and shuffle options
    const options = [correctHuruf, ...selectedDistractors].sort(
      () => 0.5 - Math.random(),
    );

    // Find correct index
    const correctIndex = options.findIndex(
      (o) => o.romaji === correctHuruf.romaji,
    );

    return {
      correctHuruf,
      options,
      correctIndex,
    };
  };

  // Set initial question
  useEffect(() => {
    if (type) {
      const q = generateQuestion(type);
      setQuestion(q);
    }
  }, [type]);

  // Submit Answer
  const triggerAnswer = (index: number) => {
    if (isAnsweredRef.current) return;

    const currentQ = questionRef.current;
    if (!currentQ) return;

    setUserAnswerIndex(index);
    userAnswerIndexRef.current = index;

    const correct = index === currentQ.correctIndex;
    setIsCorrect(correct);
    setIsAnswered(true);
    isAnsweredRef.current = true;

    const nextTotalAnswered = totalAnswered + 1;
    setTotalAnswered(nextTotalAnswered);
    if (correct) {
      setScore((prev) => prev + 1);
    }

    // Auto-next logic: wait 5 seconds then proceed
    if (autoNextTimeoutRef.current) clearTimeout(autoNextTimeoutRef.current);
    if (autoNextIntervalRef.current) clearInterval(autoNextIntervalRef.current);

    const isLastQuestion = nextTotalAnswered >= 10;
    setAutoNextCountdown(5);

    autoNextIntervalRef.current = setInterval(() => {
      setAutoNextCountdown((prev) => {
        if (prev === null || prev <= 1) {
          if (autoNextIntervalRef.current)
            clearInterval(autoNextIntervalRef.current);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    autoNextTimeoutRef.current = setTimeout(() => {
      if (isLastQuestion) {
        setIsQuizFinished(true);
      } else {
        handleNextQuestion();
      }
      setAutoNextCountdown(null);
    }, 5000);
  };

  // Next Question
  const handleNextQuestion = () => {
    if (autoNextTimeoutRef.current) {
      clearTimeout(autoNextTimeoutRef.current);
      autoNextTimeoutRef.current = null;
    }
    if (autoNextIntervalRef.current) {
      clearInterval(autoNextIntervalRef.current);
      autoNextIntervalRef.current = null;
    }
    setAutoNextCountdown(null);

    if (!type) return;
    const nextQ = generateQuestion(type);
    setQuestion(nextQ);
    setIsAnswered(false);
    isAnsweredRef.current = false;
    setUserAnswerIndex(null);
    userAnswerIndexRef.current = null;
    setIsCorrect(null);
  };

  // Restart Quiz
  const handleRestartQuiz = () => {
    if (autoNextTimeoutRef.current) {
      clearTimeout(autoNextTimeoutRef.current);
      autoNextTimeoutRef.current = null;
    }
    if (autoNextIntervalRef.current) {
      clearInterval(autoNextIntervalRef.current);
      autoNextIntervalRef.current = null;
    }
    setAutoNextCountdown(null);

    setScore(0);
    setTotalAnswered(0);
    setIsQuizFinished(false);
    setIsAnswered(false);
    isAnsweredRef.current = false;
    setUserAnswerIndex(null);
    userAnswerIndexRef.current = null;
    setIsCorrect(null);

    if (type) {
      const q = generateQuestion(type);
      setQuestion(q);
    }
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (autoNextTimeoutRef.current) clearTimeout(autoNextTimeoutRef.current);
      if (autoNextIntervalRef.current)
        clearInterval(autoNextIntervalRef.current);
    };
  }, []);

  // Setup Hand Tracking & Canvas Overlay Drawing
  useEffect(() => {
    let isMounted = true;
    let hands: any;
    let camera: any;

    async function init() {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;

      // Match 16:9 HD coordinates
      canvas.width = 1280;
      canvas.height = 720;

      const { Hands } = await import("@mediapipe/hands");
      const cameraUtils = await import("@mediapipe/camera_utils");

      if (!isMounted) return;

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
        if (!isMounted) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Clear previous frames
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const currentQ = questionRef.current;
        const answered = isAnsweredRef.current;

        // Track and render Hand Skeleton
        const landmarks = results.multiHandLandmarks?.[0];
        if (landmarks && !answered) {
          // Connections lines
          const connections = [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 4],
            [0, 5],
            [5, 6],
            [6, 7],
            [7, 8],
            [5, 9],
            [9, 10],
            [10, 11],
            [11, 12],
            [9, 13],
            [13, 14],
            [14, 15],
            [15, 16],
            [13, 17],
            [0, 17],
            [17, 18],
            [18, 19],
            [19, 20],
          ];

          ctx.strokeStyle = "rgba(188, 0, 45, 0.4)";
          ctx.lineWidth = 3;
          connections.forEach(([i, j]) => {
            const x1 = (1 - landmarks[i].x) * canvas.width;
            const y1 = landmarks[i].y * canvas.height;
            const x2 = (1 - landmarks[j].x) * canvas.width;
            const y2 = landmarks[j].y * canvas.height;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          });

          // Joint dots
          landmarks.forEach((lm: any, idx: number) => {
            const cx = (1 - lm.x) * canvas.width;
            const cy = lm.y * canvas.height;
            ctx.beginPath();
            ctx.arc(cx, cy, 6, 0, 2 * Math.PI);
            ctx.fillStyle = idx % 4 === 0 ? "#bc002d" : "#ffffff";
            ctx.shadowColor = "#bc002d";
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0;
          });

          // Finger count representation
          let activeFingers = 0;
          if (landmarks[8].y < landmarks[6].y) activeFingers++;
          if (landmarks[12].y < landmarks[10].y) activeFingers++;
          if (landmarks[16].y < landmarks[14].y) activeFingers++;
          if (landmarks[20].y < landmarks[18].y) activeFingers++;
          setFingerCount(activeFingers);

          let hoveredBoxIdx: number | null = null;
          if (activeFingers >= 1 && activeFingers <= 4) {
            hoveredBoxIdx = activeFingers - 1;
          }

          const now = Date.now();
          if (hoveredBoxIdx !== null) {
            if (hoveredIndexRef.current === hoveredBoxIdx) {
              const duration = now - (hoverStartTimeRef.current || now);
              const progress = Math.min(duration / 1000, 1.0); // 1.0s holding duration
              hoverProgressRef.current = progress;

              setHoveredIndex(hoveredBoxIdx);
              setHoverProgress(progress);

              if (progress >= 1.0) {
                triggerAnswer(hoveredBoxIdx);
                hoveredIndexRef.current = null;
                hoverStartTimeRef.current = null;
                hoverProgressRef.current = 0;
                setHoveredIndex(null);
                setHoverProgress(0);
              }
            } else {
              hoveredIndexRef.current = hoveredBoxIdx;
              hoverStartTimeRef.current = now;
              hoverProgressRef.current = 0;
              setHoveredIndex(hoveredBoxIdx);
              setHoverProgress(0);
            }

            // Draw futuristic progress ring around palm center
            const palmCenterLm = landmarks[9]; // Middle finger MCP
            const cx = (1 - palmCenterLm.x) * canvas.width;
            const cy = palmCenterLm.y * canvas.height;
            const progress = hoverProgressRef.current;
            const radius = 60;

            // Outer glow / shadow
            ctx.save();
            ctx.shadowColor = "#bc002d";
            ctx.shadowBlur = 15;

            // Draw background circle
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
            ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
            ctx.lineWidth = 6;
            ctx.stroke();

            // Draw progress arc
            ctx.beginPath();
            ctx.arc(
              cx,
              cy,
              radius,
              -Math.PI / 2,
              -Math.PI / 2 + progress * 2 * Math.PI,
            );
            ctx.strokeStyle = "#bc002d"; // Sakura/Japan Red
            ctx.lineWidth = 8;
            ctx.lineCap = "round";
            ctx.stroke();

            ctx.restore();

            // Draw selection text badge above palm center
            ctx.fillStyle = "rgba(26, 28, 28, 0.9)";
            ctx.beginPath();
            ctx.roundRect(cx - 95, cy - radius - 45, 190, 32, 8);
            ctx.fill();
            ctx.strokeStyle = "#bc002d";
            ctx.lineWidth = 1.5;
            ctx.stroke();

            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 13px var(--font-sans), Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            if (currentQ && currentQ.options[hoveredBoxIdx]) {
              const opt = currentQ.options[hoveredBoxIdx];
              ctx.fillText(
                `Pilihan ${hoveredBoxIdx + 1}: ${opt.romaji.toUpperCase()} (${opt.char})`,
                cx,
                cy - radius - 29,
              );
            } else {
              ctx.fillText(
                `Memilih Pilihan ${hoveredBoxIdx + 1}`,
                cx,
                cy - radius - 29,
              );
            }

            // Draw recognized emoji inside palm ring
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 20px var(--font-sans), Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            const emojiMap = ["☝️", "✌️", "🤟", "✋"];
            const emoji = emojiMap[hoveredBoxIdx] || "👋";
            ctx.fillText(emoji, cx, cy);
          } else {
            hoveredIndexRef.current = null;
            hoverStartTimeRef.current = null;
            hoverProgressRef.current = 0;
            setHoveredIndex(null);
            setHoverProgress(0);
          }
        } else {
          hoveredIndexRef.current = null;
          hoverStartTimeRef.current = null;
          hoverProgressRef.current = 0;
          setFingerCount(0);
          setHoveredIndex(null);
          setHoverProgress(0);
        }
      });

      camera = new cameraUtils.Camera(video, {
        onFrame: async () => {
          if (video.readyState >= 2 && isMounted && hands) {
            try {
              await hands.send({ image: video });
            } catch (err) {
              console.error("MediaPipe send error:", err);
            }
          }
        },
        width: 1280,
        height: 720,
      });

      camera.start();
    }

    if (videoReady) {
      init();
    }

    return () => {
      isMounted = false;
      camera?.stop?.();
      hands?.close?.();
    };
  }, [videoReady]);

  if (!question) {
    return (
      <div className="flex h-screen items-center justify-center bg-secondary">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Calculate stats
  const accuracy =
    totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0;

  return (
    <section className="pt-16 md:pt-14 pb-24 min-h-screen bg-secondary">
      <Container>
        {/* Back Button */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-white/80 hover:text-zinc-900 dark:hover:text-white transition-all px-4 py-2 rounded-xl cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Kembali ke Practice</span>
          </button>

          <div className="flex items-center gap-2 text-primary font-bold bg-primary/10 border border-primary/20 px-4 py-2 rounded-xl">
            <Sparkles className="w-5 h-5" />
            <span>Tebak Kana AI Hands-Free</span>
          </div>
        </div>

        {/* Dashboard Stat Tracker & Gameplay / Results */}
        {isQuizFinished ? (
          <div className="max-w-2xl mx-auto bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-3xl p-8 md:p-12 text-center shadow-2xl relative overflow-hidden animate-fade-in mt-4">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

            {/* Completion Icon */}
            <div className="w-24 h-24 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(188,0,45,0.15)] animate-bounce">
              <Award className="w-12 h-12 text-primary" />
            </div>

            <h2 className="text-zinc-800 dark:text-white text-3xl font-extrabold tracking-tight mb-2">
              Kuis Selesai! 🎉
            </h2>
            <p className="text-zinc-500 dark:text-white/60 text-sm md:text-base max-w-md mx-auto mb-8">
              Kamu telah menyelesaikan latihan tebak huruf kana sebanyak{" "}
              <strong>10 soal</strong>. Berikut adalah ringkasan hasil
              analisismu:
            </p>

            {/* Results Grid */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
              <div className="bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 p-5 rounded-2xl">
                <p className="text-zinc-500 dark:text-white/50 text-xs md:text-sm uppercase font-semibold tracking-wider">
                  Benar / Soal
                </p>
                <p className="text-2xl md:text-3xl font-black text-zinc-800 dark:text-white mt-1">
                  {score} / 10
                </p>
              </div>
              <div className="bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 p-5 rounded-2xl">
                <p className="text-zinc-500 dark:text-white/50 text-xs md:text-sm uppercase font-semibold tracking-wider">
                  Akurasi
                </p>
                <p className="text-2xl md:text-3xl font-black text-emerald-500 mt-1">
                  {accuracy}%
                </p>
              </div>
            </div>

            {/* Motivational message */}
            <div className="bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-100 dark:border-white/5 p-5 rounded-2xl max-w-md mx-auto mb-10 text-zinc-700 dark:text-white/90 text-sm md:text-base font-semibold shadow-inner">
              {accuracy === 100 &&
                "Sempurna! Kamu luar biasa, semua jawaban benar! 🏆"}
              {accuracy >= 80 &&
                accuracy < 100 &&
                "Sangat Hebat! Kamu menguasai huruf ini dengan luar biasa! ⭐"}
              {accuracy >= 50 &&
                accuracy < 80 &&
                "Kerja Bagus! Tingkatkan terus latihanmu! 📈"}
              {accuracy < 50 &&
                "Jangan menyerah! Terus berlatih untuk mengasah kemampuanmu! 💪"}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <button
                onClick={handleRestartQuiz}
                className="w-full sm:w-auto bg-primary hover:brightness-110 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg transition-all transform hover:scale-[1.03] cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                <span>Ulangi Latihan</span>
              </button>
              <button
                onClick={() => router.back()}
                className="w-full sm:w-auto bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-white font-bold px-8 py-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Kembali ke Menu</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Dashboard Stat Tracker */}
            <div className="grid grid-cols-2 gap-4 mb-8 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 p-5 rounded-2xl shadow-sm">
              <div className="text-center border-r border-zinc-200 dark:border-white/10">
                <p className="text-zinc-500 dark:text-white/60 text-xs md:text-sm uppercase tracking-wide font-medium">
                  Skor Benar
                </p>
                <p className="text-xl md:text-2xl font-bold text-zinc-800 dark:text-white mt-1">
                  {score}
                </p>
              </div>
              {/* <div className="text-center border-r border-zinc-200 dark:border-white/10">
                <p className="text-zinc-500 dark:text-white/60 text-xs md:text-sm uppercase tracking-wide font-medium">Kemajuan</p>
                <p className="text-xl md:text-2xl font-bold text-primary mt-1">Soal {Math.min(totalAnswered + (isAnswered ? 0 : 1), 10)} / 10</p>
              </div> */}
              <div className="text-center">
                <p className="text-zinc-500 dark:text-white/60 text-xs md:text-sm uppercase tracking-wide font-medium">
                  Tipe Kuis
                </p>
                <p className="text-xl md:text-2xl font-bold text-primary mt-1 uppercase">
                  {type}
                </p>
              </div>
            </div>

            {/* Main Gameplay Screen */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
              {/* CAMERA FEED & INTERACTIVE CANVAS OVERLAY (Left Col) */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black aspect-video border-4 border-zinc-200 dark:border-zinc-800 cursor-pointer select-none">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    onLoadedMetadata={() => setVideoReady(true)}
                    className="w-full h-full object-cover scale-x-[-1]"
                  />

                  {/* Interaction Canvas Overlay */}
                  <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full pointer-events-none"
                  />

                  {/* Startup Spinner */}
                  {!videoReady && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 text-white gap-4">
                      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-lg font-medium text-primary">
                        Memulai Kamera & AI...
                      </p>
                    </div>
                  )}

                  {/* Real-time tracking overlay hud */}
                  {videoReady && (
                    <div className="absolute top-4 left-4 bg-zinc-950/90 text-white px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-md flex items-center gap-2 text-xs">
                      <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
                      <span>
                        AI Tracking Aktif (Jari Terdeteksi: {fingerCount})
                      </span>
                    </div>
                  )}
                </div>

                {/* Instruction Help Bar */}
                <div className="bg-primary/5 border border-primary/10 p-4 rounded-xl flex gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                  <HelpCircle className="w-5 h-5 text-primary shrink-0" />
                  <p>
                    <strong>Cara Memilih Jawaban (AI Hand Gestures):</strong>{" "}
                    Tunjukkan jumlah jari di depan kamera untuk memilih pilihan.
                    Angkat <strong>1 jari</strong> untuk Pilihan 1,{" "}
                    <strong>2 jari</strong> untuk Pilihan 2,{" "}
                    <strong>3 jari</strong> untuk Pilihan 3, dan{" "}
                    <strong>4 jari (atau lebih)</strong> untuk Pilihan 4. Tahan
                    selama <strong>1 detik</strong> untuk mengonfirmasi! Anda
                    juga bisa mengklik langsung pilihan di kanan.
                  </p>
                </div>

                {/* Answer Feedback Alert Banner */}
                {isAnswered && (
                  <div
                    className={`p-6 rounded-2xl shadow-xl flex flex-col gap-4 border transition-all ${
                      isCorrect
                        ? "bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300"
                        : "bg-red-50 dark:bg-red-950/80 border-red-200 dark:border-red-500/30 text-red-800 dark:text-red-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isCorrect
                            ? "bg-emerald-500/20 text-emerald-500"
                            : "bg-red-500/20 text-red-500"
                        }`}
                      >
                        {isCorrect ? (
                          <Award className="w-6 h-6" />
                        ) : (
                          <X className="w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">
                          {isCorrect
                            ? "Jawaban Anda Benar!"
                            : "Jawaban Anda Kurang Tepat!"}
                        </h3>
                        <p className="text-sm opacity-80 mt-0.5">
                          Huruf{" "}
                          <strong className="text-zinc-800 dark:text-white">
                            {question.correctHuruf.char}
                          </strong>{" "}
                          dibaca{" "}
                          <strong className="text-zinc-800 dark:text-white">
                            {question.correctHuruf.romaji.toUpperCase()}
                          </strong>
                          .
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (totalAnswered >= 10) {
                          setIsQuizFinished(true);
                        } else {
                          handleNextQuestion();
                        }
                      }}
                      className="w-full bg-primary hover:brightness-110 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
                    >
                      <span>
                        {totalAnswered >= 10
                          ? `Lihat Hasil Kuis ${autoNextCountdown !== null ? `(${autoNextCountdown}s)` : ""}`
                          : `Pertanyaan Berikutnya ${autoNextCountdown !== null ? `(${autoNextCountdown}s)` : ""}`}
                      </span>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              {/* QUESTION PANEL & HTML CHOICES GRID (Right Col) */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                {/* Question Card */}
                <div className="bg-white dark:bg-zinc-950 border-t-4 border-primary dark:border-white/10 rounded-2xl p-8 text-center shadow-md relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>

                  <span className="bg-primary/10 text-primary text-xs px-3 py-1.5 rounded-full font-semibold border border-primary/20 uppercase tracking-wide">
                    Pertanyaan
                  </span>

                  <h2 className="text-zinc-500 dark:text-white/60 text-sm font-medium mt-4">
                    Bagaimana cara membaca huruf ini?
                  </h2>

                  <div className="text-8xl md:text-9xl font-bold text-zinc-800 dark:text-white my-6 select-none animate-pulse">
                    {question.correctHuruf.char}
                  </div>
                </div>

                {/* MCQ Choices List (Clickable Fallback) */}
                <div className="grid grid-cols-2 gap-4">
                  {question.options.map((opt, idx) => {
                    const isSelected = userAnswerIndex === idx;
                    const isCorrectAnswer = question.correctIndex === idx;

                    // Set initial card states
                    let btnStyle =
                      "bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 border-zinc-200 dark:border-white/10 text-zinc-800 dark:text-white shadow-sm";

                    if (hoveredIndex === idx && !isAnswered) {
                      btnStyle =
                        "bg-zinc-50 dark:bg-zinc-800 border-primary text-zinc-950 dark:text-white shadow-[0_0_15px_rgba(188,0,45,0.2)] scale-[1.02]";
                    }

                    if (isAnswered) {
                      if (isCorrectAnswer) {
                        btnStyle =
                          "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold shadow-[0_0_15px_rgba(16,185,129,0.1)]";
                      } else if (isSelected) {
                        btnStyle =
                          "bg-red-500/10 border-red-500 text-red-600 dark:text-red-400 font-bold shadow-[0_0_15px_rgba(239,68,68,0.1)]";
                      } else {
                        btnStyle =
                          "bg-zinc-100/50 dark:bg-zinc-900/20 border-zinc-100 dark:border-white/5 text-zinc-400 dark:text-zinc-600 cursor-not-allowed";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={isAnswered}
                        onClick={() => triggerAnswer(idx)}
                        className={`relative overflow-hidden flex flex-col items-center justify-center p-5 rounded-2xl border transition-all duration-300 text-center cursor-pointer min-h-[120px] ${btnStyle}`}
                      >
                        <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-white/40 mb-2">
                          <span>{OPTION_DETAILS[idx].label}</span>
                          <span>Pilihan {idx + 1}</span>
                        </div>

                        <div className="text-2xl font-bold tracking-wide text-zinc-800 dark:text-white">
                          {opt.romaji.toUpperCase()}
                        </div>

                        {/* <div className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                          Karakter: {opt.char}
                        </div> */}

                        {isAnswered && isCorrectAnswer && (
                          <Check className="w-5 h-5 text-emerald-500 mt-2" />
                        )}
                        {isAnswered && isSelected && !isCorrectAnswer && (
                          <X className="w-5 h-5 text-red-500 mt-2" />
                        )}

                        {/* Progress Bar overlay for gesture selection */}
                        {!isAnswered && hoveredIndex === idx && (
                          <div
                            className="absolute bottom-0 left-0 h-1.5 bg-gradient-to-r from-primary to-primary/80 transition-all duration-75"
                            style={{ width: `${hoverProgress * 100}%` }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}
      </Container>
    </section>
  );
}
