"use client"

import { useState, useRef, useCallback } from "react"
import { Bot, FlaskConical, TrendingUp, Camera, Video, StopCircle, Dna } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

function getMockPrediction(smiles: string, taskType: string) {
  if (!smiles || smiles.trim() === "") return { value: "Invalid SMILES", confidence: "0%", type: "" }
  const input = smiles.trim().toUpperCase()
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) - hash) + input.charCodeAt(i)
    hash |= 0
  }
  const seed = Math.abs(hash % 10000) / 10000

  if (taskType === "catalyst") {
    let tofBase = 5 + seed * 6000
    if (input.includes("C1=CC=CC=C1")) tofBase *= 1.6
    if (input.includes("N") && input.includes("O")) tofBase *= 1.3
    const tof = Math.round(tofBase * 10) / 10
    return { value: `${tof} mol·mol⁻¹·h⁻¹`, confidence: (75 + Math.floor(seed * 20)) + "%", type: "TOF" }
  } else {
    const logVal = 3 + seed * 5.5
    const kcatKm = Math.pow(10, logVal)
    let formatted =
      kcatKm > 1e6
        ? (kcatKm / 1e6).toFixed(2) + " × 10⁶"
        : kcatKm > 1e3
        ? (kcatKm / 1e3).toFixed(2) + " × 10³"
        : kcatKm.toFixed(2)
    formatted += " M⁻¹·s⁻¹"
    return { value: formatted, confidence: (68 + Math.floor(seed * 25)) + "%", type: "kcat/Km" }
  }
}

export default function PredictionPanel() {
  const [smiles, setSmiles] = useState("CCO")
  const [task, setTask] = useState("catalyst")
  const [prediction, setPrediction] = useState<ReturnType<typeof getMockPrediction> | null>(null)
  
  // Camera state
  const [cameraActive, setCameraActive] = useState(false)
  const [ocrResult, setOcrResult] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const handlePredict = () => {
    setPrediction(getMockPrediction(smiles, task))
  }

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setCameraActive(true)
    } catch (err) {
      alert("Camera access denied or error: " + err)
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
      streamRef.current = null
    }
    setCameraActive(false)
  }, [])

  const captureAndExtract = useCallback(() => {
    if (!videoRef.current || !streamRef.current) {
      alert("Please start camera first.")
      return
    }
    // Simulated molecular ID extraction
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    const fakeSmiles = `C${randomCode}OC(=O)c1ccccc1`
    setOcrResult(fakeSmiles)
    setSmiles(fakeSmiles)
  }, [])

  return (
    <section id="demo" className="py-20">
      <div className="container mx-auto px-8">
        <div className="bg-gradient-to-br from-secondary to-card rounded-[48px] p-12">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-secondary px-4 py-1.5 rounded-full text-sm font-semibold text-primary mb-3">
                <Bot className="w-4 h-4" />
                live inference demo
              </div>
              <h2 className="text-3xl font-bold">
                AI Catalyst &<br />
                Enzyme Activity Predictor
              </h2>
            </div>
            <Bot className="w-12 h-12 text-primary/50" />
          </div>

          <p className="text-muted-foreground mb-5">
            Simulate a pre-trained GNN model: predict catalytic efficiency (kcat/Km) or turnover frequency for a given
            molecular scaffold.
          </p>

          <div className="flex flex-wrap gap-4 mb-5">
            <Input
              value={smiles}
              onChange={(e) => setSmiles(e.target.value)}
              placeholder="SMILES / molecular identifier (e.g., CCO, CC(=O)O, c1ccccc1)"
              className="flex-1 min-w-[250px] rounded-full px-6 py-5 bg-card"
              onKeyDown={(e) => e.key === "Enter" && handlePredict()}
            />
            <Select value={task} onValueChange={setTask}>
              <SelectTrigger className="w-[220px] rounded-full px-6 py-5 bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="catalyst">Catalyst TOF (mol/mol/h)</SelectItem>
                <SelectItem value="enzyme">Enzyme kcat/Km (1/M·s)</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handlePredict} className="rounded-full px-6 py-5 font-semibold">
              <TrendingUp className="w-4 h-4" />
              Predict Activity
            </Button>
          </div>

          <div className="bg-card/90 backdrop-blur rounded-2xl p-5 border border-border">
            <div className="flex items-center gap-2 font-medium">
              <FlaskConical className="w-5 h-5 text-primary" />
              <strong>Prediction output</strong>
            </div>
            {prediction ? (
              <div className="mt-3">
                <div className="text-lg">
                  <strong>Predicted {task === "catalyst" ? "TOF" : "kcat/Km"}:</strong> {prediction.value}
                </div>
                <div className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  model confidence: {prediction.confidence} (ensemble)
                </div>
              </div>
            ) : (
              <p className="mt-3 text-muted-foreground">
                {"Select a substrate and click \"Predict Activity\" — AI model inference ready."}
              </p>
            )}
          </div>

          {/* Camera Section */}
          <div className="mt-8 bg-secondary/30 rounded-3xl p-6 border border-dashed border-primary">
            <h3 className="text-xl font-semibold flex items-center gap-2 mb-2">
              <Camera className="w-5 h-5 text-primary" />
              Molecular Structure Capture via Camera{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-emerald-400 bg-clip-text text-transparent">
                (Smart OCR / QR / sample imaging)
              </span>
            </h3>
            <p className="text-muted-foreground mb-5">
              Use your camera to capture a molecular identifier or experimental barcode — simulated SMILES extraction
              from snapshot (Demo: extracts dummy SMILES or reads placeholder). In production, integrated with InChI/QR
              decoding.
            </p>

            <div className="flex flex-col items-center gap-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="rounded-3xl w-full max-w-[380px] bg-foreground/5 aspect-video"
              />
              <div className="flex flex-wrap gap-3">
                <Button onClick={startCamera} className="rounded-full" disabled={cameraActive}>
                  <Video className="w-4 h-4" />
                  Start Camera
                </Button>
                <Button onClick={captureAndExtract} className="rounded-full" disabled={!cameraActive}>
                  <Camera className="w-4 h-4" />
                  Capture & Extract SMILES
                </Button>
                <Button
                  variant="outline"
                  onClick={stopCamera}
                  className="rounded-full border-primary text-primary"
                  disabled={!cameraActive}
                >
                  <StopCircle className="w-4 h-4" />
                  Stop Camera
                </Button>
              </div>

              <div className="w-full bg-secondary/50 rounded-2xl p-4 border border-border">
                <span className="text-lg">📸 Snapshot output: </span>
                {ocrResult ? (
                  <span className="inline-flex items-center gap-2">
                    <Dna className="w-4 h-4 text-primary" />
                    Extracted: {ocrResult}
                    <span className="text-xs text-muted-foreground block">
                      (AI vision inference: captured molecular barcode → SMILES)
                    </span>
                  </span>
                ) : (
                  <span className="text-muted-foreground">Not captured yet</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
