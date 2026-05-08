"use client"

import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="container mx-auto px-8 py-5 flex items-center justify-between flex-wrap">
      <div className="text-2xl font-extrabold tracking-tight">
        <span className="bg-gradient-to-r from-primary via-accent to-emerald-400 bg-clip-text text-transparent">
          Mol<span className="text-teal-800">AI</span>
        </span>{" "}
        <span className="font-medium text-foreground">
          | catalyst<span className="text-primary">·</span>synbio
        </span>
      </div>
      <div className="flex gap-9 font-medium">
        <Link href="#platform" className="text-foreground hover:text-primary transition-colors">
          Platform
        </Link>
        <Link href="#research" className="text-foreground hover:text-primary transition-colors">
          Research
        </Link>
        <Link href="#demo" className="text-foreground hover:text-primary transition-colors">
          AI Demo
        </Link>
        <Link href="#contact" className="text-foreground hover:text-primary transition-colors">
          Contact
        </Link>
      </div>
    </nav>
  )
}
