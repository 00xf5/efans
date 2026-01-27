import type { Route } from "./+types/home";
import { Link } from "react-router";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "eFans | Premium Content Subscriptions" },
    { name: "description", content: "The most discoverable platform for creators. Built for SEO, speed, and premium experiences." },
  ];
}

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Background Mesh Gradient */}
        <div className="absolute inset-0 z-0 opacity-40 dark:opacity-60">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-600/30 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px]"></div>
        </div>

        <div className="relative z-10 max-w-5xl text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wider uppercase">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Next Generation Platform
          </div>

          <h1 className="text-5xl md:text-8xl font-display font-black tracking-tight leading-[1.1] text-zinc-900 dark:text-white">
            Unleash Your <br />
            <span className="text-gradient">Digital Legacy.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
            The platform designed for maximum discoverability. Scale your audience with SEO-first architecture and a premium experience your fans deserve.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full text-lg font-bold transition-all shadow-xl shadow-violet-600/30 active:scale-95"
            >
              Start Creating Now
            </Link>
            <Link
              to="/creators"
              className="w-full sm:w-auto glass hover:bg-white/10 px-8 py-4 rounded-full text-lg font-bold transition-all active:scale-95 border border-zinc-200 dark:border-zinc-800"
            >
              Explore Creators
            </Link>
          </div>

          <div className="pt-12 flex flex-col items-center gap-4">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Trusted by leading creators</p>
            <div className="flex gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
              <span className="text-xl font-display font-black tracking-tighter">CREATOR.CO</span>
              <span className="text-xl font-display font-black tracking-tighter">DIGITAL.X</span>
              <span className="text-xl font-display font-black tracking-tighter">ELITE.FN</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Creators Section - Sensual/Animated */}
      <section className="w-full py-32 space-y-16 overflow-hidden bg-black text-white relative">
        {/* Subtle Ambient Light */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 blur-[150px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 space-y-4 relative z-10 text-center">
          <h2 className="text-5xl md:text-7xl font-display font-black tracking-tight leading-tight uppercase italic">
            Featured <span className="text-primary italic">Creators.</span>
          </h2>
          <p className="text-zinc-500 font-medium max-w-lg mx-auto">Discover the most innovative digital identities. Experience the art of premium creation.</p>
        </div>

        {/* Infinite Moving Carousel */}
        <div className="relative group">
          <div className="flex animate-marquee gap-8 w-max px-8">
            {[
              { name: "Valentina Noir", handle: "@v_noir", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200", tag: "Late Night Art" },
              { name: "Adrien Thorne", handle: "@adrien", img: "https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?auto=format&fit=crop&q=80&w=1200", tag: "Masculine Power" },
              { name: "Sienna Ray", handle: "@siennaray", img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=1200", tag: "Velvet Portraits" },
              { name: "Lucas Vance", handle: "@lvance", img: "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&q=80&w=1200", tag: "Urban Intimacy" },
              { name: "Elena Mour", handle: "@elenamour", img: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?auto=format&fit=crop&q=80&w=1200", tag: "Golden Hour" },
              // Duplicate for infinite scroll
              { name: "Valentina Noir", handle: "@v_noir", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200", tag: "Late Night Art" },
              { name: "Adrien Thorne", handle: "@adrien", img: "https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?auto=format&fit=crop&q=80&w=1200", tag: "Masculine Power" },
              { name: "Sienna Ray", handle: "@siennaray", img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=1200", tag: "Velvet Portraits" },
              { name: "Lucas Vance", handle: "@lvance", img: "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&q=80&w=1200", tag: "Urban Intimacy" },
              { name: "Elena Mour", handle: "@elenamour", img: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?auto=format&fit=crop&q=80&w=1200", tag: "Golden Hour" },
            ].map((creator, i) => (
              <Link
                key={i}
                to={`/creator/${creator.handle.replace('@', '')}`}
                className="relative flex-none w-[320px] md:w-[500px] aspect-[4/5] rounded-[3rem] overflow-hidden group shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5 active:scale-95 transition-transform"
              >
                {/* Image Container with Ken Burns */}
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={creator.img}
                    alt={creator.name}
                    className="absolute inset-0 w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-1000 animated-sensual"
                  />
                  {/* Subtle Vignette Overlay */}
                  <div className="absolute inset-0 vignette mix-blend-multiply opacity-60"></div>
                  {/* Soft Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-700"></div>
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 p-10 flex flex-col justify-end space-y-3">
                  <div className="translate-y-6 group-hover:translate-y-0 transition-transform duration-700 ease-out">
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-[10px] uppercase tracking-[0.3em] text-primary backdrop-blur-md mb-2">
                      {creator.tag}
                    </span>
                    <h3 className="text-3xl md:text-4xl font-display font-black text-white italic tracking-tighter leading-none">{creator.name}</h3>
                    <p className="text-zinc-400 font-medium tracking-wide text-sm pt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-200">
                      View Exclusive Content
                    </p>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-6 right-6 w-12 h-12 rounded-full glass border-white/10 flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform duration-500 delay-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </div>
              </Link>
            ))}
          </div>

          {/* Fade edges to imply continuity */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent pointer-events-none z-10"></div>
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent pointer-events-none z-10"></div>
        </div>
      </section>

      {/* Stats/Feature Highlights */}
      <section className="w-full max-w-7xl px-6 py-24 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-card p-8 rounded-2xl space-y-4 group hover:-translate-y-2 transition-transform duration-300">
          <div className="w-12 h-12 bg-violet-500/10 rounded-xl flex items-center justify-center text-primary text-2xl group-hover:bg-primary group-hover:text-white transition-colors">
            📈
          </div>
          <h3 className="text-xl font-display font-bold">10x SEO Reach</h3>
          <p className="text-zinc-500 dark:text-zinc-400">Unlike other platforms, we prioritize Google Search visibility to help you grow organically.</p>
        </div>

        <div className="glass-card p-8 rounded-2xl space-y-4 group hover:-translate-y-2 transition-transform duration-300">
          <div className="w-12 h-12 bg-violet-500/10 rounded-xl flex items-center justify-center text-primary text-2xl group-hover:bg-primary group-hover:text-white transition-colors">
            ⚡
          </div>
          <h3 className="text-xl font-display font-bold">Latency &lt; 50ms</h3>
          <p className="text-zinc-500 dark:text-zinc-400">Global edge deployment ensures your fans never wait for content to load.</p>
        </div>

        <div className="glass-card p-8 rounded-2xl space-y-4 group hover:-translate-y-2 transition-transform duration-300">
          <div className="w-12 h-12 bg-violet-500/10 rounded-xl flex items-center justify-center text-primary text-2xl group-hover:bg-primary group-hover:text-white transition-colors">
            🔒
          </div>
          <h3 className="text-xl font-display font-bold">Zero-Fraud Policy</h3>
          <p className="text-zinc-500 dark:text-zinc-400">Advanced spend velocity limits and device detection to protect your hard-earned revenue.</p>
        </div>
      </section>

      {/* How it Works */}
      <section className="w-full max-w-7xl px-6 py-32 space-y-24">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-6xl font-display font-black tracking-tight">How it <span className="text-gradient">Works.</span></h2>
          <p className="text-zinc-500 font-medium max-w-xl mx-auto">Three simple steps to start your digital empire.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="space-y-6 relative">
            <div className="text-8xl font-black text-primary/5 absolute -top-12 -left-4 select-none">01</div>
            <div className="space-y-2">
              <h4 className="text-2xl font-bold">Build Your Profile</h4>
              <p className="text-zinc-500 dark:text-zinc-400">Customize your space with premium design tools. Make it yours, exactly how you envisioned.</p>
            </div>
          </div>
          <div className="space-y-6 relative">
            <div className="text-8xl font-black text-primary/5 absolute -top-12 -left-4 select-none">02</div>
            <div className="space-y-2">
              <h4 className="text-2xl font-bold">Upload Content</h4>
              <p className="text-zinc-500 dark:text-zinc-400">Post photos, videos, or text behind a seamless paywall. Our edge CDN handles the heavy lifting.</p>
            </div>
          </div>
          <div className="space-y-6 relative">
            <div className="text-8xl font-black text-primary/5 absolute -top-12 -left-4 select-none">03</div>
            <div className="space-y-2">
              <h4 className="text-2xl font-bold">Earn & Scale</h4>
              <p className="text-zinc-500 dark:text-zinc-400">Withdraw your earnings with low fees. Use our SEO tools to attract fans from across the web.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Earnings Calculator */}
      <section className="w-full bg-zinc-950 dark:bg-zinc-900/50 py-32 text-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-6xl font-display font-black tracking-tight leading-tight">
              Stop Leaving <br />
              <span className="text-primary">Money on the Table.</span>
            </h2>
            <p className="text-zinc-400 text-lg font-medium leading-relaxed">
              Most platforms take 20% or more. We offer the lowest fees in the industry with the highest discoverability. Calculate your potential growth with our SEO-first architecture.
            </p>
            <div className="flex gap-4">
              <div className="p-1 rounded-full bg-primary/20 border border-primary/30 px-4 py-2 text-sm font-bold text-primary">
                Low 10% Platform Fee
              </div>
              <div className="p-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-4 py-2 text-sm font-bold text-emerald-500">
                Instant Payouts Ready
              </div>
            </div>
          </div>

          <div className="glass-card bg-white/5 border-white/10 p-10 rounded-3xl space-y-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-bold uppercase tracking-widest text-zinc-500">
                  <span>Subscribers</span>
                  <span className="text-white">1,250</span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[65%]"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-bold uppercase tracking-widest text-zinc-500">
                  <span>Monthly Price</span>
                  <span className="text-white">$14.99</span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[40%]"></div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10 space-y-1">
              <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">Estimated Monthly Revenue</p>
              <p className="text-5xl md:text-6xl font-display font-black text-emerald-400">$16,863.75</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full max-w-4xl px-6 py-32 space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-display font-black tracking-tight">FAQ.</h2>
          <p className="text-zinc-500 font-medium">Everything you need to know about the platform.</p>
        </div>

        <div className="space-y-4">
          {[
            { q: "How is this different from OnlyFans?", a: "SEO. We build your profile as an indexable, searchable brand. While others hide your content, we make sure it can be discovered by new fans on Google." },
            { q: "What are the platform fees?", a: "We charge a competitive 10% platform fee, which includes global content delivery, fraud protection, and SEO optimization." },
            { q: "Is payouts instant?", a: "Initial payouts have a short holding period to prevent fraud. After your first 30 days, you can move to our accelerated payout schedule." },
            { q: "Do you support video content?", a: "Yes, our high-speed edge network supports 4K video streaming and pay-per-view video unlocks for premium fans." }
          ].map((item, i) => (
            <div key={i} className="glass-card p-8 rounded-2xl space-y-3">
              <h4 className="text-xl font-bold">{item.q}</h4>
              <p className="text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-200 dark:border-zinc-800 py-16 px-6 bg-zinc-50 dark:bg-zinc-950/50">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
          <div className="col-span-2 space-y-6">
            <Link to="/" className="text-2xl font-display font-black tracking-tighter text-gradient">
              eFans
            </Link>
            <p className="text-zinc-500 font-medium max-w-xs">
              The premium destination for digital creators. Scale your legacy with SEO-first architecture.
            </p>
          </div>
          <div className="space-y-4">
            <h5 className="font-bold uppercase tracking-widest text-xs text-zinc-400">Platform</h5>
            <ul className="space-y-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">
              <li><Link to="/creators">Discover</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
              <li><Link to="/features">Features</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h5 className="font-bold uppercase tracking-widest text-xs text-zinc-400">Legal</h5>
            <ul className="space-y-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/compliance">Compliance</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-16 mt-16 border-t border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
          <p>© 2026 eFans. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-primary transition-colors">Twitter</a>
            <a href="#" className="hover:text-primary transition-colors">Instagram</a>
            <a href="#" className="hover:text-primary transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
