import { HeroSection } from './sections/HeroSection';
import { MarqueeSection } from './sections/MarqueeSection';
import { AboutSection } from './sections/AboutSection';
import { ServicesSection } from './sections/ServicesSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { InstagramSection } from './sections/InstagramSection';
import { ContactSection } from './sections/ContactSection';
import { WhatsAppFloating } from './components/WhatsAppFloating';
import { CustomCursor } from './components/CustomCursor';

export default function App() {
  return (
    <main className="bg-[#0C0C0C] min-h-screen w-full relative overflow-x-clip font-sans antialiased selection:bg-[#bbed1c]/30 selection:text-white">
      {/* Custom Cursor */}
      <CustomCursor />

      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Marquee Section */}
      <MarqueeSection />

      {/* 3. About Section */}
      <AboutSection />

      {/* 4. Services Section */}
      <ServicesSection />

      {/* 5. Projects Section */}
      <ProjectsSection />

      {/* 6. Instagram Section */}
      <InstagramSection />

      {/* 7. Contact Form Section */}
      <ContactSection />

      {/* WhatsApp Floating Sticky Button */}
      <WhatsAppFloating />
    </main>
  );
}
