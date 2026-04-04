import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import AboutSection from "@/components/landing/AboutSection";
import ObjectivesSection from "@/components/landing/ObjectivesSection";
import PrinciplesSection from "@/components/landing/PrinciplesSection";
import MapPreviewSection from "@/components/landing/MapPreviewSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

export default function Landing() {
    return (
        <div className="min-h-screen bg-[#faf7f2] text-[#3d2e1e] overflow-x-hidden">
            <Navbar />
            <HeroSection />
            <AboutSection />
            <ObjectivesSection />
            <PrinciplesSection />
            <MapPreviewSection />
            <CTASection />
            <Footer />
        </div>
    );
}
