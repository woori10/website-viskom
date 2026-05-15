"use client";

import Container from "@/component/ui/Container";
import { useCamera } from "@/hooks/useCamera";
import { useHandTracking } from "@/hooks/useHandTracking";
import { Huruf, hurufList } from "@/lib/data/huruf";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

  const router = useRouter();

  // const filteredHuruf = hurufList.filter(
  //   (h) => h.type.toLowerCase() === type?.toLowerCase(),
  // );

  const [huruf, setHuruf] = useState<Huruf | null>(null);
  const [fingerCount, setFingerCount] = useState(0);
  const [videoReady, setVideoReady] = useState(false);

  // CAMERA HOOK
  const videoRef = useCamera();

  // HAND TRACKING HOOK
  useHandTracking(videoRef, videoReady, setFingerCount);

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

  if (!huruf) return <div>Loading...</div>;

  return (
    <section className="pt-16 md:pt-14 pb-24">
      <Container>
        <div className="mb-10 ">
          <button onClick={() => router.back()}>
            <ArrowLeft className="hover:cursor-pointer" />
          </button>
        </div>
        <div className="text-center mb-8 md:mb-10">
          <h1 className="text-2xl md:text-3xl font-bold">
            Latihan Menulis Huruf{" "}
            {type === "hiragana" ? "Hiragana" : "Katakana"}
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* CAMERA */}
          <div className="relative aspect-video">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              onLoadedMetadata={() => setVideoReady(true)}
              className="w-full h-full object-cover scale-x-[-1]"
            />

            <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded">
              {fingerCount}
            </div>
          </div>

          {/* QUESTION */}
          <div className="flex flex-col items-center justify-center bg-gray-100 rounded-xl">
            <p className="text-3xl font-bold">{huruf.char}</p>
            <p>{huruf.romaji}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
