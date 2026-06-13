"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, X, Crown } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const freeFeatures = [
  { text: "Access to all 12 subjects", included: true },
  { text: "Free notes (1 per topic)", included: true },
  { text: "5 free questions per topic", included: true },
  { text: "Video lectures (all free)", included: true },
  { text: "Basic progress tracking", included: true },
  { text: "Premium notes", included: false },
  { text: "5 premium questions per topic", included: false },
  { text: "Mock exam mode", included: false },
  { text: "PDF note downloads", included: false },
  { text: "Weekly leaderboard", included: false },
];

const premiumFeatures = [
  { text: "Everything in Free", included: true },
  { text: "All premium notes", included: true },
  { text: "All 3,600+ questions", included: true },
  { text: "Mock exam (100Q / 3hrs)", included: true },
  { text: "PDF note downloads", included: true },
  { text: "Weekly leaderboard", included: true },
  { text: "Offline access", included: true },
  { text: "Priority support", included: true },
];

const pricingOptions = [
  { months: 1, price: 25000, label: "1 Month" },
  { months: 3, price: 65000, label: "3 Months", savings: "Save UGX 10,000" },
  { months: 6, price: 120000, label: "6 Months", savings: "Save UGX 30,000", popular: true },
  { months: 12, price: 220000, label: "12 Months", savings: "Save UGX 80,000" },
];

export function LandingPricing() {
  return (
    <section id="pricing" className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-sora text-4xl font-bold text-dark mb-4">Simple, transparent pricing</h2>
          <p className="text-muted text-lg">Pay in Uganda Shillings via MTN Mobile Money, Airtel Money, or card</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-background rounded-2xl p-8 border border-border"
          >
            <div className="mb-6">
              <h3 className="font-sora text-2xl font-bold text-dark">Free</h3>
              <div className="text-4xl font-sora font-bold text-dark mt-2">UGX 0</div>
              <p className="text-muted text-sm mt-1">No credit card needed</p>
            </div>
            <ul className="space-y-3 mb-8">
              {freeFeatures.map((f) => (
                <li key={f.text} className="flex items-center gap-3 text-sm">
                  {f.included ? <Check className="h-4 w-4 text-accent-green shrink-0" /> : <X className="h-4 w-4 text-muted shrink-0" />}
                  <span className={f.included ? "text-dark" : "text-muted"}>{f.text}</span>
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/register">Get Started Free</Link>
            </Button>
          </motion.div>

          {/* Premium Plan */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-8 text-white relative overflow-hidden"
          >
            <div className="absolute top-4 right-4 bg-accent-gold text-dark text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <Crown className="h-3 w-3" /> Most Popular
            </div>
            <div className="mb-6">
              <h3 className="font-sora text-2xl font-bold">Premium</h3>
              <div className="text-4xl font-sora font-bold mt-2">
                {formatCurrency(120000)} <span className="text-primary-200 text-lg font-normal">/ 6 months</span>
              </div>
              <p className="text-primary-200 text-sm mt-1">Best value for exam season</p>
            </div>
            <ul className="space-y-3 mb-8">
              {premiumFeatures.map((f) => (
                <li key={f.text} className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-accent-gold shrink-0" />
                  <span>{f.text}</span>
                </li>
              ))}
            </ul>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {pricingOptions.map((opt) => (
                <Link
                  key={opt.months}
                  href={`/register?plan=${opt.months}`}
                  className={`text-center p-2 rounded-xl border text-xs font-semibold transition-all ${opt.popular ? "bg-white text-primary-600 border-white" : "border-primary-400 text-white hover:bg-primary-400"}`}
                >
                  <div>{opt.label}</div>
                  <div className="font-bold">{formatCurrency(opt.price)}</div>
                  {opt.savings && <div className="text-accent-gold text-[10px]">{opt.savings}</div>}
                </Link>
              ))}
            </div>
            <Button variant="success" className="w-full bg-white text-primary-600 hover:bg-primary-50 font-bold" asChild>
              <Link href="/register">Upgrade to Premium</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
