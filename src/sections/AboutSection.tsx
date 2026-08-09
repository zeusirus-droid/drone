import { FadeIn } from '../components/FadeIn';
import { AnimatedText } from '../components/AnimatedText';
import { ContactButton } from '../components/ContactButton';

export function AboutSection() {
  return (
    <section
      id="about-section"
      className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#0C0C0C] px-5 sm:px-8 md:px-10 py-20 select-none overflow-hidden"
    >
      {/* Decorative 3D Images placed absolutely in corners */}
      
      {/* Bottom-Left 3D Object (Smiley Face) */}
      <div className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] z-0 pointer-events-none">
        <FadeIn delay={0.25} x={-80} y={0} duration={0.9}>
          <img
            src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png"
            alt="Decorative Abstract 3D Object"
            className="w-[100px] sm:w-[140px] md:w-[180px] h-auto object-contain"
            style={{ filter: 'hue-rotate(140deg) saturate(1.5) brightness(1.1)' }}
            referrerPolicy="no-referrer"
          />
        </FadeIn>
      </div>

      {/* Central Content Stack */}
      <div className="relative z-10 flex flex-col items-center justify-center max-w-4xl text-center">
        {/* About heading */}
        <FadeIn delay={0} y={40}>
          <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-center text-[clamp(3rem,12vw,160px)]">
            About us
          </h2>
        </FadeIn>

        {/* Gap between heading and text: gap-10 sm:gap-14 md:gap-16 */}
        <div className="h-10 sm:h-14 md:h-16" />

        {/* Animated paragraphs */}
        <div className="flex flex-col items-center gap-6 max-w-[580px]">
          <AnimatedText
            text="Belmar has been in the industry for over 10 years; our key focus is on branding and marketing. We appreciate working with businesses that aim to stand out and present their best image and also those who understands the importance of their brand's identity. Let's build something incredible today!"
            className="text-[#D7E2EA] font-light leading-relaxed text-center text-[clamp(1rem,2vw,1.25rem)]"
          />
          <AnimatedText
            text="Belmar, BIGGER, better."
            className="text-[#bbed1c] font-bold tracking-wide uppercase text-center text-[clamp(1.1rem,2.5vw,1.5rem)] mt-2"
          />
        </div>

        {/* Gap between text block and button: gap-16 sm:gap-20 md:gap-24 */}
        <div className="h-14 sm:h-18 md:h-20" />

        {/* Contact Button */}
        <FadeIn delay={0.4} y={30}>
          <ContactButton onClick={() => {
            const el = document.getElementById('contact-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }} />
        </FadeIn>
      </div>
    </section>
  );
}
