import { Pencil } from "lucide-react";
import Container from "../ui/Container";

export default function QuizSection() {
  return (
    <section className="py-16">
      <div data-aos="fade-up" className="bg-primary">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 items-center py-16 gap-8 md:gap-16">
            {/* Kiri */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="border-ternary m-4">
                <img src="/quiz.jpg" alt="Quiz" className="object-cover" />
              </div>
            </div>
            {/* Kanan */}
            <div className="flex-1 text-center md:text-left space-y-6">
              <h2 className="uppercase text-secondary text-2xl font-black tracking-wider">
                Belajar menulis huruf jepang jadi lebih menyenangkan
              </h2>
              <p className="text-secondary text-md text-justify">
                Ikuti urutan goresan huruf Jepang dan latih kemampuan menulismu
                dengan cara yang lebih interaktif, praktis, dan menyenangkan
                langsung dari layar perangkatmu.
              </p>
              <div className="flex text-secondary gap-4">
                <div className="flex w-fit h-fit p-1 border border-secondary items-center justify-center">
                  <Pencil className="w-4 h-4" />
                </div>
                <div className="items-start">
                  <p className="text-md text-justify">
                    Pelajari urutan penulisan huruf Jepang langkah demi langkah
                    dengan visual yang mudah dipahami.
                  </p>
                </div>
              </div>
              <div className="flex text-secondary gap-4">
                <div className="flex w-fit h-fit p-1 border border-secondary items-center justify-center">
                  <Pencil className="w-4 h-4" />
                </div>
                <p className="text-md text-justify">
                  Latih kemampuanmu kapan saja melalui pengalaman belajar yang
                  interaktif dan tidak membosankan.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
