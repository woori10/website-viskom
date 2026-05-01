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
          <div className="flex-1 text-center md:text-left space-y-6">
            <h1 className="text-3xl md:text-5xl leading-tight font-black uppercase">
              Tebak Hiragana Katakana
            </h1>
            <p className="mt-4 text-base text-text-secondary max-w-3xl w-full">
              Rasakan pengalaman belajar yang lebih interaktif! Tebak huruf
              Hiragana dan Katakana dengan cara yang seru dan berbeda, sambil
              melatih daya ingatmu secara menyenangkan.
            </p>
            <div className="h-50 my-20 md:my-16 w-full rounded-xl bg-gray-100 flex items-center justify-center">
              Gambar Ilustrasi Pengerjaan Quiz
            </div>
            {/* <p className="text-base text-center font-bold text-text-primary w-full">
              Pilih Huruf
            </p> */}
            <div className="flex flex-col gap-4 justify-start">
              {["Hiragana", "Katakana"].map((item) => (
                <Button
                  key={item}
                  variant="primary"
                  //active={active === item}
                  onClick={() => {
                    console.log(item.toLowerCase());
                    router.push(`/quiz/${item.toLowerCase()}`);
                  }}
                  className="rounded-xl"
                >
                  {item}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
