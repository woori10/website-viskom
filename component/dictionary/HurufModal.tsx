"use client";

import Button from "@/component/ui/Button";
import { Huruf } from "@/lib/data/huruf";
import { Volume2, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function HurufModal({
  data,
  onClose,
}: {
  data: Huruf;
  onClose: () => void;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200); // samain sama duration
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* BACKDROP */}
      <div
        className={`
          absolute inset-0 transition-all duration-200
          ${isVisible ? "bg-black/40 opacity-100" : "bg-black/0 opacity-0"}
        `}
        onClick={handleClose}
      />

      {/* WRAPPER */}
      <div
        className={`
          flex items-end md:items-center justify-center
          w-full h-full transition-all duration-200
          ${isVisible ? "opacity-100" : "opacity-0"}
        `}
      >
        {/* MODAL CONTENT */}
        <div
          onClick={(e) => e.stopPropagation()}
          className={`
            w-full bg-white p-8 rounded-t-2xl h-fit md:h-auto

            transform transition-all duration-300

            ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-full opacity-0"
            }

            md:relative md:max-w-md md:rounded-2xl
            md:translate-y-0 md:opacity-100
            md:${isVisible ? "scale-100" : "scale-95"}
          `}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Detail Huruf</h2>
            <button className="hover:cursor-pointer" onClick={handleClose}>
              <X />
            </button>
          </div>

          {/* Content */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="border border-neutral shadow-sm rounded-md p-8 h-full">
              <div className="mx-auto space-y-4">
                <p className="text-6xl text-center font-bold text-primary">
                  {data.char}
                </p>
                <p className="text-lg text-center text-text-primary">
                  {data.romaji}
                </p>
              </div>
            </div>
            <div className="w-full space-y-8 md:space-y-4">
              <p className="text-md text-center md:text-left text-text-primary">
                Stroke Order
              </p>
              <div className="h-50 md:h-20 w-full rounded-xl bg-gray-100 flex items-center justify-center">
                Gambar Cara Menulis
              </div>
              <div className="flex flex-col w-full gap-4">
                <Button
                  variant="primary"
                  className="flex flex-row justify-center items-center gap-2"
                >
                  <Volume2 />
                  Pronountation
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
