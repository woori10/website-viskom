"use client";

import Button from "@/component/ui/Button";
import Container from "@/component/ui/Container";
import { useRouter } from "next/navigation";

export default function Quiz() {
  type Category = "Hiragana" | "Katakana";

  //const [active, setActive] = useState<Category>("Hiragana");
  //const filteredHuruf = hurufList.filter((item) => item.type === active);
  //const [selectedHuruf, setSelectedHuruf] = useState<Huruf | null>(null);
  const router = useRouter();

  return (
    <section className="pt-24 pb-10 md:py-14">
      <Container>
        <div className="space-y-10">
          <div className="flex-1 text-center md:text-left space-y-8">
            <h1 className="text-3xl md:text-5xl font-black uppercase">
              Tebak Hiragana Katakana
            </h1>
            <p className="mt-4 text-base text-text-secondary max-w-3xl w-full">
              Rasakan pengalaman belajar yang lebih interaktif! Tebak huruf
              Hiragana dan Katakana dengan cara yang seru dan berbeda, sambil
              melatih daya ingatmu secara menyenangkan.
            </p>
            {/* <div className="h-50 my-20 md:my-16 w-full rounded-xl bg-gray-100 flex items-center justify-center">
              Gambar Ilustrasi Pengerjaan Quiz
            </div> */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Card Belajar Menulis */}
              <div className="border border-gray-200 rounded-2xl p-6 space-y-8 bg-white shadow-sm hover:shadow-md transition-all duration-300">
                <div className="space-y-2 text-center">
                  <h2 className="text-2xl font-bold">Belajar Menulis</h2>
                  <p className="text-sm text-text-secondary">
                    Latih kemampuan menulis huruf Jepang secara interaktif dan
                    menyenangkan.
                  </p>
                </div>

                <div className="h-40 w-full rounded-xl bg-gray-100 flex items-center justify-center">
                  Gambar Ilustrasi
                </div>

                <div className="flex flex-col gap-3">
                  {["Hiragana", "Katakana"].map((item) => (
                    <Button
                      key={item}
                      variant="primary"
                      onClick={() => {
                        console.log(item.toLowerCase());
                        router.push(`/practice/writing/${item.toLowerCase()}`);
                      }}
                      className="rounded-xl w-full"
                    >
                      {item}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Card Tebak Huruf */}
              <div className="border border-gray-200 rounded-2xl p-6 space-y-8 bg-white shadow-sm hover:shadow-md transition-all duration-300">
                <div className="space-y-2 text-center">
                  <h2 className="text-2xl font-bold">Quiz Tebak Huruf</h2>
                  <p className="text-sm text-text-secondary">
                    Uji kemampuanmu mengenali Hiragana dan Katakana dengan quiz
                    interaktif.
                  </p>
                </div>

                <div className="h-40 w-full rounded-xl bg-gray-100 flex items-center justify-center">
                  Gambar Ilustrasi
                </div>

                <div className="flex flex-col gap-3">
                  {["Hiragana", "Katakana"].map((item) => (
                    <Button
                      key={item}
                      variant="primary"
                      onClick={() => {
                        console.log(item.toLowerCase());
                        router.push(`/practice/quiz/${item.toLowerCase()}`);
                      }}
                      className="rounded-xl w-full"
                    >
                      {item}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
