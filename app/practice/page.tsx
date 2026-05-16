"use client";

import Button from "@/component/ui/Button";
import Container from "@/component/ui/Container";
import { useRouter } from "next/navigation";

export default function Quiz() {
  type Category = "Hiragana" | "Katakana";

  const router = useRouter();

  return (
    <section className="pt-24 pb-10 md:py-14">
      <Container>
        <div data-aos="fade-up" className="space-y-12">
          <div className="flex-1 text-center md:text-left space-y-8">
            <h1 className="text-3xl md:text-5xl font-black uppercase">
              Latihan Hiragana & Katakana
            </h1>
            <p className="mt-4 leading-relaxed text-base text-text-secondary max-w-3xl w-full">
              Rasakan pengalaman belajar yang lebih interaktif! Latih kemampuan
              menulis serta tebak huruf Hiragana dan Katakana dengan cara yang
              seru dan menyenangkan sambil memperkuat daya ingatmu.
            </p>
            {/* <div className="h-50 my-20 md:my-16 w-full rounded-xl bg-gray-100 flex items-center justify-center">
              Gambar Ilustrasi Pengerjaan Quiz
            </div> */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Card Belajar Menulis */}
              <div className="relative overflow-hidden border border-primary/10 rounded-3xl p-6 md:p-8 bg-linear-to-br from-white to-red-100 shadow-sm hover:shadow-xl transition-all duration-300">
                {/* Accent Blur */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />

                <div className="relative space-y-8">
                  <div className="space-y-6 text-center">
                    <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                      Interactive Writing
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold">
                      Belajar Menulis
                    </h2>

                    <p className="text-sm md:text-base text-text-secondary leading-relaxed">
                      Latih kemampuan menulis huruf Jepang secara interaktif
                      menggunakan latihan visual yang mudah dipahami.
                    </p>
                  </div>

                  {/* <div className="h-48 w-full rounded-2xl bg-white border border-primary/10 flex items-center justify-center shadow-inner">
                    Gambar Ilustrasi
                  </div> */}

                  <div className="flex flex-col gap-3">
                    {["Hiragana", "Katakana"].map((item) => (
                      <Button
                        key={item}
                        variant="primary"
                        onClick={() => {
                          router.push(
                            `/practice/writing/${item.toLowerCase()}`,
                          );
                        }}
                        className=" rounded-xl w-full bg-primary/85 hover:bg-primary text-white"
                      >
                        {item}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Tebak Huruf */}
              <div className="relative overflow-hidden border border-primary/10 rounded-3xl p-6 md:p-8 bg-linear-to-br from-white to-red-100 shadow-sm hover:shadow-xl transition-all duration-300">
                {/* Accent Blur */}
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-pink-200/30 rounded-full blur-3xl" />

                <div className="relative space-y-8">
                  <div className="space-y-6 text-center">
                    <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                      Interactive Quiz
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold">
                      Quiz Tebak Huruf
                    </h2>

                    <p className="text-sm md:text-base text-text-secondary leading-relaxed">
                      Uji kemampuanmu mengenali huruf Hiragana dan Katakana
                      dengan quiz interaktif berbasis gesture tangan.
                    </p>
                  </div>

                  {/* <div className="h-48 w-full rounded-2xl bg-white border border-primary/10 flex items-center justify-center shadow-inner">
                    Gambar Ilustrasi
                  </div> */}

                  <div className="flex flex-col gap-3">
                    {["Hiragana", "Katakana"].map((item) => (
                      <Button
                        key={item}
                        variant="primary"
                        onClick={() => {
                          router.push(`/practice/quiz/${item.toLowerCase()}`);
                        }}
                        className=" rounded-xl w-full bg-primary/85 hover:bg-primary text-white"
                      >
                        {item}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
