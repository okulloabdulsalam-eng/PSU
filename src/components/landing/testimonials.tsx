"use client";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Aisha Nakato",
    title: "BPharm Graduate, Makerere University",
    avatar: "AN",
    color: "bg-blue-100 text-blue-700",
    quote: "PharmaPrep helped me pass my pre-licensure exam on the first attempt! The mock exam mode was exactly like the real thing. The notes are so well organized — I could study from my phone during lunch breaks.",
    stars: 5,
  },
  {
    name: "David Ssemwogerere",
    title: "Pharmacist, Mulago Hospital",
    avatar: "DS",
    color: "bg-green-100 text-green-700",
    quote: "After internship I was nervous about the post-internship exam. Three weeks of using PharmaPrep's question bank and I felt completely ready. The subject breakdown chart showed me exactly where to focus.",
    stars: 5,
  },
  {
    name: "Patience Atuhaire",
    title: "BPharm Student, Mbarara University",
    avatar: "PA",
    color: "bg-purple-100 text-purple-700",
    quote: "The offline mode is a game-changer in Uganda. I can study even without internet. The 6-month premium plan is so affordable compared to physical textbooks. Highly recommend to every pharmacy student!",
    stars: 5,
  },
];

export function LandingTestimonials() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-sora text-4xl font-bold text-dark mb-4">Trusted by pharmacy students</h2>
          <p className="text-muted text-lg">See what students across Uganda are saying</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-surface rounded-2xl p-6 border border-border shadow-card"
            >
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-accent-gold text-accent-gold" />
                ))}
              </div>
              <p className="text-dark text-sm leading-relaxed mb-6 font-serif italic">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${t.color}`}>
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-dark text-sm">{t.name}</div>
                  <div className="text-muted text-xs">{t.title}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
