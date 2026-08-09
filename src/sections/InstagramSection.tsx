import { motion } from 'motion/react';
import { Instagram, ArrowUpRight } from 'lucide-react';
import { FadeIn } from '../components/FadeIn';

const instagramPosts = [
  {
    imageUrl: "https://res.cloudinary.com/tcljt08i/image/upload/f_auto,q_auto/WORK-SPLIT_01_nax2gl",
    postUrl: "https://www.instagram.com/belmarmarketing/p/DZZXevCx8_z/",
    likes: "2,045",
    comments: "92",
  },
  {
    imageUrl: "https://res.cloudinary.com/tcljt08i/image/upload/f_auto,q_auto/WORK-SPLIT_02_buksmo",
    postUrl: "https://www.instagram.com/belmarmarketing/p/DX4XCruEfY3/",
    likes: "1,824",
    comments: "58",
  },
  {
    imageUrl: "https://res.cloudinary.com/tcljt08i/image/upload/f_auto,q_auto/B5657952-2FB6-49F8-AFDF-B82192489723_yvcaib",
    postUrl: "https://www.instagram.com/belmarmarketing/p/DX42hWVEaxj/",
    likes: "1,640",
    comments: "41",
  },
  {
    imageUrl: "https://res.cloudinary.com/tcljt08i/image/upload/f_auto,q_auto/BELMAT-TEMP-3-cut_01_02_psloxi",
    postUrl: "https://www.instagram.com/belmarmarketing/p/DX6TJvBEXQ9/",
    likes: "1,110",
    comments: "53",
  }
];

export function InstagramSection() {
  return (
    <section
      id="instagram-section"
      className="bg-[#0C0C0C] py-20 px-5 sm:px-8 md:px-10 border-t border-[#D7E2EA]/10 select-none relative z-10 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header containing the instagram link */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <FadeIn delay={0} y={15}>
              <span className="text-xs sm:text-sm text-[#bbed1c] font-semibold uppercase tracking-[0.25em]">
                Social Showcase
              </span>
            </FadeIn>
            <FadeIn delay={0.1} y={20}>
              <h2 className="text-[2.5rem] sm:text-[3.5rem] md:text-[4rem] font-black uppercase tracking-tight text-[#D7E2EA] mt-1 leading-none">
                On Instagram
              </h2>
            </FadeIn>
          </div>

          <FadeIn delay={0.2} y={15} className="w-full md:w-auto">
            <a
              href="https://instagram.com/belmarmarketing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#D7E2EA]/5 hover:bg-[#bbed1c] hover:text-[#0C0C0C] text-[#D7E2EA] px-6 py-4 rounded-2xl border border-[#D7E2EA]/15 transition-all duration-300 group font-medium uppercase tracking-wider text-sm sm:text-base w-full sm:w-auto justify-center"
            >
              <Instagram className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              <span>@belmarmarketing</span>
              <ArrowUpRight className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          </FadeIn>
        </div>

        {/* 3D Visual Posts Grid - Adjusted to grid-cols-2 md:grid-cols-4 for perfect 4-grid alignment */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {instagramPosts.map((post, i) => (
            <FadeIn
              key={i}
              delay={i * 0.08}
              y={30}
              className="group relative aspect-square overflow-hidden rounded-3xl border border-[#D7E2EA]/10 bg-[#161616]"
            >
              <a
                href={post.postUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full h-full relative"
              >
                {/* Post Image */}
                <img
                  src={post.imageUrl}
                  alt={`Instagram project showcase ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-1 filter brightness-[0.95]"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />

                {/* Dark Overlay with Likes/Comments Hover details */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6 text-[#D7E2EA]">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 fill-current text-[#bbed1c]"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    <span className="font-semibold text-sm sm:text-base">{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 fill-current text-[#bbed1c]"
                      viewBox="0 0 24 24"
                    >
                      <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                    </svg>
                    <span className="font-semibold text-sm sm:text-base">{post.comments}</span>
                  </div>
                </div>
              </a>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
