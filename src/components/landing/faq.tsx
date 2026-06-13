"use client";
import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    q: "What exams does PharmaPrep Uganda prepare me for?",
    a: "PharmaPrep covers both the Pre-Licensure Examination (PLE) and the Post-Internship Licensing Examination (PILE) administered by the Pharmacy Council of Uganda. All 12 tested subjects are fully covered.",
  },
  {
    q: "How is the content different from regular textbooks?",
    a: "Our notes are summarized, exam-focused, and written by practising pharmacists and pharmacy lecturers in Uganda. Every question has a full explanation tied to the exam syllabus — not just generic content.",
  },
  {
    q: "Can I use PharmaPrep without internet?",
    a: "Yes! Once you visit a note or question page, it's automatically cached on your device. A banner will notify you when you're reading offline content. This works on all modern smartphones and computers.",
  },
  {
    q: "How do I pay? Is it secure?",
    a: "We accept MTN Mobile Money, Airtel Money, and debit/credit cards via Flutterwave, Uganda's most trusted payment gateway. All transactions are encrypted and your money is safe.",
  },
  {
    q: "Can I share my account with classmates?",
    a: "Each account is for one person only. However, our pricing is deliberately affordable — the 6-month premium plan costs less than a single pharmacology textbook.",
  },
  {
    q: "What happens when my premium plan expires?",
    a: "Your account automatically reverts to the free plan. All your progress and bookmarks are saved. You can resubscribe anytime to regain premium access instantly.",
  },
  {
    q: "Are the mock exams like the real PSU exam?",
    a: "Our mock exams are 100 questions with a 3-hour timer, matching the format of the actual PSU licensing exam. The question difficulty and subject distribution mirrors the real exam.",
  },
];

export function LandingFAQ() {
  return (
    <section id="faq" className="py-24 bg-surface">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-sora text-4xl font-bold text-dark mb-4">Frequently asked questions</h2>
          <p className="text-muted text-lg">Everything you need to know about PharmaPrep Uganda</p>
        </motion.div>

        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <AccordionItem value={`item-${i}`} className="bg-background rounded-xl border border-border px-4">
                <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                <AccordionContent>{faq.a}</AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
