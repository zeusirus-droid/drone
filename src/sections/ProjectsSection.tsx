import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { FadeIn } from '../components/FadeIn';
import { LiveProjectButton } from '../components/LiveProjectButton';

interface Project {
  id: string;
  number: string;
  category: string;
  name: string;
  col1Image1: string;
  col1Image2: string;
  col2Image: string;
}

const projects: Project[] = [
  {
    id: "delta",
    number: "01",
    category: "Client",
    name: "Delta",
    col1Image1: "https://res.cloudinary.com/tcljt08i/image/upload/f_auto,q_auto/elevator_hgh1tw",
    col1Image2: "https://res.cloudinary.com/tcljt08i/image/upload/f_auto,q_auto/Street-Billboard-Mockup_01_il0k05",
    col2Image: "https://res.cloudinary.com/tcljt08i/image/upload/f_auto,q_auto/Street-Billboard-Mockup_02_xmhry3"
  },
  {
    id: "nedd-son",
    number: "02",
    category: "Client",
    name: "Nedd & Son",
    col1Image1: "https://res.cloudinary.com/tcljt08i/image/upload/f_auto,q_auto/Van_nwawey",
    col1Image2: "https://res.cloudinary.com/tcljt08i/image/upload/f_auto,q_auto/Pins_nrs0w1",
    col2Image: "https://res.cloudinary.com/tcljt08i/image/upload/f_auto,q_auto/folder_vmxi6u"
  },
  {
    id: "defres-solutions",
    number: "03",
    category: "Client",
    name: "Defre's Solutions",
    col1Image1: "https://res.cloudinary.com/tcljt08i/image/upload/f_auto,q_auto/Presentation_vunpjp",
    col1Image2: "https://res.cloudinary.com/tcljt08i/image/upload/f_auto,q_auto/Safety-Vest_wzwark",
    col2Image: "https://res.cloudinary.com/tcljt08i/image/upload/f_auto,q_auto/Scaffolding_j0dssm"
  }
];

export function ProjectsSection() {
  return (
    <section
      id="projects-section"
      className="bg-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 z-20 relative pt-20 pb-32 px-4 sm:px-8 md:px-10 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Heading */}
        <FadeIn delay={0} y={30} className="text-center mb-16 sm:mb-20 md:mb-24">
          <h2 className="hero-heading font-black uppercase text-center text-[clamp(3rem,12vw,160px)] tracking-tight">
            Projects
          </h2>
        </FadeIn>

        {/* Stacking cards container */}
        <div className="flex flex-col gap-10">
          {projects.map((project, index) => (
            <ProjectCardWrapper
              key={project.id}
              project={project}
              index={index}
              totalCards={projects.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface ProjectCardWrapperProps {
  project: Project;
  index: number;
  totalCards: number;
  key?: any;
}

function ProjectCardWrapper({ project, index, totalCards }: ProjectCardWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track the scroll of this specific card wrapper container
  // As it scrolls out, it will scale down to create a cards stacking illusion
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Scale down ratio: card index 0 scales down more than card index 1
  const targetScale = 1 - (totalCards - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  // Card sticky top offsets based on design rules
  const topMobile = 96 + index * 28;
  const topDesktop = 128 + index * 28;

  return (
    <div
      ref={containerRef}
      className="h-[85vh] sm:h-[90vh] flex flex-col justify-start sticky"
      style={{
        top: `clamp(${topMobile}px, 8vw, ${topDesktop}px)`
      }}
    >
      <motion.div
        style={{ scale }}
        className="w-full bg-[#0C0C0C] border-2 border-[#D7E2EA] rounded-[40px] sm:rounded-[50px] md:rounded-[60px] p-4 sm:p-6 md:p-8 flex flex-col justify-between h-[75vh] sm:h-[80vh] origin-top shadow-2xl relative overflow-hidden"
      >
        {/* Top row */}
        <div className="flex flex-row justify-between items-center w-full pb-3 sm:pb-4 border-b border-[#D7E2EA]/10">
          <div className="flex items-center gap-3 sm:gap-4 md:gap-6 text-left">
            {/* Number */}
            <div className="font-black text-[#D7E2EA] text-[clamp(2rem,6vw,80px)] leading-none select-none">
              {project.number}
            </div>
            
            {/* Project Details */}
            <div className="flex flex-col text-left">
              <span className="text-[10px] sm:text-xs text-[#D7E2EA]/50 uppercase tracking-[0.2em] font-light">
                {project.category}
              </span>
              <h3 className="font-bold uppercase text-[#D7E2EA] text-[clamp(1.1rem,3vw,2.2rem)] leading-none mt-1">
                {project.name}
              </h3>
            </div>
          </div>

          {/* Live Button */}
          <LiveProjectButton />
        </div>

        {/* Bottom row: Two-column image grid */}
        <div className="grid grid-cols-10 gap-3 sm:gap-4 md:gap-6 flex-grow mt-4 sm:mt-6 overflow-hidden">
          {/* Left column (40% width) with 2 stacked images */}
          <div className="col-span-4 flex flex-col gap-3 sm:gap-4 md:gap-6 h-full justify-between">
            <img
              src={project.col1Image1}
              alt={`${project.name} Details Image A`}
              className="w-full object-cover rounded-[20px] sm:rounded-[30px] md:rounded-[40px] lg:rounded-[50px]"
              style={{ height: "clamp(120px, 16vw, 230px)" }}
              referrerPolicy="no-referrer"
              loading="lazy"
            />
            <img
              src={project.col1Image2}
              alt={`${project.name} Details Image B`}
              className="w-full object-cover rounded-[20px] sm:rounded-[30px] md:rounded-[40px] lg:rounded-[50px] flex-grow"
              style={{ height: "clamp(150px, 22vw, 340px)" }}
              referrerPolicy="no-referrer"
              loading="lazy"
            />
          </div>

          {/* Right column (60% width) with 1 tall image */}
          <div className="col-span-6 h-full">
            <img
              src={project.col2Image}
              alt={`${project.name} Primary Showcase Image`}
              className="w-full h-full object-cover rounded-[20px] sm:rounded-[30px] md:rounded-[40px] lg:rounded-[50px]"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
