"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Sky, ContactShadows } from "@react-three/drei"
import { useEffect, useMemo, useRef, useState } from "react"
import * as THREE from "three"
import { ArrowRight, Brain, Heart, Map, Mic, Pause, Play, Settings2, Sparkles, X } from "lucide-react"
import "./styles.css"

type DogState = "idle" | "walking" | "running" | "sitting" | "lying" | "playing" | "fetching" | "eating" | "drinking" | "sleeping" | "following" | "wagging"
type Command = "sit" | "stand" | "come" | "play" | "fetch" | "down" | "stay" | "eat" | "drink" | "sleep" | "good"

const initialStats = { Health: 95, Hunger: 80, Energy: 90, Happiness: 88 }
const commandMatchers: Array<[Command, RegExp]> = [
  ["sit", /\bsit(?: down)?\b/], ["stand", /\bstand\b|wake up/], ["come", /\bcome(?: here| to me)?\b|follow me/],
  ["play", /let'?s play|\bplay\b/], ["fetch", /fetch|bring it/], ["down", /lie down|\bdown\b/], ["stay", /stay/],
  ["eat", /eat/], ["drink", /drink/], ["sleep", /sleep|go to bed/], ["good", /good (?:boy|girl)/],
]

function parseCommand(text: string): Command | null {
  const clean = text.toLowerCase().replace(/milo|please|can you|hey/g, " ")
  return commandMatchers.find(([, pattern]) => pattern.test(clean))?.[0] ?? null
}

function Dog({ state, target, onArrive }: { state: DogState; target: [number, number, number]; onArrive: () => void }) {
  const group = useRef<THREE.Group>(null)
  const tail = useRef<THREE.Group>(null)
  const phase = useRef(Math.random() * 10)
  useFrame((_, delta) => {
    if (!group.current) return
    phase.current += delta
    const isMoving = ["walking", "running", "following", "fetching", "playing"].includes(state)
    if (isMoving) {
      const dx = target[0] - group.current.position.x
      const dz = target[2] - group.current.position.z
      const distance = Math.hypot(dx, dz)
      if (distance > 0.18) {
        const speed = state === "running" || state === "fetching" ? 2.4 : 1.05
        group.current.position.x += (dx / distance) * speed * delta
        group.current.position.z += (dz / distance) * speed * delta
        group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, Math.atan2(dx, dz), delta * 5)
      } else onArrive()
    }
    const bob = ["sitting", "lying", "sleeping"].includes(state) ? 0 : Math.sin(phase.current * 7) * 0.018
    group.current.position.y = bob
    if (tail.current) tail.current.rotation.z = Math.sin(phase.current * (state === "wagging" ? 12 : 3)) * 0.32
  })
  const low = ["sitting", "lying", "sleeping"].includes(state)
  return <group ref={group} position={[0, 0, 0]}><group rotation={[0, 0, low ? 0.04 : 0]}><mesh position={[0, 1.12, 0]} castShadow><capsuleGeometry args={[0.5, 1.15, 8, 16]} /><meshStandardMaterial color="#b87943" roughness={0.86} /></mesh><mesh position={[0, 1.52, -0.58]} castShadow><sphereGeometry args={[0.45, 20, 16]} /><meshStandardMaterial color="#c88b51" roughness={0.82} /></mesh><mesh position={[0, 1.55, -0.98]}><sphereGeometry args={[0.19, 16, 12]} /><meshStandardMaterial color="#241914" /></mesh><mesh position={[-0.22, 1.78, -0.73]} rotation={[0.2, 0.2, -0.2]}><coneGeometry args={[0.15, 0.42, 8]} /><meshStandardMaterial color="#754528" /></mesh><mesh position={[0.22, 1.78, -0.73]} rotation={[0.2, -0.2, 0.2]}><coneGeometry args={[0.15, 0.42, 8]} /><meshStandardMaterial color="#754528" /></mesh><mesh position={[-0.15, 1.63, -1.33]}><sphereGeometry args={[0.045, 8, 8]} /><meshStandardMaterial color="#181411" /></mesh><mesh position={[0.15, 1.63, -1.33]}><sphereGeometry args={[0.045, 8, 8]} /><meshStandardMaterial color="#181411" /></mesh>{[[-0.28, 0.64, -0.32], [0.28, 0.64, -0.32], [-0.28, 0.64, 0.34], [0.28, 0.64, 0.34]].map((p, i) => <mesh key={i} position={p as [number, number, number]}><capsuleGeometry args={[0.12, 0.45, 6, 10]} /><meshStandardMaterial color="#a96639" /></mesh>)}<group ref={tail} position={[0, 1.3, 0.63]} rotation={[0.35, 0, 0]}><mesh><capsuleGeometry args={[0.11, 0.55, 6, 10]} /><meshStandardMaterial color="#d59b60" /></mesh></group></group></group>
}

function World({ state, target, onArrive }: { state: DogState; target: [number, number, number]; onArrive: () => void }) {
  const flowers = useMemo(() => Array.from({ length: 24 }, (_, i) => [((i * 17) % 14) - 7, 0.04, ((i * 23) % 13) - 6] as [number, number, number]), [])
  return <Canvas shadows camera={{ position: [7, 5.2, 8], fov: 44 }}><Sky distance={450000} sunPosition={[5, 8, -4]} turbidity={8} rayleigh={2} /><ambientLight intensity={1.7} color="#dce9d0" /><directionalLight castShadow position={[4, 8, 2]} intensity={3} color="#ffe2ad" shadow-mapSize={[2048, 2048]} /><mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[30, 24]} /><meshStandardMaterial color="#5d754c" roughness={1} /></mesh><mesh position={[-3.8, 0.08, -2.5]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[2.4, 32]} /><meshStandardMaterial color="#6ca0a0" roughness={0.15} metalness={0.1} /></mesh>{[-5, 5].map((x) => <group key={x} position={[x, 0, -3]}><mesh position={[0, 1.4, 0]} castShadow><cylinderGeometry args={[0.28, 0.42, 2.8, 8]} /><meshStandardMaterial color="#5d3d28" /></mesh><mesh position={[0, 3, 0]} castShadow><coneGeometry args={[1.8, 3.6, 9]} /><meshStandardMaterial color="#35583e" roughness={1} /></mesh></group>)}<mesh position={[2.8, 0.16, -1.9]} castShadow><boxGeometry args={[1.7, 0.8, 1.5]} /><meshStandardMaterial color="#754b2f" /></mesh>{flowers.map((p, i) => <mesh key={i} position={p}><sphereGeometry args={[0.07, 8, 8]} /><meshStandardMaterial color={i % 2 ? "#e6af88" : "#d8d982"} /></mesh>)}<Dog state={state} target={target} onArrive={onArrive} /><ContactShadows position={[0, 0.01, 0]} opacity={0.42} scale={12} blur={2.4} far={5} /><OrbitControls enablePan={false} minDistance={4} maxDistance={13} maxPolarAngle={Math.PI / 2.2} target={[0, 0.9, 0]} /></Canvas>
}

export default function Home() {
  const [entered, setEntered] = useState(false)
  const [state, setState] = useState<DogState>("walking")
  const [target, setTarget] = useState<[number, number, number]>([2.8, 0, -1.9])
  const [listening, setListening] = useState(false), [transcript, setTranscript] = useState(""), [message, setMessage] = useState("Milo is exploring the meadow."), [showProfile, setShowProfile] = useState(false), [paused, setPaused] = useState(false)
  const [stats, setStats] = useState(initialStats), [learned, setLearned] = useState(["Sit", "Stay", "Come", "Fetch"]), [confidence, setConfidence] = useState(72)
  const execute = (command: Command) => { const actions: Record<Command, [DogState, string, [number, number, number]]> = { sit: ["sitting", "Okay. Milo sits and looks up at you.", [0, 0, 0]], stand: ["walking", "Milo stands, ready for anything.", [1.8, 0, -0.4]], come: ["running", "Coming! Milo runs toward you.", [0.2, 0, 0.5]], play: ["playing", "Let's play! Milo races to his favorite ball.", [2.8, 0, -1.9]], fetch: ["fetching", "Milo fetches the ball and brings it back.", [1.8, 0, -1.5]], down: ["lying", "Milo settles down beside you.", [0, 0, 0.2]], stay: ["sitting", "Milo stays exactly where he is.", [0, 0, 0]], eat: ["eating", "Milo trots to his bowl.", [2.8, 0, -1.9]], drink: ["drinking", "Milo heads to the pond for a drink.", [-3.8, 0, -2.5]], sleep: ["sleeping", "Milo curls up for a peaceful nap.", [2.8, 0, -1.9]], good: ["wagging", "Milo wags his tail. Bond increased.", [0, 0, 0]] }; const [next, text, nextTarget] = actions[command]; setState(next); setTarget(nextTarget); setMessage(text); if (command === "good") setStats((s) => ({ ...s, Happiness: Math.min(100, s.Happiness + 2) })); if (command === "sit") { setConfidence((c) => Math.min(100, c + 4)); setLearned((items) => items.includes("Sit") ? items : [...items, "Sit"]) } }
  const handleText = (text: string) => { setTranscript(text); const command = parseCommand(text); if (command) execute(command); else setMessage("Milo tilts his head. He doesn't know that one yet.") }
  const talk = () => { if (listening) return; setListening(true); setTranscript(""); setMessage("Listening... say something to Milo."); const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition; if (!Recognition) { setTimeout(() => { setListening(false); setMessage("Voice is unavailable here. Use the command box below.") }, 900); return }; const recognition = new Recognition(); recognition.lang = "en-US"; recognition.interimResults = false; recognition.onresult = (e) => { setListening(false); handleText(e.results[0][0].transcript) }; recognition.onerror = () => { setListening(false); setMessage("Couldn't hear that. Try again.") }; recognition.onend = () => setListening(false); recognition.start() }
  useEffect(() => { if (!entered || paused) return; const id = window.setInterval(() => { setState((current) => current === "walking" ? "idle" : "walking"); setTarget([Math.sin(Date.now() / 2400) * 3, 0, Math.cos(Date.now() / 2000) * 2]) }, 8000); return () => window.clearInterval(id) }, [entered, paused])
  return <main className={`viva ${entered ? "is-entered" : ""}`}>{!entered ? <><div className="hero-backdrop" /><header className="topbar"><div className="brand"><span>VIVA</span><small>LIVING VIRTUAL PET WORLD</small></div><button className="icon-button" aria-label="Settings"><Settings2 /></button></header><section className="landing"><div className="eyebrow"><span /> A WORLD THAT LIVES WITH YOU</div><h1>Your world.<br /><em>Their world.</em><br />One connection.</h1><p>Meet Milo, a virtual companion who listens, learns,<br className="desktop" /> plays and grows with you.</p><button className="primary" onClick={() => { setEntered(true); setMessage("Milo turns toward you. His tail starts to wag.") }}>ENTER VIVA <ArrowRight /></button><div className="landing-note"><Sparkles /> Speak. Watch. Connect.</div></section></> : <><div className="world-canvas"><World state={paused ? "idle" : state} target={target} onArrive={() => { if (state === "fetching") setMessage("Milo returns with the ball and drops it at your feet.") }} /></div><header className="topbar"><div className="brand"><span>VIVA</span><small>LIVING VIRTUAL PET WORLD</small></div><div className="world-status"><span className="status-dot" /> 07:42 PM <i /> PET HOME</div><button className="icon-button" aria-label="Settings"><Settings2 /></button></header><section className="world-copy"><div className="eyebrow"><span /> MILO'S MEADOW</div><h1>Good evening,<br /><em>friend.</em></h1><p>{message}</p>{transcript && <div className="heard"><span>HEARD</span> "{transcript}"</div>}</section><div className="dog-state"><span className="state-dot" /> MILO IS {state.toUpperCase()}</div><div className="command-box"><button className={`talk-button ${listening ? "listening" : ""}`} onClick={talk} type="button"><Mic /><span>{listening ? "LISTENING..." : "TALK TO MILO"}</span></button><form onSubmit={(e) => { e.preventDefault(); const input = e.currentTarget.elements.namedItem("command") as HTMLInputElement; if (input.value.trim()) { handleText(input.value.trim()); input.value = "" } }}><input name="command" aria-label="Command Milo" placeholder="Try sit, come here, or let's play" /><button className="send-button" aria-label="Send command" type="submit"><ArrowRight /></button></form><div className="quick-actions"><button onClick={() => execute("sit")} type="button"><span>01</span> SIT</button><button onClick={() => execute("come")} type="button"><span>02</span> COME</button><button onClick={() => execute("play")} type="button"><span>03</span> PLAY</button></div></div>{showProfile && <aside className="side-panel"><div className="panel-heading"><span>COMPANION PROFILE</span><button className="close-profile" onClick={() => setShowProfile(false)} aria-label="Close profile"><X /></button></div><div className="profile-name"><div className="avatar">M</div><div><strong>MILO</strong><small>GOLDEN RETRIEVER · 2 YRS</small></div></div><div className="stats">{Object.entries(stats).map(([label, value]) => <div className="stat" key={label}><div><span>{label}</span><b>{value}%</b></div><div className="meter"><i style={{ width: `${value}%` }} /></div></div>)}</div><div className="learned"><span>LEARNED COMMANDS</span><div>{learned.map((item) => <button key={item} onClick={() => execute(item.toLowerCase() as Command)} type="button"><Brain /> {item}</button>)}</div></div><div className="bond"><Heart /> <span>BOND STRENGTH <b>{confidence}%</b></span></div></aside>}<nav className="bottom-nav"><button onClick={() => setPaused((value) => !value)} aria-label={paused ? "Resume world" : "Pause world"}>{paused ? <Play /> : <Pause />}<span>{paused ? "RESUME" : "PAUSE"}</span></button><button onClick={() => setShowProfile((value) => !value)} aria-label="Open companion profile"><Heart /><span>PROFILE</span></button><button aria-label="Open map"><Map /><span>MAP</span></button></nav></>}</main>
}

type SpeechRecognition = { lang: string; interimResults: boolean; onresult: (event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void; onerror: () => void; onend: () => void; start: () => void }

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition
    webkitSpeechRecognition?: new () => SpeechRecognition
  }
}
