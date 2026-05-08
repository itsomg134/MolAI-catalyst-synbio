"use client"

import { FlaskConical, Dna, Cpu, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeroSectionProps {
  onExploreDemo: () => void
}

export default function HeroSection({ onExploreDemo }: HeroSectionProps) {
  return (
    <div className="container mx-auto px-8 py-16 pb-20">
      <div className="flex flex-wrap items-center justify-between gap-12">
        <div className="flex-[1.2]">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full text-sm font-semibold text-primary mb-6 backdrop-blur-sm">
            <FlaskConical className="w-4 h-4" />
            AI-powered molecular engineering
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6 text-balance">
            Accelerating discovery at the{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-emerald-400 bg-clip-text text-transparent">
              intersection
            </span>{" "}
            of catalysis & synthetic biology
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-[90%] leading-relaxed">
            Generative models, deep learning & high-throughput virtual screening — decode reaction pathways and design
            novel enzymes in days, not years.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button onClick={onExploreDemo} className="rounded-full px-7 py-5 font-semibold shadow-lg">
              <Cpu className="w-4 h-4" />
              Explore AI Engine
            </Button>
            <Button
              variant="outline"
              className="rounded-full px-6 py-5 font-semibold border-primary text-primary hover:bg-primary/5"
              onClick={() => window.open("https://www.nature.com/articles/s41589-025-02048-2", "_blank")}
            >
              <BookOpen className="w-4 h-4" />
              Research preview
            </Button>
          </div>
          <div className="flex gap-8 mt-10">
            <div>
              <h3 className="text-2xl font-extrabold text-foreground">10k+</h3>
              <span className="text-muted-foreground text-sm">catalyst motifs</span>
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-foreground">4.2M</h3>
              <span className="text-muted-foreground text-sm">enzyme variants</span>
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-foreground">98%</h3>
              <span className="text-muted-foreground text-sm">accuracy boost</span>
            </div>
          </div>
        </div>
        <div className="flex-[0.9] bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl p-5">
          <div className="bg-card rounded-[32px] p-7 text-center shadow-2xl">
            <Dna className="w-12 h-12 text-primary mx-auto" />
            <div className="mt-3 text-xs tracking-widest text-muted-foreground">GRAPH NEURAL NETWORK</div>
            <div className="bg-secondary rounded-full px-4 py-2 mt-4">
              <span className="font-bold">turnover frequency</span>
              <span className="float-right">↑ 214%</span>
            </div>
            <div className="bg-secondary rounded-full px-4 py-2 mt-2">
              <span className="font-bold">stereoselectivity</span>
              <span className="float-right">{"EE > 99%"}</span>
            </div>
            <div className="mt-5 text-xs text-primary flex items-center justify-center gap-2">
              <Cpu className="w-3 h-3" />
              generative enzyme design
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
