import { Huruf } from "@/lib/data/huruf";
import Card from "../ui/Card";

export default function HurufCard({
  data,
  onClick,
}: Readonly<{
  data: Huruf;
  onClick?: () => void;
}>) {
  return (
    <div onClick={onClick}>
      <Card
        className="
          group
          relative
          overflow-hidden
          text-center
          cursor-pointer
          rounded-2xl
          border border-primary/10
          bg-linear-to-br from-white to-red-100
          p-6
          transition-all duration-300
          hover:-translate-y-1
          hover:shadow-xl
          hover:border-primary/20
        "
      >
        {/* Accent Blur */}
        <div className="absolute -top-8 -right-8 w-20 h-20 bg-primary/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-300" />

        {/* Huruf */}
        <div className="relative space-y-3">
          <p className="text-5xl font-black text-(--color-text-primary) transition-transform duration-300 group-hover:scale-110">
            {data.char}
          </p>

          <div className="w-10 h-0.5 bg-primary/30 mx-auto rounded-full" />

          <p className="text-base font-medium tracking-wide text-text-secondary uppercase">
            {data.romaji}
          </p>
        </div>
      </Card>
    </div>
  );
}
