import CTASection from "@/component/section/CTASection";
import DictionarySection from "@/component/section/DictionarySection";
import HeroSection from "@/component/section/HeroSection";
import QuizSection from "@/component/section/QuizSection";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <DictionarySection />
      <QuizSection />
      <CTASection />
    </div>
  );
}
