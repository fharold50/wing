import Navbar from "@/components/nav/Navbar";
import Hero from "@/components/hero/Hero";
import InclusiveBanner from "@/components/sections/InclusiveBanner";
import StatsBar from "@/components/sections/StatsBar";
import Features from "@/components/sections/Features";
import HowItWorks from "@/components/sections/HowItWorks";
import Activities from "@/components/sections/Activities";
import Safety from "@/components/sections/Safety";
import Testimonials from "@/components/sections/Testimonials";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";
import FadeUpObserver from "@/components/ui/FadeUpObserver";

export default function Home() {
  return (
    <>
      <div className="orb orb1" />
      <div className="orb orb2" />
      <div className="orb orb3" />

      <Navbar />
      <Hero />
      <InclusiveBanner />
      <StatsBar />
      <Features />
      <HowItWorks />
      <Activities />
      <Safety />
      <Testimonials />
      <CTA />
      <Footer />

      <FadeUpObserver />
    </>
  );
}
