import Button from "../ui/Button";
import Container from "../ui/Container";

export default function CTASection() {
  return (
    <section className="py-16">
      <Container>
        <div className="bg-(--color-ternary) border-b-8 border-primary py-16 px-8 space-y-8">
          <h1 className="text-(--color-secondary) text-4xl uppercase font-bold text-center">
            siap mulai belajar?
          </h1>
          <p className="text-text-ternary text-center text-sm md:text-base max-w-2xl mx-auto font-normal">
            Kami mengombinasikan seni visual tradisional dengan teknologi modern
            untuk memudahkan proses belajarmu.
          </p>
          <div className="flex flex-col md:flex-row max-w-2xl mx-auto w-full mt-8 gap-6 md:gap-4">
            <Button variant="primary" className="w-full md:flex-1">
              Mulai Belajar
            </Button>
            <Button variant="outline1" className="w-full md:flex-1">
              Lihat Dictionary
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
