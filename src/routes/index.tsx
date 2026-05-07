import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, FormEvent } from "react";
import emailjs from "@emailjs/browser";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MolAI | Molecular Discovery · Catalysis · Synthetic Biology" },
      { name: "description", content: "AI-powered molecular engineering: generative models and deep learning for catalysis and synthetic biology." },
    ],
    links: [
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&display=swap" },
      { rel: "stylesheet", href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" },
    ],
  }),
  component: Index,
});

const EMAILJS_PUBLIC_KEY = "5CrcaZFr5hqwtwhCL";
const EMAILJS_SERVICE_ID = "service_upx32fm";
const EMAILJS_TEMPLATE_ID = "template_xs93yt3";

function getMockPrediction(smiles: string, taskType: string) {
  if (!smiles || smiles.trim() === "") {
    return { value: "Please enter a valid SMILES or identifier", confidence: "0%", type: "" };
  }
  const input = smiles.trim().toUpperCase();
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) - hash) + input.charCodeAt(i);
    hash |= 0;
  }
  const seed = Math.abs(hash % 10000) / 10000;
  if (taskType === "catalyst") {
    let tofBase = 5 + seed * 6000;
    if (input.includes("C1=CC=CC=C1")) tofBase *= 1.6;
    if (input.includes("N") && input.includes("O")) tofBase *= 1.3;
    if (input.includes("CC")) tofBase *= 0.9;
    let tof = Math.round(tofBase * 10) / 10;
    if (tof < 0.2) tof = 0.2;
    return { value: `${tof} mol·mol⁻¹·h⁻¹`, confidence: `${75 + Math.floor(seed * 20)}%`, type: "Turnover Frequency" };
  }
  const logVal = 3 + seed * 5.5;
  const kcatKm = Math.pow(10, logVal);
  let formatted = "";
  if (kcatKm > 1e6) formatted = (kcatKm / 1e6).toFixed(2) + " × 10⁶";
  else if (kcatKm > 1e3) formatted = (kcatKm / 1e3).toFixed(2) + " × 10³";
  else formatted = kcatKm.toFixed(2);
  formatted += " M⁻¹·s⁻¹";
  let confidence = 68 + Math.floor(seed * 25);
  if (input.includes("COC")) confidence += 6;
  return { value: formatted, confidence: `${Math.min(confidence, 99)}%`, type: "kcat / Km" };
}

function Index() {
  const [smiles, setSmiles] = useState("CCO");
  const [task, setTask] = useState("catalyst");
  const [result, setResult] = useState<{ value: string; confidence: string; type: string } | null>(null);
  const [sending, setSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<"idle" | "success" | "error">("idle");
  const formRef = useRef<HTMLFormElement>(null);

  const handlePredict = () => setResult(getMockPrediction(smiles, task));
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const openResearchPreview = () => {
    window.open("https://www.nature.com/articles/s41589-025-02048-2", "_blank", "noopener,noreferrer");
  };

  const handleSendEmail = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;
    setSending(true);
    setSendStatus("idle");
    try {
      await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, formRef.current, { publicKey: EMAILJS_PUBLIC_KEY });
      setSendStatus("success");
      formRef.current.reset();
    } catch (err) {
      console.error(err);
      setSendStatus("error");
    } finally {
      setSending(false);
    }
  };

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.getElementById("cameraVideo") as HTMLVideoElement | null;
      if (video) {
        video.srcObject = stream;
        await video.play();
      }
    } catch (err) {
      alert("Unable to access camera. Please allow camera permissions.");
      console.error(err);
    }
  };

  const captureSnapshot = () => {
    const video = document.getElementById("cameraVideo") as HTMLVideoElement | null;
    const canvas = document.getElementById("cameraCanvas") as HTMLCanvasElement | null;
    if (!video || !canvas || !video.videoWidth) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    canvas.style.display = "block";
  };

  const stopCamera = () => {
    const video = document.getElementById("cameraVideo") as HTMLVideoElement | null;
    const stream = video?.srcObject as MediaStream | null;
    stream?.getTracks().forEach((t) => t.stop());
    if (video) video.srcObject = null;
  };

  return (
    <>
      <style>{styles}</style>
      <nav className="container">
        <div className="logo">
          <span className="gradient-text">Mol<span style={{ color: "#0f5c4b" }}>AI</span></span>{" "}
          <span style={{ fontWeight: 500 }}>| catalyst<span style={{ color: "#2b9c76" }}>·</span>synbio</span>
        </div>
        <div className="nav-links">
          <a onClick={() => scrollTo("platform")}>Platform</a>
          <a onClick={() => scrollTo("research")}>Research</a>
          <a onClick={() => scrollTo("demo")}>AI Demo</a>
          <a onClick={() => scrollTo("camera")}>Camera</a>
          <a onClick={() => scrollTo("contact")}>Contact</a>
        </div>
      </nav>

      <main>
        <div className="container hero">
          <div className="hero-grid">
            <div className="hero-content">
              <div className="hero-badge"><i className="fas fa-flask" style={{ marginRight: 8 }} /> AI-powered molecular engineering</div>
              <h1>Accelerating discovery at the <span className="gradient-text">intersection</span> of catalysis & synthetic biology</h1>
              <p>Generative models, deep learning & high-throughput virtual screening — decode reaction pathways and design novel enzymes in days, not years.</p>
              <div>
                <button className="btn-primary" onClick={() => scrollTo("demo")}><i className="fas fa-microchip" /> Explore AI Engine</button>
                <button className="btn-outline" style={{ marginLeft: 16 }} onClick={openResearchPreview}>
                  <i className="fas fa-chalkboard-user" /> Research preview
                </button>
              </div>
              <div className="hero-stats">
                <div className="stat-item"><h3>10k+</h3><span>catalyst motifs</span></div>
                <div className="stat-item"><h3>4.2M</h3><span>enzyme variants</span></div>
                <div className="stat-item"><h3>98%</h3><span>accuracy boost</span></div>
              </div>
            </div>
            <div className="hero-visual">
              <div className="molecule-card">
                <i className="fas fa-dna" style={{ fontSize: "3rem", color: "#1f8a6b" }} />
                <div style={{ margin: "12px 0", fontSize: "0.8rem", letterSpacing: 2 }}>GRAPH NEURAL NETWORK</div>
                <div style={{ background: "#eef5f1", borderRadius: 88, padding: 8, margin: "12px 0" }}>
                  <span style={{ fontWeight: 700 }}>turnover frequency</span> <span style={{ float: "right" }}>↑ 214%</span>
                </div>
                <div style={{ background: "#eef5f1", borderRadius: 88, padding: 8 }}>
                  <span style={{ fontWeight: 700 }}>stereoselectivity</span> <span style={{ float: "right" }}>EE &gt; 99%</span>
                </div>
                <div style={{ marginTop: 20, fontSize: "0.75rem", color: "#336b5e" }}><i className="fas fa-robot" /> generative enzyme design</div>
              </div>
            </div>
          </div>
        </div>

        <section id="platform">
          <div className="container">
            <div className="section-title">Intelligent <span className="gradient-text">molecular machinery</span></div>
            <div className="section-sub">From transition-state modeling to pathway discovery — our platform unifies chemical catalysis and synthetic biology with transformer-based architectures.</div>
            <div className="card-grid">
              {[
                { icon: "fa-chart-line", title: "High-throughput DFT", text: "ML surrogate models accelerate density functional theory calculations by 1000x for metal-organic frameworks & organocatalysts." },
                { icon: "fa-dna", title: "Enzyme engineering", text: "Zero-shot mutation effect prediction & directed evolution guided by protein language models (ESM-2, ProtGPT2)." },
                { icon: "fa-atom", title: "Retro-biosynthesis", text: "AI-driven retrosynthesis planning for non-natural molecules, unlocking novel metabolic pathways in host organisms." },
                { icon: "fa-microscope", title: "Active learning loop", text: "Automated closed-loop experimentation: suggest → simulate → validate → refine (Bayesian optimization)." },
              ].map((c) => (
                <div key={c.title} className="service-card glass-card">
                  <i className={`fas ${c.icon}`} />
                  <h3>{c.title}</h3>
                  <p>{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="research" style={{ background: "#f0f6f3" }}>
          <div className="container">
            <div style={{ textAlign: "center" }} className="section-title">Frontiers in <span className="gradient-text">catalysis & synbio</span></div>
            <div style={{ textAlign: "center", marginBottom: 48, marginInline: "auto" }} className="section-sub">Integrating molecular simulations with synthetic gene circuits for sustainable chemical synthesis.</div>
            <div className="research-grid">
              <div className="research-item">
                <i className="fas fa-fire" style={{ fontSize: "2rem", color: "#1c8b6e" }} />
                <h3 style={{ margin: "16px 0 8px" }}>Chemical Catalysis</h3>
                <p>Predictive models for heterogeneous catalysis, single-atom catalysts, and photocatalysis with <strong>reaction fingerprinting</strong> via equivariant neural networks.</p>
                <button className="btn-outline" style={{ fontSize: "0.8rem", padding: "6px 18px", marginTop: 16 }} onClick={openResearchPreview}>Explore &gt;</button>
              </div>
              <div className="research-item">
                <i className="fas fa-vial" style={{ fontSize: "2rem", color: "#1c8b6e" }} />
                <h3 style={{ margin: "16px 0 8px" }}>Synthetic Biology</h3>
                <p>Design of genetic circuits, cell-free systems and biosynthetic pathways. AI-guided <strong>promoter engineering</strong> and riboswitch optimization.</p>
                <button className="btn-outline" style={{ fontSize: "0.8rem", padding: "6px 18px", marginTop: 16 }} onClick={openResearchPreview}>Learn more</button>
              </div>
              <div className="research-item">
                <i className="fas fa-chart-simple" style={{ fontSize: "2rem", color: "#1c8b6e" }} />
                <h3 style={{ margin: "16px 0 8px" }}>Multi‑objective Discovery</h3>
                <p>Optimize turnover, selectivity, stability, and toxicity simultaneously using Pareto‑front reinforcement learning.</p>
                <button className="btn-outline" style={{ fontSize: "0.8rem", padding: "6px 18px", marginTop: 16 }} onClick={openResearchPreview}>case studies</button>
              </div>
            </div>
          </div>
        </section>

        <section id="demo">
          <div className="container demo-section">
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", justifyContent: "space-between" }}>
              <div>
                <span className="hero-badge" style={{ background: "#d9f0e6" }}><i className="fas fa-robot" /> live inference demo</span>
                <h2 className="section-title" style={{ marginTop: 12 }}>AI Catalyst &<br /> Enzyme Activity Predictor</h2>
              </div>
              <i className="fas fa-chalkboard-user" style={{ fontSize: "3rem", opacity: 0.5, color: "#13645a" }} />
            </div>
            <p style={{ marginBottom: 20 }}>Simulate a pre-trained GNN model: predict catalytic efficiency (kcat/Km) or turnover frequency for a given molecular scaffold.</p>
            <div className="input-group">
              <input type="text" value={smiles} onChange={(e) => setSmiles(e.target.value)} placeholder="SMILES (e.g., CCO, c1ccccc1)" />
              <select value={task} onChange={(e) => setTask(e.target.value)}>
                <option value="catalyst">Catalyst TOF (mol/mol/h)</option>
                <option value="enzyme">Enzyme kcat/Km (1/M·s)</option>
              </select>
              <button className="btn-primary" onClick={handlePredict}><i className="fas fa-chart-simple" /> Predict Activity</button>
            </div>
            <div className="prediction-result">
              <div><i className="fas fa-flask" style={{ marginRight: 12 }} /> <strong>Prediction output</strong></div>
              <div style={{ marginTop: 12, fontSize: "1.05rem" }}>
                {result ? `${result.type}: ${result.value}` : 'Select a substrate and click "Predict Activity" — AI model inference ready.'}
              </div>
              {result && <div style={{ marginTop: 12, fontSize: "0.8rem", color: "#477a68" }}>Model confidence: {result.confidence}</div>}
            </div>
          </div>
        </section>

        {/* Camera Service */}
        <section id="camera" style={{ background: "#f0f6f3" }}>
          <div className="container">
            <div className="section-title">Live <span className="gradient-text">Sample Camera</span></div>
            <div className="section-sub">Capture lab samples directly from your device camera — useful for documenting reactions and feeding visual input to vision-based models.</div>
            <div className="camera-wrap">
              <video id="cameraVideo" playsInline muted />
              <canvas id="cameraCanvas" style={{ display: "none" }} />
              <div style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button className="btn-primary" onClick={openCamera}><i className="fas fa-camera" /> Start camera</button>
                <button className="btn-outline" onClick={captureSnapshot}><i className="fas fa-camera-retro" /> Capture</button>
                <button className="btn-outline" onClick={stopCamera}><i className="fas fa-stop" /> Stop</button>
              </div>
            </div>
          </div>
        </section>

        {/* Contact / Email Form */}
        <section id="contact">
          <div className="container">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 48, alignItems: "flex-start", justifyContent: "space-between" }}>
              <div style={{ flex: 1, minWidth: 300 }}>
                <h2 className="section-title">Accelerate your <span className="gradient-text">molecular programs</span></h2>
                <p style={{ marginBottom: 28 }}>Partner with MolAI to integrate predictive models in chemical R&D or synbio foundries.</p>
                <div style={{ marginBottom: 12 }}><i className="fas fa-envelope" style={{ marginRight: 8, color: "#2b9c76" }} /> <a href="mailto:omgedam123098@gmail.com" style={{ color: "#0e2329" }}>omgedam123098@gmail.com</a></div>
                <div style={{ marginBottom: 12 }}><i className="fas fa-globe" style={{ marginRight: 8, color: "#2b9c76" }} /> <a href="https://ogworks.lovable.app/" target="_blank" rel="noreferrer" style={{ color: "#0e2329" }}>ogworks.lovable.app</a></div>
                <div><i className="fab fa-github" style={{ marginRight: 8, color: "#2b9c76" }} /> <a href="https://github.com/itsomg134" target="_blank" rel="noreferrer" style={{ color: "#0e2329" }}>github.com/itsomg134</a></div>
              </div>
              <form ref={formRef} onSubmit={handleSendEmail} className="contact-form">
                <h3 style={{ marginBottom: 16, fontSize: "1.3rem" }}><i className="fas fa-paper-plane" style={{ color: "#2b9c76", marginRight: 8 }} />Email Support</h3>
                <input name="from_name" placeholder="Your name" required />
                <input type="email" name="from_email" placeholder="Your email" required />
                <input name="subject" placeholder="Subject" required />
                <textarea name="message" placeholder="How can we help?" rows={5} required />
                <button type="submit" className="btn-primary" disabled={sending}>
                  <i className="fas fa-paper-plane" /> {sending ? "Sending..." : "Send Message"}
                </button>
                {sendStatus === "success" && <div className="form-msg success">✓ Message sent successfully!</div>}
                {sendStatus === "error" && <div className="form-msg error">✗ Failed to send. Try again.</div>}
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="container footer-grid">
          <div>
            <div className="logo" style={{ color: "white" }}>Mol<span style={{ color: "#64d6b0" }}>AI</span></div>
            <p style={{ marginTop: 12, maxWidth: 280 }}>AI-first molecular discovery for green chemistry & programmable biology.</p>
          </div>
          <div><h4>Platform</h4><p>Catalyst screening</p><p>Enzyme engineering</p><p>Pathway design</p></div>
          <div><h4>Resources</h4><p>Publications</p><p>API docs</p><p>Case studies</p></div>
          <div>
            <h4>Connect</h4>
            <p><a href="mailto:omgedam123098@gmail.com" style={{ color: "#cbd5e1" }}>Email</a></p>
            <p><a href="https://github.com/itsomg134" target="_blank" rel="noreferrer" style={{ color: "#cbd5e1" }}>GitHub</a></p>
            <p><a href="https://ogworks.lovable.app/" target="_blank" rel="noreferrer" style={{ color: "#cbd5e1" }}>Portfolio</a></p>
          </div>
        </div>
        <div className="container copyright">
          <i className="fas fa-microscope" /> Integrating ML with chemical catalysis and synthetic biology — © 2026 MolAI.
        </div>
      </footer>
    </>
  );
}

const styles = `
  body { font-family: 'Inter', sans-serif; background: #f7fafc; color: #0a1927; line-height: 1.4; margin: 0; }
  .container { max-width: 1280px; margin: 0 auto; padding: 0 32px; }
  .glass-card { background: rgba(255,255,255,0.85); backdrop-filter: blur(12px); border-radius: 2rem; border: 1px solid rgba(255,255,255,0.5); box-shadow: 0 20px 35px -12px rgba(0,0,0,0.08); transition: transform .25s, box-shadow .25s; }
  .glass-card:hover { transform: translateY(-4px); box-shadow: 0 28px 40px -16px rgba(0,0,0,0.12); }
  .gradient-text { background: linear-gradient(135deg,#1A5F7A 0%,#2B9C76 50%,#56CFA1 100%); -webkit-background-clip: text; background-clip: text; color: transparent; }
  .btn-primary { background: linear-gradient(105deg,#136B6E 0%,#1C8B6E 100%); border: none; color: white; font-weight: 600; padding: 12px 28px; border-radius: 40px; cursor: pointer; font-size: .95rem; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 8px 18px rgba(27,94,87,.2); transition: all .2s; }
  .btn-primary:hover { transform: scale(1.02); box-shadow: 0 12px 22px rgba(27,94,87,.3); }
  .btn-primary:disabled { opacity: .6; cursor: not-allowed; }
  .btn-outline { background: transparent; border: 1.5px solid #2b9c76; color: #1c6e5c; font-weight: 600; padding: 10px 24px; border-radius: 40px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; transition: all .2s; }
  .btn-outline:hover { background: rgba(43,156,118,.08); }
  nav { padding: 20px 0; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; }
  .logo { font-size: 1.8rem; font-weight: 800; letter-spacing: -.02em; }
  .nav-links { display: flex; gap: 28px; font-weight: 500; }
  .nav-links a { cursor: pointer; color: #1e2f3c; transition: color .2s; }
  .nav-links a:hover { color: #1f8a6b; }
  .hero { padding: 60px 0 80px; }
  .hero-grid { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 48px; }
  .hero-content { flex: 1.2; min-width: 300px; }
  .hero-badge { display: inline-block; background: rgba(43,156,118,.12); padding: 6px 16px; border-radius: 40px; font-size: .8rem; font-weight: 600; color: #1c7a62; margin-bottom: 24px; }
  .hero h1 { font-size: 3.4rem; font-weight: 800; line-height: 1.2; margin-bottom: 24px; }
  .hero p { font-size: 1.2rem; color: #2d4a5e; margin-bottom: 32px; max-width: 90%; }
  .hero-stats { display: flex; gap: 32px; margin-top: 40px; flex-wrap: wrap; }
  .stat-item h3 { font-size: 1.8rem; font-weight: 800; }
  .hero-visual { flex: .9; min-width: 280px; background: radial-gradient(circle at 30% 20%, rgba(43,156,118,.08) 0%, rgba(27,111,94,.02) 70%); border-radius: 2rem; padding: 20px; }
  .molecule-card { background: white; border-radius: 32px; padding: 1.8rem; text-align: center; box-shadow: 0 25px 40px -20px rgba(0,0,0,.2); }
  section { padding: 80px 0; }
  .section-title { font-size: 2.3rem; font-weight: 700; margin-bottom: 16px; }
  .section-sub { font-size: 1.1rem; color: #4b6a7a; max-width: 700px; margin-bottom: 56px; }
  .card-grid { display: flex; flex-wrap: wrap; gap: 32px; justify-content: center; }
  .service-card { background: white; border-radius: 28px; padding: 32px 24px; flex: 1; min-width: 240px; border: 1px solid #e2f0ea; box-shadow: 0 8px 20px rgba(0,0,0,.02); }
  .service-card i { font-size: 2.4rem; color: #1f8a6b; margin-bottom: 20px; }
  .service-card h3 { font-size: 1.5rem; margin-bottom: 12px; }
  .research-grid { display: flex; flex-wrap: wrap; gap: 24px; }
  .research-item { flex: 1; min-width: 280px; background: white; border-radius: 28px; padding: 2rem; border-left: 6px solid #2b9c76; }
  .demo-section { background: linear-gradient(110deg,#eef7f2 0%,#ffffff 100%); border-radius: 48px; padding: 48px; }
  .input-group { display: flex; flex-wrap: wrap; gap: 16px; margin: 32px 0 20px; }
  .input-group input, .input-group select { flex: 1; min-width: 200px; padding: 14px 20px; border-radius: 60px; border: 1px solid #cee4db; font-family: inherit; font-size: .95rem; background: white; outline: none; }
  .input-group input:focus, .input-group select:focus { border-color: #2b9c76; box-shadow: 0 0 0 2px rgba(43,156,118,.2); }
  .prediction-result { background: #ffffffdd; backdrop-filter: blur(8px); border-radius: 2rem; padding: 20px 28px; margin-top: 28px; font-weight: 500; border: 1px solid #cdeae0; }
  .camera-wrap { background: white; border-radius: 32px; padding: 24px; box-shadow: 0 20px 35px -12px rgba(0,0,0,.08); }
  .camera-wrap video, .camera-wrap canvas { width: 100%; max-width: 640px; border-radius: 16px; background: #0a1927; aspect-ratio: 16/9; object-fit: cover; }
  .contact-form { flex: 1; min-width: 300px; background: white; border-radius: 32px; padding: 32px; box-shadow: 0 20px 35px -12px rgba(0,0,0,.08); display: flex; flex-direction: column; gap: 12px; }
  .contact-form input, .contact-form textarea { padding: 12px 18px; border-radius: 16px; border: 1px solid #cee4db; font-family: inherit; font-size: .95rem; outline: none; resize: vertical; }
  .contact-form input:focus, .contact-form textarea:focus { border-color: #2b9c76; box-shadow: 0 0 0 2px rgba(43,156,118,.15); }
  .contact-form button { align-self: flex-start; margin-top: 8px; }
  .form-msg { padding: 10px 16px; border-radius: 12px; font-size: .9rem; font-weight: 500; }
  .form-msg.success { background: #d9f0e6; color: #136B6E; }
  .form-msg.error { background: #fde2e2; color: #a02525; }
  footer { background: #0e2329; color: #cbd5e1; padding: 48px 0 24px; margin-top: 20px; }
  .footer-grid { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 40px; }
  .footer-grid h4 { color: white; margin-bottom: 12px; }
  .copyright { text-align: center; padding-top: 40px; font-size: .85rem; color: #7f9cae; }
  @media (max-width: 800px) { .hero h1 { font-size: 2.3rem; } .nav-links { gap: 16px; } .container { padding: 0 24px; } .hero p { max-width: 100%; } .demo-section { padding: 28px; } }
`;
