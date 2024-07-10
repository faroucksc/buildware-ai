import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern"
import { BentoSection } from "@/components/marketing/bento-section"
import MainSection from "@/components/marketing/main-section"
import { cn } from "@/lib/utils"

export default async function MarketingPage() {
  return (
    <>
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
        )}
      />

      <div className="relative mx-auto mt-32 max-w-7xl px-6 text-center md:px-8">
        <MainSection />
      </div>

      <div className="relative mx-auto mt-32 max-w-7xl px-6 text-center md:px-8">
        <BentoSection />
      </div>
    </>
  )
}