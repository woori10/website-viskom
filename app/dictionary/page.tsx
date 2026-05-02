"use client";

import HurufCard from "@/component/dictionary/HurufCard";
import HurufModal from "@/component/dictionary/HurufModal";
import Button from "@/component/ui/Button";
import Container from "@/component/ui/Container";
import { Huruf, hurufList } from "@/lib/data/huruf";
import AOS from "aos";
import { useEffect, useState } from "react";

export default function Dictionary() {
  type Category = "Hiragana" | "Katakana";

  const [active, setActive] = useState<Category>("Hiragana");
  const filteredHuruf = hurufList.filter((item) => item.type === active);
  const [selectedHuruf, setSelectedHuruf] = useState<Huruf | null>(null);

  useEffect(() => {
    AOS.refresh(); // atau AOS.refreshHard()
  }, [active]);

  return (
    <section className="pt-24 pb-10 md:py-14">
      <Container>
        <div data-aos="fade-up" className="space-y-10">
          <div className="flex-1 text-center md:text-left space-y-6">
            <div>
              <h1 className="text-3xl md:text-5xl leading-tight  font-black uppercase">
                Mengenal Huruf
              </h1>
              <p className="mt-4 text-base text-text-secondary max-w-3xl w-full">
                Awali perjalanan bahasa Jepangmu dengan mempelajari dasar huruf
                Hiragana dan Katakana. Klik pada kartu untuk mendengarkan
                pengucapan.
              </p>
            </div>

            <div className="flex justify-center md:justify-start gap-4">
              {["Hiragana", "Katakana"].map((item) => (
                <Button
                  key={item}
                  variant="outline"
                  active={active === item}
                  onClick={() => setActive(item as Category)}
                  className="rounded-full px-6"
                >
                  {item}
                </Button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 items-center gap-6 ">
            {filteredHuruf.map((item, index) => (
              <div key={item.id} data-aos="fade-up" data-aos-duration="1000">
                <HurufCard data={item} onClick={() => setSelectedHuruf(item)} />
              </div>
            ))}
          </div>
          {selectedHuruf && (
            <HurufModal
              data={selectedHuruf}
              onClose={() => setSelectedHuruf(null)}
            />
          )}
        </div>
      </Container>
    </section>
  );
}
