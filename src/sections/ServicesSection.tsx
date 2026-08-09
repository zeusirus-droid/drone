import { FadeIn } from '../components/FadeIn';

interface ServiceItem {
  number: string;
  name: string;
  description: string;
}

const services: ServiceItem[] = [
  {
    number: "01",
    name: "Social Media Management",
    description: "Let us manage your online presence so you can focus on what you're actually good at."
  },
  {
    number: "02",
    name: "Signage",
    description: "High-quality signs that gets your point across."
  },
  {
    number: "03",
    name: "Motion Design",
    description: "Dynamic animations and motion graphics that add energy and storytelling to brands, products, and digital experiences."
  },
  {
    number: "04",
    name: "Branding",
    description: "Crafting cohesive visual identities -- from logos to full brand systems -- that communicate a clear and memorable presence."
  },
  {
    number: "05",
    name: "Web Development",
    description: "Designing and developing clean, modern, and conversion-focused websites with attention to layout, typography, and seamless user experience."
  },
  {
    number: "06",
    name: "Brand Activation",
    description: "Real-time brand activations and promotional executions at associated locations, including sampling, sales pushes, giveaways, and raising brand awareness."
  },
  {
    number: "07",
    name: "Photography/Videography",
    description: "Professional photography and videography for live events, product shoots, commercials, and digital content creation."
  }
];

export function ServicesSection() {
  return (
    <section
      id="services-section"
      className="bg-[#FFFFFF] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 select-none relative z-10"
    >
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <FadeIn delay={0} y={30} className="text-center">
          <h2 className="text-[#0C0C0C] font-black uppercase text-center text-[clamp(3rem,12vw,160px)] mb-16 sm:mb-20 md:mb-28 tracking-tight">
            Services
          </h2>
        </FadeIn>

        {/* Services List */}
        <div className="flex flex-col border-t border-[rgba(12,12,12,0.15)]">
          {services.map((service, i) => (
            <FadeIn
              key={service.number}
              delay={i * 0.1}
              y={30}
              className="border-b border-[rgba(12,12,12,0.15)] py-8 sm:py-10 md:py-12 flex flex-row items-center gap-6 sm:gap-10 md:gap-16 text-left"
            >
              {/* Number (Left) */}
              <div className="font-black text-[#0C0C0C] text-[clamp(2.5rem,8vw,120px)] leading-none select-none min-w-[70px] sm:min-w-[120px] md:min-w-[150px]">
                {service.number}
              </div>

              {/* Title & Description Stack (Right) */}
              <div className="flex flex-col justify-center flex-grow">
                <h3 className="font-medium uppercase text-[#0C0C0C] text-[clamp(1rem,2.2vw,2.1rem)] mb-2 tracking-wide leading-tight">
                  {service.name}
                </h3>
                <p className="font-light text-[#0C0C0C] opacity-60 leading-relaxed max-w-2xl text-[clamp(0.85rem,1.6vw,1.25rem)]">
                  {service.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
