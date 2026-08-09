import { useEffect, useRef } from 'react';

const row1Images = [
  "https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif",
  "https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif",
  "https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif",
  "https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif",
  "https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif",
  "https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif",
  "https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif",
  "https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif",
  "https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif",
  "https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif"
];

const row2Images = [
  "https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif",
  "https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif",
  "https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif",
  "https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif",
  "https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif",
  "https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif",
  "https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif",
  "https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif",
  "https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif",
  "https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif"
];

const row1Tripled = [...row1Images, ...row1Images, ...row1Images];
const row2Tripled = [...row2Images, ...row2Images, ...row2Images];

export function MarqueeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        if (!sectionRef.current) return;
        const sectionTop = sectionRef.current.offsetTop;
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;

        // Calculate scroll offset based on user scrolled position
        const scrollOffset = (scrollY - sectionTop + windowHeight) * 0.3;

        if (row1Ref.current) {
          row1Ref.current.style.transform = `translate3d(${scrollOffset - 200}px, 0px, 0px)`;
        }
        if (row2Ref.current) {
          row2Ref.current.style.transform = `translate3d(${-(scrollOffset - 200)}px, 0px, 0px)`;
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      id="marquee-section"
      ref={sectionRef}
      className="bg-[#0C0C0C] w-full pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden flex flex-col gap-3 relative select-none"
    >
      {/* Row 1: Moves RIGHT on scroll */}
      <div
        ref={row1Ref}
        className="flex gap-3 w-max"
        style={{
          transform: `translate3d(-200px, 0px, 0px)`,
          willChange: 'transform',
        }}
      >
        {row1Tripled.map((url, i) => (
          <img
            key={`r1-${i}`}
            src={url}
            alt={`Creator Portfolio Item Row1-${i}`}
            className="w-[280px] sm:w-[360px] md:w-[420px] h-[180px] sm:h-[230px] md:h-[270px] flex-shrink-0 rounded-2xl object-cover pointer-events-none"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ))}
      </div>

      {/* Row 2: Moves LEFT on scroll */}
      <div
        ref={row2Ref}
        className="flex gap-3 w-max"
        style={{
          transform: `translate3d(200px, 0px, 0px)`,
          willChange: 'transform',
        }}
      >
        {row2Tripled.map((url, i) => (
          <img
            key={`r2-${i}`}
            src={url}
            alt={`Creator Portfolio Item Row2-${i}`}
            className="w-[280px] sm:w-[360px] md:w-[420px] h-[180px] sm:h-[230px] md:h-[270px] flex-shrink-0 rounded-2xl object-cover pointer-events-none"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ))}
      </div>
    </div>
  );
}

