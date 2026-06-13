import { LandingHero } from "@/components/landing/hero";
import { LandingStats } from "@/components/landing/stats";
import { LandingFeatures } from "@/components/landing/features";
import { LandingPricing } from "@/components/landing/pricing";
import { LandingTestimonials } from "@/components/landing/testimonials";
import { LandingFAQ } from "@/components/landing/faq";
import { LandingFooter } from "@/components/landing/footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
      <LandingHero />
      <LandingStats />
      <LandingFeatures />
      <LandingPricing />
      <LandingTestimonials />
      <LandingFAQ />
      <LandingFooter />
    </div>
  );
}
