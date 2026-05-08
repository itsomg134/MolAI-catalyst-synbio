"use client"

import { useState } from "react"
import { Mail, Send, MessageCircle, Github, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email) {
      alert("Please fill in name and email.")
      return
    }
    // Simulate form submission
    setSubmitted(true)
    setFormData({ name: "", email: "", message: "" })
    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <section id="contact" className="py-20 pb-10">
      <div className="container mx-auto px-8">
        <div className="flex flex-wrap gap-12 items-start justify-between">
          <div className="flex-1 min-w-[300px]">
            <h2 className="text-3xl font-bold mb-4">
              Accelerate your{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-emerald-400 bg-clip-text text-transparent">
                molecular programs
              </span>
            </h2>
            <p className="text-muted-foreground mb-7 max-w-lg leading-relaxed">
              Partner with MolAI to integrate predictive models in chemical R&D or synbio foundries. From de novo
              catalyst design to pathway optimization, we offer API-first AI modules.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-5">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                discovery@molai.bio
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary">𝕏</span>
                @MolAI_catalyst
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-7">
              <a
                href="https://github.com/itsomg134"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-primary hover:text-accent transition-colors"
              >
                <Github className="w-5 h-5" />
                GitHub
              </a>
              <a
                href="https://ogworks.lovable.app/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-primary hover:text-accent transition-colors"
              >
                <Globe className="w-5 h-5" />
                Portfolio
              </a>
              <a
                href="mailto:omgedam123098@gmail.com"
                className="flex items-center gap-2 text-primary hover:text-accent transition-colors"
              >
                <Send className="w-5 h-5" />
                omgedam123098@gmail.com
              </a>
            </div>

            <Button
              className="rounded-full px-7 py-5 font-semibold"
              onClick={() => alert("📧 Early access request sent to discovery@molai.bio (demo)")}
            >
              <Send className="w-4 h-4" />
              Request collaboration
            </Button>
          </div>

          <Card className="flex-[0.8] min-w-[280px] rounded-[32px] shadow-lg">
            <CardContent className="p-7">
              <h3 className="text-xl font-semibold flex items-center gap-2 mb-5">
                <MessageCircle className="w-5 h-5 text-primary" />
                Message our science team
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="Full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="rounded-full px-5 py-5"
                  required
                />
                <Input
                  type="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="rounded-full px-5 py-5"
                  required
                />
                <Textarea
                  placeholder="Your research inquiry / collaboration idea..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="rounded-3xl px-5 py-4 resize-y min-h-[100px]"
                  rows={3}
                />
                <Button type="submit" className="w-full rounded-full py-5 font-semibold">
                  <Send className="w-4 h-4" />
                  Send via Encrypted Channel
                </Button>
              </form>
              {submitted && (
                <div className="mt-4 bg-primary text-primary-foreground rounded-full px-5 py-3 text-center">
                  ✅ Message sent! Our catalysis team will respond within 24h.
                </div>
              )}
              <p className="text-xs text-center text-muted-foreground mt-5">
                🔐 Powered by EmailJS – direct to R&D
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
