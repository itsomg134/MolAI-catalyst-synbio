"use client"

import { Microscope } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-6 mt-5">
      <div className="container mx-auto px-8">
        <div className="flex flex-wrap justify-between gap-10 mb-10">
          <div>
            <div className="text-2xl font-extrabold">
              Mol<span className="text-emerald-400">AI</span>
            </div>
            <p className="mt-3 max-w-[280px] text-slate-400">
              AI-first molecular discovery for green chemistry & programmable biology.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-100 mb-3">Platform</h4>
            <p className="text-slate-400 text-sm">Catalyst screening</p>
            <p className="text-slate-400 text-sm">Enzyme engineering</p>
            <p className="text-slate-400 text-sm">Pathway design</p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-100 mb-3">Resources</h4>
            <p className="text-slate-400 text-sm">Publications</p>
            <p className="text-slate-400 text-sm">API docs</p>
            <p className="text-slate-400 text-sm">Case studies</p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-100 mb-3">Legal</h4>
            <p className="text-slate-400 text-sm">Privacy & terms</p>
            <p className="text-slate-400 text-sm">© 2026 MolAI</p>
          </div>
        </div>
        <div className="text-center text-slate-500 text-sm pt-10 border-t border-slate-800 flex items-center justify-center gap-2">
          <Microscope className="w-4 h-4" />
          Integrating machine learning with chemical catalysis and synthetic biology — shaping the future of molecular
          design.
        </div>
      </div>
    </footer>
  )
}
