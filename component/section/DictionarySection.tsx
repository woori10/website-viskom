import { BookOpenText, Pencil } from "lucide-react";
import Container from "../ui/Container";

export default function DictionarySection() {
  return (
    <section className="py-16">
      <Container>
        <div className="space-y-8">
          {/* Atas */}
          <div data-aos="fade-up" className="flex justify-center items-center">
            <div className="max-w-2xl w-full space-y-4">
              <h2 className="uppercase text-center text-text-primary text-2xl md:text-3xl font-bold">
                Mengenal Hiragana dan Katakana
              </h2>
              <p className="text-text-secondary text-center text-sm md:text-base font-medium">
                Kami mengombinasikan seni visual tradisional dengan teknologi
                modern untuk memudahkan proses belajarmu.
              </p>
            </div>
          </div>

          <div
            data-aos="fade-right"
            data-aos-duration="2000"
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Kiri */}
            <div className="border border-(--color-ternary) w-full md:col-span-2 p-8">
              <div className="bg-primary text-white w-fit">
                <BookOpenText className="w-14 h-14 p-4" />
              </div>
              <div className="mt-4">
                <p className="text-text-primary text-3xl font-semibold uppercase">
                  Hiragana
                </p>
              </div>
              <div className="mt-4">
                <p className="text-text-secondary text-sm font-normal">
                  Mulailah perjalanan belajar bahasa Jepang dengan mengenal
                  huruf dasar Hiragana.
                </p>
              </div>
            </div>

            {/* Kanan */}
            <div className="bg-(--color-ternary) w-full md:col-span-1 p-6">
              <div className="bg-primary text-white w-fit">
                <Pencil className="w-14 h-14 p-4" />
              </div>
              <div className="mt-4">
                <p className="text-secondary text-3xl font-semibold uppercase">
                  practice writing
                </p>
              </div>
              <div className="mt-4">
                <p className="text-text-ternary text-sm font-normal">
                  Latih cara menulis huruf Jepang dengan mengikuti urutan
                  goresan yang benar.
                </p>
              </div>
            </div>
          </div>

          {/* Bawah */}
          <div
            data-aos="fade-left"
            data-aos-duration="2000"
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Kiri */}
            <div className="bg-(--color-ternary) w-full md:col-span-1 p-6">
              <div className="bg-primary text-white w-fit">
                <Pencil className="w-14 h-14 p-4" />
              </div>
              <div className="mt-4">
                <p className="text-secondary text-3xl font-semibold uppercase">
                  quiz
                </p>
              </div>
              <div className="mt-4">
                <p className="text-text-ternary text-sm font-normal">
                  Uji kemampuanmu mengenali Hiragana dan Katakana lewat quiz
                  yang seru dan interaktif.
                </p>
              </div>
            </div>

            {/* Kanan */}
            <div className="border border-(--color-ternary) w-full md:col-span-2 p-8">
              <div className="bg-primary text-white w-fit">
                <BookOpenText className="w-14 h-14 p-4" />
              </div>
              <div className="mt-4">
                <p className="text-(--color-text-primary) text-3xl font-semibold uppercase">
                  Katakana
                </p>
              </div>
              <div className="mt-4">
                <p className="text-text-secondary text-sm font-normal">
                  Pelajari karakter Katakana yang digunakan untuk kata asing dan
                  istilah modern.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
