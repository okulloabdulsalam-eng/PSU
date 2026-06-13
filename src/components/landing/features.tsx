"use client";
import { motion } from "framer-motion";
import { BookOpen, HelpCircle, Video, TrendingUp, Shield, Smartphone } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Comprehensive Study Notes",
    description: "Rich, formatted notes covering all 12 pharmacy subjects written by experienced pharmacists and lecturers.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: HelpCircle,
    title: "3,600+ Exam Questions",
    description: "MCQs, True/False, and Fill-in-the-blank questions with detailed explanations. Filtered by topic, difficulty, and past exam year.",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: Video,
    title: "Video Lectures",
    description: "Clear, concise video explanations for every topic. Watch at your own pace without data-heavy embeds.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description: "Visual dashboards showing your performance per subject, study streaks, and weak areas that need attention.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: Shield,
    title: "Mock Exam Mode",
    description: "Simulate the real PSU exam with 100 questions, a 3-hour timer, and a detailed performance breakdown.",
    color: "bg-red-50 text-red-600",
  },
  {
    icon: Smartphone,
    title: "Works Offline",
    description: "Study on the go. Previously visited notes and questions are cached for offline access anywhere in Uganda.",
    color: "bg-teal-50 text-teal-600",
  },
];

export function LandingFeatures() {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-sora text-4xl font-bold text-dark mb-4">
            Everything you need to pass
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            PharmaPrep Uganda combines every study tool into one focused platform designed for Ugandan pharmacy licensing exams.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(0,0,0,0.10)" }}
              className="bg-surface rounded-2xl p-6 border border-border shadow-card cursor-default"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${feature.color}`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="font-sora text-lg font-semibold text-dark mb-2">{feature.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
