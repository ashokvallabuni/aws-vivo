"use client"

import { useState } from "react"
import { ArrowRight, Camera, Heart, Leaf, Map, Mic, Pause, Play, Settings2, Sparkles, Volume2, X } from "lucide-react"
import "./styles.css"

const stats = [
  ["Health", "92%"], ["Hunger", "70%"], ["Thirst", "82%"], ["Energy", "76%"], ["Happiness", "88%"],
]

export default function Home() {
  const [entered, setEntered] = useState(false)
  const [active, setActive] = useState("Talk")
  const [listening, setListening] = useState(false)
  const [paused, setPaused] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [message, setMessage] = useState("Milo is watching the light move through the trees.")

  const enterWorld = () => { setEntered(true); setMessage("Milo turns toward you. His tail starts to wag.") }
  const doAction = (label: string) => {
    setActive(label)
    const responses: Record<string, string> = { Talk: "Milo tilts his head. He is listening.", Play: "Milo is ready to play fetch.", Bond: "Your bond with Milo is growing.", Care: "Milo looks happy and well cared for.", Explore: "The forest path leads toward the pond." }
    setMessage(responses[label] ?? "Milo is enjoying your company.")
  }
  const talk = () => { setListening(true); setMessage("Listening... say something to Milo."); setTimeout(() => { setListening(false); setMessage("Milo says: ‘I'm right here.’"); }, 1800) }

  return <main className={`viva ${entered ? "is-entered" : ""} ${paused ? "is-paused" : ""}`}>
    <div className="scene" aria-hidden="true"><div className="sun-glow"/><div className="mist mist-one"/><div className="mist mist-two"/><div className="grain"/></div>
    <header className="topbar">
      <div className="brand"><span>VIVA</span><small>LIVING VIRTUAL PET WORLD</small></div>
      {entered && <div className="world-status"><span className="status-dot"/> 07:42 PM <i/> PET HOME</div>}
      <button className="icon-button" aria-label="Settings"><Settings2/></button>
    </header>

    {!entered ? <section className="landing">
      <div className="eyebrow"><span/> A WORLD THAT LIVES WITH YOU</div>
      <h1>Your world.<br/><em>Their world.</em><br/>One connection.</h1>
      <p>Meet virtual companions that listen, learn,<br className="desktop"/> play and grow with you.</p>
      <div className="landing-actions"><button className="primary" onClick={enterWorld}>ENTER VIVA <ArrowRight/></button><button className="quiet" onClick={enterWorld}>TAKE A BREAK</button></div>
      <div className="landing-note"><Sparkles/> Explore a living virtual world without the responsibilities of real pet ownership.</div>
    </section> : <>
      <section className="world-copy"><div className="eyebrow"><span/> MORNING LIGHT</div><h1>Good evening,<br/><em>friend.</em></h1><p>{message}</p></section>
      <div className="pet-marker"><div className="marker-pulse"/><div className="marker-label"><strong>MILO</strong><span>GOLDEN RETRIEVER · LEVEL 5</span></div></div>
      <aside className={`stats-panel ${showProfile ? "open" : ""}`}><div className="stats-head"><div><span className="panel-kicker">YOUR COMPANION</span><h2>Milo</h2></div><button className="close-panel" onClick={() => setShowProfile(false)} aria-label="Close profile"><X/></button></div><div className="bond-row"><Heart fill="currentColor"/><span>Trusted companion</span><b>64%</b></div><div className="stat-list">{stats.map(([name, value]) => <div className="stat" key={name}><span>{name}</span><div><i style={{width: value}}/></div><b>{value}</b></div>)}</div><div className="memory"><span className="panel-kicker">RECENT MEMORY</span><p>“You taught me to sit.”</p><small>Yesterday · Forest clearing</small></div></aside>
      <div className="message-toast"><span className="toast-dot"/>{message}</div>
      <nav className="hud" aria-label="Pet actions">{([[Mic,"Talk"],[Play,"Play"],[Heart,"Bond"],[Leaf,"Care"],[Map,"Explore"]] as Array<[typeof Mic, string]>).map(([Icon,label]) => { const ActionIcon = Icon; return <button className={active === label ? "active" : ""} onClick={() => label === "Talk" ? talk() : doAction(label)} key={label}><ActionIcon/><span>{listening && label === "Talk" ? "Listening" : label}</span></button> })}</nav>
      <div className="world-tools"><button onClick={() => setPaused(!paused)} aria-label={paused ? "Resume world" : "Pause world"}>{paused ? <Play/> : <Pause/>}</button><button aria-label="Sound on"><Volume2/></button><button aria-label="View world"><Camera/></button><button onClick={() => setShowProfile(true)} className="profile-dot" aria-label="Open Milo profile">M</button></div>
      <div className="location-chip"><span/><div><b>Pet Home</b><small>Meadow trail · 240 m</small></div><ArrowRight/></div>
    </>}
    <footer className="footer"><span>VIVA <i/> A LIVING WORLD</span><span>ENTER. CONNECT. PLAY. ESCAPE.</span></footer>
  </main>
}
