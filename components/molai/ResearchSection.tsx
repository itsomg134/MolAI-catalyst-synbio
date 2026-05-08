"use client"

import { Flame, FlaskConical, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"

const researchAreas = [
  {
    icon: Flame,
    title: "Chemical Catalysis",
    description: "Predictive models for heterogeneous catalysis, single-atom catalysts, and photocatalysis.",
    cta: "Explore >",
  },
  {
    icon: FlaskConical,
    title: "Synthetic Biology",
    description: "Design of genetic circuits, cell-free systems, and biosynthetic pathways.",
    cta: "Learn more",
  },
  {
    icon: TrendingUp,
    title: "Multi‑objective Discovery",
    description: "Optimize turnover, selectivity, stability, and toxicity simultaneously.",
    cta: "case studies",
  },
]

export default function ResearchSection() {
  return (
    <section id="research" className="bg-secondary/50 py-20">
      <div className="container mx-auto px-8">
        <h2 className="text-3xl font-bold text-center mb-4">
          Frontiers in{" "}
          <span className="bg-gradient-to-r from-primary via-accent to-emerald-400 bg-clip-text text-transparent">
            catalysis & synbio
          </span>
        </h2>
        <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-12">
          Integrating molecular simulations with synthetic gene circuits for sustainable chemical synthesis.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {researchAreas.map((area) => (
            <div
              key={area.title}
              className="bg-card rounded-3xl p-8 border-l-[6px] border-l-primary shadow-sm"
            >
              <area.icon className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2 text-foreground">{area.title}</h3>
              <p className="text-muted-foreground leading-relaxed mb-5">{area.description}</p>
              <Button variant="outline" size="sm" className="rounded-full border-primary text-primary">
                {area.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
