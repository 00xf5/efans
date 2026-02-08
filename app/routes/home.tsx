import type { Route } from "./+types/home";
import { Link } from "react-router";
import { SAMPLE_CREATORS } from "../utils/sample-data";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "eFans | Premium Content Subscriptions" },
    { name: "description", content: "The most discoverable platform for creators. Built for SEO, speed, and premium experiences." },
  ];
}

export default function Home() {
  return (
    <div className="flex flex-col items-center bg-black text-white selection:bg-primary/20 font-display">
      {/* Hero Section */}
      <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Background Mesh Gradient */}
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-zinc-800/20 rounded-full blur-[140px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-zinc-900/40 rounded-full blur-[140px]"></div>
        </div>

        <div className="relative z-10 max-w-5xl text-center space-y-8 animate-entrance">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black tracking-widest uppercase">
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary animate-pulse"></span>
            </span>
            Direct Discovery Platform
          </div>

          <h1 className="text-5xl md:text-9xl font-black tracking-tighter leading-[0.9] text-white italic">
            Unleash Your <br />
            <span className="text-gradient">Digital Legacy.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-400 font-bold italic leading-relaxed">
            The first SEO-native sanctuary for top-tier creators. Built for speed, sovereignty, and the premium experience your fans deserve.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link
              to="/signup"
              className="w-full sm:w-auto bg-white text-black px-12 py-5 rounded-full text-[11px] font-black uppercase tracking-[0.3em] transition-all hover:scale-105 active:scale-95 shadow-none"
            >
              Start Creating Now
            </Link>
            <Link
              to="/creators"
              className="w-full sm:w-auto bg-zinc-900/50 border border-zinc-800 text-white px-12 py-5 rounded-full text-[11px] font-black uppercase tracking-[0.3em] transition-all hover:bg-zinc-800 active:scale-95"
            >
              Explore Sanctuary
            </Link>
          </div>

          <div className="pt-20 flex flex-col items-center gap-6 opacity-40">
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em] italic">Validated by Industry Leaders</p>
            <div className="flex flex-wrap justify-center gap-12 grayscale brightness-200">
              <span className="text-xl font-black tracking-tighter italic">CREATOR.CO</span>
              <span className="text-xl font-black tracking-tighter italic">DIGITAL.X</span>
              <span className="text-xl font-black tracking-tighter italic">ELITE.FN</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Creators Section */}
      <section className="w-full py-40 space-y-24 overflow-hidden bg-black text-white relative border-y border-zinc-900/50">
        <div className="max-w-7xl mx-auto px-6 space-y-6 relative z-10 text-center animate-entrance">
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-tight uppercase italic text-white">
            Apex <span className="text-gradient">Creators.</span>
          </h2>
          <p className="text-zinc-500 font-bold italic max-w-lg mx-auto text-sm">Discover the most innovative digital identities. Experience the art of premium resonance.</p>
        </div>

        {/* Infinite Moving Carousel */}
        <div className="relative group">
          <div className="flex animate-marquee gap-8 w-max px-8">
            {[...SAMPLE_CREATORS, ...SAMPLE_CREATORS].map((creator, i) => (
              <Link
                key={i}
                to={`/creator/${creator.tag}`}
                className="relative flex-none w-[320px] md:w-[600px] aspect-[4/5] rounded-[3rem] overflow-hidden group border border-zinc-800 active:scale-95 transition-all duration-700 shadow-none"
              >
                {/* Image Container with Ken Burns */}
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={creator.coverUrl}
                    alt={creator.name}
                    className="absolute inset-0 w-full h-full object-cover grayscale-[0.8] group-hover:grayscale-0 transition-all duration-1000 animated-sensual scale-110"
                  />
                  {/* Cinematic Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-700"></div>
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 p-12 flex flex-col justify-end space-y-4">
                  <div className="translate-y-8 group-hover:translate-y-0 transition-all duration-1000 ease-out-back">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-[9px] font-black uppercase tracking-[0.4em] text-primary backdrop-blur-md mb-4 shadow-none">
                      {creator.persona}
                    </span>
                    <h3 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter leading-none mb-2">{creator.name}</h3>
                    <p className="text-zinc-500 font-bold italic tracking-wide text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-300">
                      Synchronize Resonance →
                    </p>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-10 right-10 w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center scale-0 group-hover:scale-100 transition-all duration-500 delay-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </div>
              </Link>
            ))}
          </div>

          <div className="absolute inset-y-0 left-0 w-64 bg-gradient-to-r from-black to-transparent pointer-events-none z-10"></div>
          <div className="absolute inset-y-0 right-0 w-64 bg-gradient-to-l from-black to-transparent pointer-events-none z-10"></div>
        </div>
      </section>

      {/* Stats/Feature Highlights */}
      <section className="w-full max-w-7xl px-6 py-40 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: "📈", title: "Global Discovery", text: "Built for SEO-first architecture. Your identity indexable by the world, not hidden behind walls." },
          { icon: "⚡", title: "Instant Resonance", text: "Global edge deployment. Content delivered in less than 50ms to any part of the sanctuary." },
          { icon: "🔒", title: "Sovereign Shield", text: "Proactive fraud protection. We guard your hard-earned fuel with advanced spend limits." }
        ].map((feat, i) => (
          <div key={i} className="bg-zinc-900/40 p-10 rounded-[3rem] border border-zinc-800 space-y-6 group hover:bg-zinc-800 transition-all duration-500">
            <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center text-3xl group-hover:bg-primary group-hover:scale-110 transition-all shadow-xl shadow-black/40">
              {feat.icon}
            </div>
            <h3 className="text-2xl font-black text-white italic italic uppercase tracking-tight">{feat.title}</h3>
            <p className="text-zinc-500 font-bold italic leading-relaxed text-sm">{feat.text}</p>
          </div>
        ))}
      </section>

      {/* How it Works */}
      <section className="w-full max-w-7xl px-6 py-40 space-y-32">
        <div className="text-center space-y-6">
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter italic text-white uppercase italic leading-none">The <span className="text-gradient">Process.</span></h2>
          <p className="text-zinc-500 font-bold italic max-w-xl mx-auto uppercase tracking-widest text-[10px]">Three stages to digital sovereignty.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-24 relative">
          {[
            { step: "01", title: "Forge Your Space", text: "Customize your sanctuary with premium tools. Manifest your vision exactly how you imagined it." },
            { step: "02", title: "Cast Your Vision", text: "Distribute your essence behind a seamless paywall. Our edge CDN handles the cosmic weight." },
            { step: "03", title: "Harvest Fuel", text: "Withdraw your earnings with the lowest fees. Scale your legacy across the open web." }
          ].map((item, i) => (
            <div key={i} className="space-y-8 relative group">
              <div className="text-[140px] font-black text-zinc-900/40 absolute -top-24 -left-8 select-none group-hover:text-primary/10 transition-colors duration-700">{item.step}</div>
              <div className="space-y-4 relative z-10 pt-12">
                <h4 className="text-2xl font-black text-white italic uppercase tracking-tight">{item.title}</h4>
                <p className="text-zinc-500 font-bold italic leading-relaxed text-sm">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Earnings Calculator */}
      <section className="w-full bg-zinc-900/20 py-40 relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <div className="space-y-10">
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] italic text-white uppercase italic">
              Stop <br />
              <span className="text-gradient">Wasting Power.</span>
            </h2>
            <p className="text-zinc-400 text-lg font-bold italic leading-relaxed max-w-lg">
              Legacy platforms siphon your resonance. We offer the highest share and the clearest path to global discovery.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="px-6 py-2 rounded-full bg-white text-black text-[9px] font-black uppercase tracking-[0.2em] shadow-none">
                Elite 90/10 Split
              </div>
              <div className="px-6 py-2 rounded-full border border-emerald-500/20 text-emerald-500 text-[9px] font-black uppercase tracking-[0.2em]">
                Instant Extraction Ready
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 p-12 rounded-[4rem] border border-zinc-800 space-y-12 relative overflow-hidden group/calc shadow-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px]"></div>
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">
                  <span>Hub Connections</span>
                  <span className="text-white">1,250</span>
                </div>
                <div className="h-1.5 bg-zinc-950 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[65%] shadow-none"></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">
                  <span>Resonance Fee</span>
                  <span className="text-white">₦15,000</span>
                </div>
                <div className="h-1.5 bg-zinc-950 rounded-full overflow-hidden">
                  <div className="h-full bg-white w-[40%] shadow-none"></div>
                </div>
              </div>
            </div>

            <div className="pt-12 border-t border-zinc-800 space-y-4">
              <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.5em] italic">Projected Extraction / month</p>
              <p className="text-5xl md:text-7xl font-black text-white italic tracking-tighter leading-none tabular-nums">₦16,875,000</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full max-w-5xl px-6 py-40 space-y-24">
        <div className="text-center space-y-6">
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter italic text-white uppercase italic leading-none">Whispers.</h2>
          <p className="text-zinc-500 font-bold italic uppercase tracking-widest text-[10px]">Essential protocols and calibrations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { q: "How is this different from generic hubs?", a: "Sovereignty. We build your profile as an indexable, searchable brand. While others cage your content, we ensure it's discovered by new fans on the open architecture." },
            { q: "What is the resonance share?", a: "We operate on a competitive split, covering global content delivery, shield protection, and discovery optimization." },
            { q: "Is fuel extraction instant?", a: "Initial top-ups have a calibration period to prevent anomalies. After 30 days, you move to our accelerated extraction schedule." },
            { q: "Do you support high-fidelity visions?", a: "Yes, our high-speed edge network supports 4K silk streaming and pay-per-view vision unlocks for elite fans." }
          ].map((item, i) => (
            <div key={i} className="bg-zinc-900/40 p-10 rounded-[3rem] border border-zinc-800 space-y-4 hover:border-zinc-700 transition-colors duration-500">
              <h4 className="text-xl font-black text-white italic uppercase tracking-tight">{item.q}</h4>
              <p className="text-zinc-500 font-bold italic leading-relaxed text-sm">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
