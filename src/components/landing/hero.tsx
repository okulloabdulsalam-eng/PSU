"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown, Sparkles } from "lucide-react";

export function LandingHero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-primary-50 via-background to-background">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-green/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-primary-50 text-primary-600 px-4 py-2 rounded-full text-sm font-semibold mb-8 border border-primary-100"
          >
            <Sparkles className="h-4 w-4" />
            Uganda's #1 Pharmacy Exam Prep Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-sora text-6xl sm:text-7xl lg:text-8xl font-bold text-dark mb-6 leading-none tracking-tight"
          >
            PSU.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl sm:text-2xl text-muted max-w-2xl mx-auto mb-4 leading-relaxed font-sans"
          >
            Prepare smarter for your <strong className="text-dark">Pre-licensure & Post-Internship</strong> pharmacy licensing examinations.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-base text-muted max-w-xl mx-auto mb-10 font-sans"
          >
            Comprehensive notes, exam-style questions, video lectures, and real-time progress tracking — built for Ugandan BPharm graduates.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button size="lg" asChild className="w-full sm:w-auto shadow-lg">
              <Link href="/register">
                Start Studying Free <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
              <a href="#features">
                Explore Features <ChevronDown className="h-5 w-5" />
              </a>
            </Button>
          </motion.div>

          {/* Uganda flag colors bar */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex mt-16 mx-auto max-w-xs h-1 rounded-full overflow-hidden"
          >
            <div className="flex-1 bg-dark" />
            <div className="flex-1 bg-accent-gold" />
            <div className="flex-1 bg-red-600" />
            <div className="flex-1 bg-dark" />
            <div className="flex-1 bg-accent-gold" />
            <div className="flex-1 bg-red-600" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
