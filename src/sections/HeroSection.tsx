import { ContactButton } from '../components/ContactButton';
import { Magnet } from '../components/Magnet';
import { FadeIn } from '../components/FadeIn';

export function HeroSection() {
  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative h-[55vh] sm:h-screen w-full flex flex-col justify-between overflow-x-clip bg-[#0C0C0C] select-none"
    >
      {/* NAVBAR: px-6 md:px-10 pt-6 md:pt-8 */}
      <FadeIn
        delay={0}
        y={-20}
        as="nav"
        className="w-full flex justify-between items-center px-6 md:px-10 pt-6 md:pt-8 z-30 relative"
      >
        <button
          onClick={() => handleScrollTo('about-section')}
          className="text-sm md:text-lg lg:text-[1.4rem] text-[#D7E2EA] font-medium uppercase tracking-wider cursor-pointer hover:opacity-70 transition-all duration-200 bg-transparent border-none outline-none"
        >
          About
        </button>
        <button
          onClick={() => handleScrollTo('projects-section')}
          className="text-sm md:text-lg lg:text-[1.4rem] text-[#D7E2EA] font-medium uppercase tracking-wider cursor-pointer hover:opacity-70 transition-all duration-200 bg-transparent border-none outline-none"
        >
          Projects
        </button>
        <button
          onClick={() => handleScrollTo('contact-section')}
          className="text-sm md:text-lg lg:text-[1.4rem] text-[#D7E2EA] font-medium uppercase tracking-wider cursor-pointer hover:opacity-70 transition-all duration-200 bg-transparent border-none outline-none"
        >
          Contact
        </button>
      </FadeIn>

      {/* HERO PORTRAIT: Centered absolutely */}
      <div className="absolute left-1/2 -translate-x-1/2 z-10 w-[280px] sm:w-[720px] md:w-[880px] lg:w-[1040px] top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-0 pointer-events-auto">
        <FadeIn delay={0.6} y={30}>
          <Magnet
            padding={150}
            strength={3}
            activeTransition="transform 0.3s ease-out"
            inactiveTransition="transform 0.6s ease-in-out"
          >
            <img
              src="https://res.cloudinary.com/tcljt08i/image/upload/f_auto,q_auto/green-b_wu1gkz"
              alt="Belmar 3D Creator Portrait"
              className="w-full h-auto object-contain pointer-events-none"
              referrerPolicy="no-referrer"
              decoding="async"
              fetchPriority="high"
            />
          </Magnet>
        </FadeIn>
      </div>

      {/* HERO HEADING (Centered vertically in screen flow) */}
      <div className="flex-grow flex items-center justify-center relative z-0 md:mt-6 overflow-hidden">
        <FadeIn delay={0.15} y={40} className="w-full overflow-hidden text-center px-4">
          <div className="inline-flex flex-col items-stretch max-w-full mt-6 sm:mt-4 md:-mt-5">
            <h1 className="hero-heading font-black uppercase tracking-[-0.04em] leading-none whitespace-nowrap text-[22vw] sm:text-[23vw] md:text-[24vw] lg:text-[24vw] select-none">
              Belmar
            </h1>
          </div>
        </FadeIn>
      </div>

      {/* BOTTOM BAR: Flexbox justify-between items-end with pb-7 sm:pb-8 md:pb-10 */}
      <div className="w-full flex justify-between items-end px-6 md:px-10 pb-7 sm:pb-8 md:pb-10 z-20 relative">
        <FadeIn delay={0.35} y={20} className="max-w-[160px] sm:max-w-[220px] md:max-w-[260px] text-left">
          <p className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug text-[clamp(0.75rem,1.4vw,1.5rem)]">
            Belmar, an independent marketing agency
          </p>
        </FadeIn>
        
        <FadeIn delay={0.5} y={20}>
          <ContactButton onClick={() => handleScrollTo('contact-section')} />
        </FadeIn>
      </div>
    </section>
  );
}
