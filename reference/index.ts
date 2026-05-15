import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';

export default function KanaClassifier() {
  const videoRef = useRef(null);
  const drawingCanvasRef = useRef(null); // Canvas untuk menggambar coretan tangan
  
  const [tfModel, setTfModel] = useState(null);
  const [modelType, setModelType] = useState('hiragana'); // 'hiragana' atau 'katakana'
  const [prediction, setPrediction] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isWriting, setIsWriting] = useState(false);

  // Menyimpan data koordinat stroke tulisan
  const strokesRef = useRef([]);
  const currentStrokeRef = useRef([]);
  const lastCoordsRef = useRef({ x: null, y: null });

  // 1. Memuat Model TensorFlow.js berdasarkan pilihan (Hiragana/Katakana)
  useEffect(() => {
    async function loadModel() {
      setIsLoading(true);
      try {
        // Path mengarah ke folder public/models/...
        const modelUrl = `/models/${modelType}/model.json`;
        const loadedModel = await tf.loadLayersModel(modelUrl);
        setTfModel(loadedModel);
        console.log(`Model ${modelType} berhasil dimuat.`);
      } catch (error) {
        console.error("Gagal memuat model:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadModel();
  }, [modelType]);

  // 2. Inisialisasi Kamera dan MediaPipe Hands
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let startTime = Date.now();
    let localStream = null;
    let handsDetector = null;
    let animationFrameId = null;

    async function setupCameraAndTracking() {
      // Nyalakan Kamera
      try {
        localStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = localStream;
        }
      } catch (err) {
        console.error("Akses kamera ditolak atau tidak tersedia:", err);
        return;
      }

      // Load MediaPipe Hands dari CDN resmi
      // @ts-ignore
      const { Hands } = window; 
      if (!Hands) {
        // Jika skrip CDN belum siap, tunggu sebentar lalu coba lagi
        setTimeout(setupCameraAndTracking, 1000);
        return;
      }

      handsDetector = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      });

      handsDetector.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      handsDetector.onResults(handleHandResults);

      // Loop deteksi frame video secara terus-menerus
      const processVideo = async () => {
        if (videoRef.current && videoRef.current.readyState === 4) {
          await handsDetector.send({ image: videoRef.current });
        }
        animationFrameId = requestAnimationFrame(processVideo);
      };
      
      processVideo();
    }

    // Memuat script CDN MediaPipe secara dinamis jika belum ada
    if (!document.getElementById('mediapipe-hands-script')) {
      const script = document.createElement('script');
      script.id = 'mediapipe-hands-script';
      script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js';
      script.async = true;
      script.onload = () => setupCameraAndTracking();
      document.head.appendChild(script);
    } else {
      setupCameraAndTracking();
    }

    return () => {
      if (localStream) localStream.getTracks().forEach(track => track.stop());
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (handsDetector) handsDetector.close();
    };
  }, []);

  // 3. Memproses Hasil Tracking Tangan (Porting logika dari tracking.py)
  const handleHandResults = (results) => {
    const canvas = drawingCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Bersihkan canvas gambar setiap frame untuk merender ulang coretan yang tersimpan
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Gambar ulang semua garis yang sudah tersimpan sebelumnya
    ctx.strokeStyle = '#61d0f5'; // Warna coretan utama seperti di Python Anda
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    strokesRef.current.forEach(stroke => {
      if (stroke.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);
      for (let i = 1; i < stroke.length; i++) {
        ctx.lineTo(stroke[i].x, stroke[i].y);
      }
      ctx.stroke();
    });

    let leftHand = null;
    let rightHand = null;

    if (results.multiHandLandmarks && results.multiHandedness) {
      results.multiHandedness.forEach((handedness, index) => {
        const label = handedness.label;
        // Koreksi cermin browser: MediaPipe "Left" seringkali adalah tangan kanan di layar
        if (label === 'Left') {
          leftHand = results.multiHand 使用Landmarks[index];
        } else {
          rightHand = results.multiHandLandmarks[index];
        }
      });
    }

    // Logika Tangan Kiri (Kontrol Menulis: Terbuka / Tertutup)
    let writingActive = false;
    if (leftHand) {
      // Cek apakah tangan mengepal (Jari telunjuk, tengah, manis, kelingking tertekuk)
      // Menyederhanakan logika `is_hand_open` dari Python ke JS
      const wrist = leftHand[0];
      let openFingers = 0;
      const tips = [8, 12, 16, 20];
      const pips = [6, 10, 14, 18];

      tips.forEach((tip, idx) => {
        const pip = pips[idx];
        const tipDist = Math.hypot(leftHand[tip].x - wrist.x, leftHand[tip].y - wrist.y);
        const pipDist = Math.hypot(leftHand[pip].x - wrist.x, leftHand[pip].y - wrist.y);
        if (tipDist > pipDist) openFingers++;
      });

      // Tangan tertutup/mengepal jika jari terbuka < 2
      writingActive = openFingers < 2;
      setIsWriting(writingActive);
    }

    // Logika Tangan Kanan (Menggambar menggunakan ujung jari telunjuk - Landmark 8)
    if (rightHand) {
      const indexFingerTip = rightHand[8];
      // Balik koordinat X secara horizontal karena video bersifat mirror
      const rx = (1 - indexFingerTip.x) * canvas.width;
      const ry = indexFingerTip.y * canvas.height;

      // Efek perataan (Smoothing) gerakan kursor seperti kode Python Anda (Linear Interpolation)
      let sx = lastCoordsRef.current.x === null ? rx : lastCoordsRef.current.x + (rx - lastCoordsRef.current.x) * 0.45;
      let sy = lastCoordsRef.current.y === null ? ry : lastCoordsRef.current.y + (ry - lastCoordsRef.current.y) * 0.45;
      
      lastCoordsRef.current = { x: sx, y: sy };

      // Gambar kursor penunjuk di layar
      ctx.fillStyle = writingActive ? '#ffffff' : '#61d0f5';
      ctx.beginPath();
      ctx.arc(sx, sy, 8, 0, 2 * Math.PI);
      ctx.fill();

      if (writingActive) {
        currentStrokeRef.current.push({ x: sx, y: sy });
        // Masukkan current stroke ke array utama jika belum ada
        if (!strokesRef.current.includes(currentStrokeRef.current)) {
          strokesRef.current.push(currentStrokeRef.current);
        }
      } else {
        // Jika tangan dibuka, selesaikan stroke saat ini
        if (currentStrokeRef.current.length > 0) {
          currentStrokeRef.current = [];
        }
      }
    } else {
      lastCoordsRef.current = { x: null, y: null };
    }
  };

  // 4. Logika Tombol RESET
  const handleReset = () => {
    strokesRef.current = [];
    currentStrokeRef.current = [];
    setPrediction('');
    const canvas = drawingCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  // 5. Logika Tombol PREDIKSI (Memasukkan gambar Canvas ke model .json)
  const handlePredict = async () => {
    if (!tfModel || strokesRef.current.length === 0) return;

    const canvas = drawingCanvasRef.current;
    
    // Membuat canvas sementara berlatar belakang hitam untuk input model (seperti black_bg di Python)
    const inputCanvas = document.createElement('canvas');
    inputCanvas.width = canvas.width;
    inputCanvas.height = canvas.height;
    const inputCtx = inputCanvas.getContext('2d');
    
    inputCtx.fillStyle = '#000000';
    inputCtx.fillRect(0, 0, inputCanvas.width, inputCanvas.height);

    // Gambar ulang goresan dengan warna putih (atau warna sesuai dataset training Anda)
    inputCtx.strokeStyle = '#ffffff'; 
    inputCtx.lineWidth = 12;
    inputCtx.lineCap = 'round';
    inputCtx.lineJoin = 'round';

    strokesRef.current.forEach(stroke => {
      if (stroke.length < 2) return;
      inputCtx.beginPath();
      inputCtx.moveTo(stroke[0].x, stroke[0].y);
      for (let i = 1; i < stroke.length; i++) {
        inputCtx.lineTo(stroke[i].x, stroke[i].y);
      }
      inputCtx.stroke();
    });

    // Jalankan Preprocessing menggunakan TensorFlow.js Tensor
    tf.tidy(() => {
      // 1. Ambil pixel dari canvas hitam
      let tensor = tf.browser.fromPixels(inputCanvas);
      
      // 2. Ubah ke Grayscale jika model Anda dilatih dengan gambar 1-channel (Hitam Putih)
      // Jika model Anda menerima RGB (3 channel), lewati baris `.mean(2).expandDims(-1)` ini.
      tensor = tensor.mean(2).expandDims(-1); 

      // 3. Resize gambar sesuai target input resolusi training model Anda (Contoh: 64x64 atau 28x28)
      // Ganti [64, 64] sesuai dengan konfigurasi arsitektur input model Anda!
      tensor = tf.image.resizeBilinear(tensor, [64, 64]);

      // 4. Normalisasi nilai pixel ke skala 0.0 - 1.0 (jika saat training Anda membagi dengan 255.0)
      tensor = tensor.div(255.0);

      // 5. Tambahkan dimensi batch (Shape menjadi [1, 64, 64, 1])
      tensor = tensor.expandDims(0);

      // 6. Eksekusi Prediksi
      const output = tfModel.predict(tensor);
      const probabilities = output.dataSync();
      const highestIndex = output.argMax(1).dataSync()[0];

      // Daftar Label/Output Kelas Huruf Anda (Urutkan sesuai indeks class hasil training Anda!)
      const hiraganaLabels = ["あ", "い", "う", "え", "お"]; // Lengkapi dengan label Anda sendiri
      const katakanaLabels = ["ア", "イ", "ウ", "エ", "オ"]; // Lengkapi dengan label Anda sendiri
      const currentLabels = modelType === 'hiragana' ? hiraganaLabels : katakanaLabels;

      setPrediction(currentLabels[highestIndex] || `Indeks Kelas: ${highestIndex}`);
    });
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Japanese Kana Air-Writing AI</h1>

      {/* Kontrol Pemilihan Model */}
      <div className="flex gap-4 mb-4">
        <button 
          onClick={() => setModelType('hiragana')}
          className={`px-4 py-2 rounded font-semibold ${modelType === 'hiragana' ? 'bg-blue-600 text-white' : 'bg-gray-700'}`}
        >
          Model Hiragana
        </button>
        <button 
          onClick={() => setModelType('katakana')}
          className={`px-4 py-2 rounded font-semibold ${modelType === 'katakana' ? 'bg-blue-600 text-white' : 'bg-gray-700'}`}
        >
          Model Katakana
        </button>
      </div>

      {isLoading && <p className="text-yellow-400 mb-2">Mengunduh Model ke Browser...</p>}

      {/* Kontainer Kamera dan Canvas Canvas */}
      <div className="relative border-4 border-gray-700 rounded-lg overflow-hidden" style={{ width: 640, height: 480 }}>
        {/* Video Webcam (Disembunyikan atau diletakkan di latar belakang secara cermin) */}
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline
          muted
          className="absolute top-0 left-0 w-full h-full object-cover transform scale-x-[-1]"
        />

        {/* Canvas Transparan untuk Tempat Menggambar / Overlay */}
        <canvas 
          ref={drawingCanvasRef}
          width={640}
          height={480}
          className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
        />
        
        {/* Indikator Status Menulis */}
        <div className="absolute bottom-4 left-4 z-20 bg-black bg-opacity-70 px-3 py-1 rounded">
          Status: <span className={isWriting ? "text-green-400 font-bold" : "text-red-400"}>
            {isWriting ? "Aktif Menulis (Tangan Kiri Kepal)" : "Diam (Buka Tangan Kiri)"}
          </span>
        </div>
      </div>

      {/* Tombol Aksi Kontrol */}
      <div className="flex gap-6 mt-6">
        <button 
          onClick={handleReset}
          className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg font-bold transition"
        >
          RESET CANVAS
        </button>
        <button 
          onClick={handlePredict}
          disabled={isLoading}
          className="bg-green-500 hover:bg-green-600 disabled:bg-gray-600 px-8 py-2 rounded-lg font-bold text-lg transition"
        >
          PREDIKSI HURUF
        </button>
      </div>

      {/* Tampilan Hasil Klasifikasi Model */}
      {prediction && (
        <div className="mt-8 p-4 bg-gray-800 border border-green-500 rounded-lg text-center min-w-[200px]">
          <p className="text-gray-400 text-sm">Hasil Analisis AI:</p>
          <p className="text-6xl font-extrabold text-green-400 mt-2">{prediction}</p>
        </div>
      )}
    </div>
  );
}