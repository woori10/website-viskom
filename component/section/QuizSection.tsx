import { Pencil } from "lucide-react";
import Container from "../ui/Container";

export default function QuizSection() {
  return (
    <section className="py-16">
      <div data-aos="fade-up" className="bg-(--color-primary)">
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
              <h2 className="uppercase text-secondary text-xl font-black tracking-wider">
                Tulis dengan percaya diri
              </h2>
              <p className="text-secondary text-sm text-justify">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Tempore, vero sapiente hic fugiat praesentium dolorum nemo?
                Voluptate laborum molestiae cum quidem enim error corrupti dolor
                ducimus facilis. Dolorum, odit eum?
              </p>
              <div className="flex text-secondary gap-4">
                <div className="flex w-fit h-fit p-1 border border-secondary items-center justify-center">
                  <Pencil className="w-4 h-4" />
                </div>
                <div className="items-start">
                  <p className="text-sm text-justify">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Nam optio dolorum ducimus eos dolores numquam iusto, odio in
                    praesentium dolorem quidem, facilis quibusdam ipsa non vitae
                    deleniti eum possimus quae.
                  </p>
                </div>
              </div>
              <div className="flex text-secondary gap-4">
                <div className="flex w-fit h-fit p-1 border border-secondary items-center justify-center">
                  <Pencil className="w-4 h-4" />
                </div>
                <p className="text-sm text-justify">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam
                  optio dolorum ducimus eos dolores numquam iusto, odio in
                  praesentium dolorem quidem, facilis quibusdam ipsa non vitae
                  deleniti eum possimus quae.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
