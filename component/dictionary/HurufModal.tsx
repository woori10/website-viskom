"use client";

import Button from "@/component/ui/Button";
import { Huruf } from "@/lib/data/huruf";
import { Volume2, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function HurufModal({
  data,
  onClose,
}: Readonly<{
  data: Huruf;
  onClose: () => void;
}>) {
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
    relative overflow-hidden
    w-full bg-linear-to-br from-white to-red-50

    p-5 md:p-8
    rounded-t-3xl h-fit

    transform transition-all duration-300

    ${isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}

    md:relative md:max-w-2xl md:rounded-3xl
    md:translate-y-0 md:opacity-100
    shadow-2xl border border-primary/10
    max-h-[90vh] overflow-y-auto
  `}
        >
          {/* Accent Blur */}
          <div className="absolute -top-16 -right-16 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />

          {/* Header */}
          <div className="relative flex justify-between items-center mb-5 md:mb-8">
            <div>
              <p className="text-sm text-primary font-medium">
                Japanese Character
              </p>
              <h2 className="text-2xl font-black">Detail Huruf</h2>
            </div>

            <button
              className="p-2 rounded-full hover:bg-black/5 transition-all cursor-pointer"
              onClick={handleClose}
            >
              <X />
            </button>
          </div>

          {/* Content */}
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 items-center">
            {/* Left */}
            <div className="bg-white border border-primary/10 shadow-sm rounded-3xl p-5 md:p-8">
              <div className="space-y-4 md:space-y-6 text-center">
                <div className="w-16 h-0.75 rounded-full bg-primary/30 mx-auto" />

                <p className="text-5xl md:text-7xl font-black text-primary">
                  {data.char}
                </p>

                <div className="space-y-2">
                  <p className="text-lg uppercase tracking-[0.2em] text-text-secondary">
                    {data.romaji}
                  </p>

                  <p className="text-sm text-text-secondary">{data.type}</p>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="space-y-4 md:space-y-6">
              <div>
                <p className="text-sm text-center font-medium text-primary mb-2">
                  Stroke Order
                </p>

                <div className="bg-white border border-primary/10 rounded-2xl p-4 flex items-center justify-center shadow-sm">
                  <img
                    src={data.strokeOrder}
                    alt={`Stroke order ${data.char}`}
                    className="w-full max-w-xs mx-auto object-contain"
                  />
                </div>
              </div>

              <Button
                variant="primary"
                className="w-full flex items-center justify-center gap-2 rounded-xl"
              >
                <Volume2 size={18} />
                Dengarkan Pengucapan
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
