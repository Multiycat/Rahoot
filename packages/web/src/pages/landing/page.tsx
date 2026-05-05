import { motion } from "motion/react"
import { Link } from "react-router"

const metrics = [
  { label: "Active Rooms", value: "12.4k" },
  { label: "Avg Accuracy", value: "94%" },
  { label: "Latency", value: "< 100ms" },
]

const featureCards = [
  {
    title: "Asymmetric Design",
    text: "Our layout engine balances dense content into high-contrast editorial blocks.",
  },
  {
    title: "Dynamic Scoring",
    text: "Weighted scoring rewards speed, precision and consistency in live sessions.",
  },
]

const comparisonRows = [
  ["Design Language", "Modern & Editorial", "Gamified & Vibrant"],
  ["Participant Limit", "Unlimited (High Scale)", "Tier-Restricted"],
  ["Analytics Deep Dive", "AI-driven Insights", "Basic CSV Export"],
  ["Custom Branding", "White-label Experience", "Limited Templates"],
]

const pricing = [
  {
    name: "Essential",
    price: "$0",
    features: ["Up to 50 players", "Basic Editor", "Standard Reports"],
    cta: "Start Free",
    featured: false,
  },
  {
    name: "Professional",
    price: "$19",
    features: [
      "Up to 1,000 players",
      "Editorial Builder",
      "Video Backgrounds",
      "Custom Branding",
    ],
    cta: "Go Pro Now",
    featured: true,
  },
  {
    name: "Institutional",
    price: "$Custom",
    features: [
      "Unlimited Players",
      "SSO & Security",
      "Multi-user Admin",
      "LMS Integrations",
    ],
    cta: "Contact Sales",
    featured: false,
  },
]

const LandingPage = () => {
  return (
    <div className="relative overflow-hidden bg-[#131313] text-[#E5E2E1] [font-family:'Inter','Segoe_UI',sans-serif]">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_10%_8%,rgba(255,153,0,0.18),transparent_38%),radial-gradient(circle_at_78%_22%,rgba(255,192,130,0.08),transparent_30%),linear-gradient(180deg,#131313_0%,#111111_100%)]" />
      <div className="pointer-events-none fixed inset-0 opacity-[0.05] bg-[linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] bg-[size:32px_32px]" />

      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#6b635a26] bg-[#131313cc] backdrop-blur-[20px]">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <p className="font-['Epilogue','Inter',sans-serif] text-lg font-black tracking-tight text-[#FF9900]">
            Rahoot
          </p>
          <nav className="hidden items-center gap-7 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b8b2ad] md:flex">
            <a href="#product" className="text-[#FF9900] underline underline-offset-8">
              Product
            </a>
            <a href="#features" className="transition hover:text-[#FF9900]">
              Features
            </a>
            <a href="#pricing" className="transition hover:text-[#FF9900]">
              Pricing
            </a>
            <a href="#footer" className="transition hover:text-[#FF9900]">
              Contact
            </a>
          </nav>
          <Link
            to="/play"
            className="rounded-lg bg-[#FF9900] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#412300] transition hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1),0_0_18px_rgba(255,153,0,0.25)]"
          >
            Join Game
          </Link>
        </div>
      </header>

      <main className="relative z-10 pt-20">
        <section id="product" className="mx-auto w-full max-w-6xl px-6 pb-32 pt-20 md:pt-28">
          <div className="grid items-center gap-14 md:grid-cols-[1.1fr_0.9fr]">
            <div>
              <motion.span
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex rounded-full bg-[#212120] px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C8C2BD]"
              >
                The future of analytics
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.45 }}
                className="mt-6 max-w-xl font-['Epilogue','Inter',sans-serif] text-5xl font-black leading-[0.9] tracking-tight md:text-[5rem]"
              >
                Redefining
                <span className="block text-[#FF9900]">Engagement</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16, duration: 0.45 }}
                className="mt-7 max-w-md text-sm leading-relaxed text-[#C9C3BE]"
              >
                A digital atelier for educators and presenters. Craft immersive
                learning experiences with editorial precision and nocturnal
                elegance.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.5 }}
              className="mx-auto w-full max-w-sm rounded-2xl bg-[#35353499] p-6 backdrop-blur-[20px]"
            >
              <p className="mb-5 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D7D3D0]">
                Ready to play?
              </p>
              <div className="rounded-xl bg-[#0E0E0E] p-4">
                <div className="rounded-md border border-[#6b635a26] bg-[#141414] px-4 py-3 text-center font-['Epilogue','Inter',sans-serif] text-xl font-black tracking-[0.35em] text-[#FFB65E]">
                  GAME PIN
                </div>
                <Link
                  to="/play"
                  className="mt-4 block rounded-md bg-[radial-gradient(circle_at_12%_0%,#FFC082_0%,#FF9900_62%)] px-4 py-3 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-[#452500] transition hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]"
                >
                  Enter Universe
                </Link>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {metrics.map((metric) => (
                  <div key={metric.label} className="rounded-lg bg-[#1d1d1d] px-2 py-3">
                    <p className="font-['Epilogue','Inter',sans-serif] text-sm font-extrabold text-[#FF9900]">
                      {metric.value}
                    </p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.08em] text-[#B7B1AC]">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section id="features" className="bg-[#1B1B1A] py-28">
          <div className="mx-auto grid w-full max-w-6xl gap-4 px-6 md:grid-cols-12">
            <article className="group relative overflow-hidden rounded-2xl bg-[#262625] p-8 md:col-span-8 md:min-h-[340px]">
              <img
                src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80"
                alt="Editorial visual"
                className="absolute inset-0 h-full w-full object-cover opacity-35 transition duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(14,14,14,0.9)_0%,rgba(14,14,14,0.3)_100%)]" />
              <div className="relative max-w-sm">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#FFB65E]">
                  Visual fidelity
                </p>
                <h2 className="mt-4 font-['Epilogue','Inter',sans-serif] text-4xl font-black leading-tight text-[#F0ECE9]">
                  Editorial Quality Visuals
                </h2>
                <p className="mt-3 text-sm text-[#D1CBC7]">
                  Break free from cartoons. Build premium sessions that feel
                  crafted, not templated.
                </p>
              </div>
            </article>

            <article className="rounded-2xl bg-[#2d2d2c] p-8 md:col-span-4 md:min-h-[340px]">
              <p className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#1a1a19] text-[#FF9900]">
                ⚡
              </p>
              <h3 className="mt-7 font-['Epilogue','Inter',sans-serif] text-2xl font-black">
                Latency Zero
              </h3>
              <p className="mt-3 text-sm text-[#CDC7C2]">
                Real-time interaction with sub-millisecond sync for massive live
                participation.
              </p>
            </article>

            {featureCards.map((item, index) => (
              <article
                key={item.title}
                className={`rounded-2xl p-7 ${
                  index === 0
                    ? "bg-[#151515] md:col-span-4"
                    : "bg-[#151515] md:col-span-8"
                }`}
              >
                <h3 className="font-['Epilogue','Inter',sans-serif] text-2xl font-black text-[#F3EFEC]">
                  {item.title}
                </h3>
                <p className="mt-3 max-w-lg text-sm text-[#C7C1BC]">{item.text}</p>
                {index === 0 && (
                  <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#B4AEA8]">
                    Learn More
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="bg-[#0E0E0E] py-32">
          <div className="mx-auto w-full max-w-6xl px-6">
            <div className="grid items-center gap-16 md:grid-cols-2">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#FFB65E]">
                  Curation
                </p>
                <h2 className="mt-4 max-w-sm font-['Epilogue','Inter',sans-serif] text-5xl font-black leading-tight">
                  The Art of the Question.
                </h2>
                <p className="mt-5 max-w-md text-sm leading-relaxed text-[#CEC8C4]">
                  Rahoot&apos;s question builder is not a form. It is a canvas,
                  with rich media support and compact editorial controls.
                </p>
                <ul className="mt-6 space-y-2 text-sm text-[#E0DBD8]">
                  <li>● Native LaTeX support for math</li>
                  <li>● Embedded WebGL components</li>
                </ul>
              </div>
              <div className="overflow-hidden rounded-2xl bg-[#262625]">
                <img
                  src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80"
                  alt="Circuit board"
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            <div className="mt-28 grid items-center gap-16 md:grid-cols-2">
              <div className="order-2 overflow-hidden rounded-2xl bg-[#262625] md:order-1">
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
                  alt="Analytics dashboard"
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="order-1 md:order-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#FFB65E]">
                  Intelligence
                </p>
                <h2 className="mt-4 max-w-sm font-['Epilogue','Inter',sans-serif] text-5xl font-black leading-tight">
                  Insight, not just data.
                </h2>
                <p className="mt-5 max-w-md text-sm leading-relaxed text-[#CEC8C4]">
                  Post-game reports identify knowledge gaps and highlight where
                  intervention has the highest impact.
                </p>
                <div className="mt-7 rounded-xl bg-[#181818] p-4">
                  <div className="mb-2 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.16em] text-[#C5BFBA]">
                    <span>Retention Index</span>
                    <span className="text-[#FF9900]">94%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#2c2c2b]">
                    <div className="h-full w-[94%] rounded-full bg-[radial-gradient(circle_at_10%_50%,#FFC082_0%,#FF9900_55%)]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#131313] py-32">
          <div className="mx-auto w-full max-w-5xl px-6">
            <div className="text-center">
              <h2 className="font-['Epilogue','Inter',sans-serif] text-4xl font-black">
                A Professional Choice.
              </h2>
              <p className="mt-2 text-sm text-[#BDB8B4]">
                The distinction is clear in every pixel.
              </p>
            </div>

            <div className="mt-10 overflow-hidden rounded-xl bg-[#1e1e1d]">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-[#353534] text-[10px] uppercase tracking-[0.16em] text-[#c8c3bf]">
                    <th className="px-6 py-4 font-semibold">Capability</th>
                    <th className="px-6 py-4 font-semibold text-[#FF9900]">Rahoot</th>
                    <th className="px-6 py-4 font-semibold">Legacy Tools</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-[#ddd8d4]">
                  {comparisonRows.map((row) => (
                    <tr key={row[0]}>
                      <td className="px-6 py-4">{row[0]}</td>
                      <td className="px-6 py-4">{row[1]}</td>
                      <td className="px-6 py-4 text-[#bab4af]">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section id="pricing" className="bg-[#10100f] py-32">
          <div className="mx-auto w-full max-w-6xl px-6">
            <div className="text-center">
              <h2 className="font-['Epilogue','Inter',sans-serif] text-5xl font-black">
                Transparent Tiers.
              </h2>
              <p className="mt-2 text-sm text-[#bcb7b3]">
                Scale your influence with precision.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {pricing.map((tier) => (
                <article
                  key={tier.name}
                  className={`rounded-xl p-7 ${
                    tier.featured ? "bg-[#26221d] outline outline-1 outline-[#FF9900]" : "bg-[#1a1a19]"
                  }`}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#c8c2be]">
                    {tier.name}
                  </p>
                  <p className="mt-4 font-['Epilogue','Inter',sans-serif] text-5xl font-black text-[#F1ECE8]">
                    {tier.price}
                  </p>
                  <ul className="mt-5 space-y-2 text-sm text-[#c8c2be]">
                    {tier.features.map((feature) => (
                      <li key={feature}>• {feature}</li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className={`mt-8 w-full rounded-md px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] ${
                      tier.featured
                        ? "bg-[radial-gradient(circle_at_10%_20%,#FFC082_0%,#FF9900_60%)] text-[#3c2000]"
                        : "bg-[#131313] text-[#e5e2e1] outline outline-1 outline-[#6b635a26]"
                    }`}
                  >
                    {tier.cta}
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[radial-gradient(circle_at_50%_50%,rgba(255,153,0,0.14)_0%,#121212_56%)] py-32">
          <div className="mx-auto w-full max-w-6xl px-6 text-center">
            <h2 className="font-['Epilogue','Inter',sans-serif] text-6xl font-black leading-[0.92] md:text-7xl">
              Elevate your
              <br />
              Masterclass.
            </h2>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/manager"
                className="rounded-full bg-[radial-gradient(circle_at_10%_20%,#FFC082_0%,#FF9900_60%)] px-8 py-4 text-[10px] font-bold uppercase tracking-[0.16em] text-[#3e2000]"
              >
                Create Your Account
              </Link>
              <button
                type="button"
                className="rounded-full bg-[#1e1d1c] px-8 py-4 text-[10px] font-bold uppercase tracking-[0.16em] text-[#E5E2E1] outline outline-1 outline-[#6b635a26]"
              >
                Schedule Demo
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer id="footer" className="relative z-10 bg-[#0f0f0f] py-16">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <p className="font-['Epilogue','Inter',sans-serif] text-2xl font-black text-[#FF9900]">
              Rahoot
            </p>
            <p className="mt-3 max-w-xs text-xs leading-relaxed text-[#a9a4a0]">
              The high-end digital atelier for professional engagement and
              editorial-grade learning.
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#CFCAC6]">
              Resources
            </p>
            <ul className="mt-3 space-y-2 text-xs text-[#A9A4A0]">
              <li>Documentation</li>
              <li>Help Center</li>
              <li>Community</li>
            </ul>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#CFCAC6]">
              Legal
            </p>
            <ul className="mt-3 space-y-2 text-xs text-[#A9A4A0]">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Security</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
