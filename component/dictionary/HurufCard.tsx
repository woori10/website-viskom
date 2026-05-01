import { Huruf } from "@/lib/data/huruf";
import Card from "../ui/Card";

export default function HurufCard({
  data,
  onClick,
}: {
  data: Huruf;
  onClick?: () => void;
}) {
  return (
    <div onClick={onClick}>
      <Card className="text-center cursor-pointer space-y-2">
        <p className="text-3xl font-bold">{data.char}</p>
        <p className="text-lg text-text-secondary">{data.romaji}</p>
      </Card>
    </div>
  );
}
