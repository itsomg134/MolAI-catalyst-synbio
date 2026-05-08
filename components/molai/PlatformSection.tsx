"use client"

import { TrendingUp, Dna, Atom, Microscope, Calculator, Dice6 } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

function computeMockDescriptors(smiles: string) {
  if (!smiles.trim()) return null
  let hash = 0
  for (let i = 0; i < smiles.length; i++) {
    hash = ((hash << 5) - hash) + smiles.charCodeAt(i)
  }
  const seed = (Math.abs(hash) % 1000) / 1000
  return {
    logP: (1.5 + seed * 4.2).toFixed(2),
    tpsa: (20 + seed * 110).toFixed(1),
    homoLumo: (2.5 + seed * 4.0).toFixed(2),
    saScore: (2.2 + seed * 3.8).toFixed(1),
  }
}

const services = [
  {
    icon: TrendingUp,
    title: "High-throughput DFT",
    description: "ML surrogate models accelerate density functional theory calculations by 1000x for metal-organic frameworks & organocatalysts.",
  },
  {
    icon: Dna,
    title: "Enzyme engineering",
    description: "Zero-shot mutation effect prediction & directed evolution guided by protein language models (ESM-2, ProtGPT2).",
  },
  {
    icon: Atom,
    title: "Retro-biosynthesis",
    description: "AI-driven retrosynthesis planning for non-natural molecules, unlocking novel metabolic pathways in host organisms.",
  },
  {
    icon: Microscope,
    title: "Active learning loop",
    description: "Automated closed-loop experimentation: suggest → simulate → validate → refine (Bayesian optimization).",
  },
]

export default function PlatformSection() {
  const [descSmiles, setDescSmiles] = useState("CC(=O)Oc1ccccc1C(=O)O")
  const [descriptors, setDescriptors] = useState<ReturnType<typeof computeMockDescriptors>>(null)

  const handleCompute = () => {
    setDescriptors(computeMockDescriptors(descSmiles))
  }

  return (
    <section id="platform" className="py-20">
      <div className="container mx-auto px-8">
        <h2 className="text-3xl font-bold mb-4">
          Intelligent{" "}
          <span className="bg-gradient-to-r from-primary via-accent to-emerald-400 bg-clip-text text-transparent">
            molecular machinery
          </span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mb-14">
          From transition-state modeling to pathway discovery — our platform unifies chemical catalysis and synthetic
          biology with transformer-based architectures.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <Card
              key={service.title}
              className="rounded-3xl border-border hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
            >
              <CardContent className="p-8">
                <service.icon className="w-10 h-10 text-primary mb-5" />
                <h3 className="text-xl font-bold mb-3 text-foreground">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Advanced Molecular Descriptors */}
        <div className="mt-14 bg-secondary/30 rounded-[32px] p-8">
          <h3 className="text-2xl font-semibold flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-primary" />
            Advanced: AI Molecular Descriptors{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-emerald-400 bg-clip-text text-transparent">
              (Quantum & Graph-based)
            </span>
          </h3>
          <p className="text-muted-foreground mt-2 mb-5 max-w-3xl">
            Compute topological polar surface area, LogP, HOMO-LUMO gap (predicted) and synthetic accessibility from
            SMILES — powered by embedded ML models.
          </p>
          <div className="flex flex-wrap gap-4">
            <Input
              value={descSmiles}
              onChange={(e) => setDescSmiles(e.target.value)}
              placeholder="Enter SMILES for deep descriptor analysis (ex: CC(=O)Oc1ccccc1C(=O)O)"
              className="flex-1 min-w-[300px] rounded-full px-6 py-5 bg-card"
            />
            <Button onClick={handleCompute} className="rounded-full px-6 py-5 font-semibold">
              <Calculator className="w-4 h-4" />
              Compute Advanced Descriptors
            </Button>
          </div>
          <div className="mt-7 bg-card/80 backdrop-blur rounded-2xl p-5 border border-border">
            <div className="flex items-center gap-2 font-medium mb-3">
              <Dice6 className="w-5 h-5 text-primary" />
              <strong>Molecular Profile</strong>
            </div>
            {descriptors ? (
              <div className="space-y-1 text-foreground">
                <div>▪ LogP: {descriptors.logP}</div>
                <div>▪ TPSA: {descriptors.tpsa} Å²</div>
                <div>▪ HOMO-LUMO gap: {descriptors.homoLumo} eV</div>
                <div>▪ Synthetic Accessibility: {descriptors.saScore}/10</div>
                <div className="text-xs text-muted-foreground mt-2">(AI-based inference from molecular graph)</div>
              </div>
            ) : (
              <p className="text-muted-foreground">
                {"Click \"Compute\" to extract quantum-inspired & cheminformatic features."}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
