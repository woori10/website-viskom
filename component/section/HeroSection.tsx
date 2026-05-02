import Button from "@/component/ui/Button";
import Container from "@/component/ui/Container";
import { Dot } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="py-24">
      <Container>
        <div
          data-aos="fade-up"
          className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16"
        >
          {/* KIRI */}
          <div className="flex-1 text-center md:text-left space-y-6">
            <div className="flex justify-center md:justify-start items-center gap-2 border border-primary text-primary w-fit p-2 mx-auto md:mx-0">
              <Dot />
              <p className="text-sm md:text-lg">Mulai Perjalananmu Sekarang</p>
            </div>
            <h1 className="text-3xl md:text-5xl leading-tight  font-black uppercase">
              Belajar Bahasa Jepang jadi{" "}
              <span className="text-primary">Lebih Seru!</span>
            </h1>
            <p className="mt-4 text-base text-text-secondary">
              Kuasai Hiragama dan Katakana melalui pendekatan visual yang
              menenagkan dan interaktif. Mulai dari dasar dengan Sakura Learn
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <Link href="/quiz" className="w-full">
                <Button variant="primary" className="w-full">
                  Mulai Belajar
                </Button>
              </Link>
              <Link href="/dictionary" className="w-full">
                <Button variant="secondary" className="w-full">
                  Lihat Dictionary
                </Button>
              </Link>
            </div>
          </div>

          {/* KANAN */}
          <div className="flex-1">
            <div className="h-64 w-full rounded-xl bg-neutral flex items-center justify-center">
              Image / Illustration
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
