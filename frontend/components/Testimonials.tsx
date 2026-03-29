import AnimatedSection, { StaggeredChildren } from "@/components/AnimatedSection";

// ─── Data ──────────────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    quote:
      "Honestly didn't expect this level of finish at this price. The sofa looks straight out of a luxury showroom.",
    name: "Rahul Mehta",
    city: "Mumbai",
  },
  {
    quote:
      "Perfect balance of design and comfort. Guests always ask where we got our furniture from.",
    name: "Sneha Kapoor",
    city: "Delhi",
  },
  {
    quote:
      "Customisation options were a big plus. Got exactly what I wanted without paying designer prices.",
    name: "Arjun Shah",
    city: "Ahmedabad",
  },
  {
    quote:
      "Delivery and fitting were smooth, and the quality genuinely feels premium.",
    name: "Priya Nair",
    city: "Bangalore",
  },
  {
    quote:
      "Looks expensive, feels premium, but priced very reasonably. Exactly what we were looking for.",
    name: "Karan Malhotra",
    city: "Pune",
  },
];

// ─── Icons ─────────────────────────────────────────────────────────────────────

function StarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="#C9A96E" stroke="none">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function QuoteIcon() {
  return (
    <svg
      width="36"
      height="28"
      viewBox="0 0 36 28"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M0 28V16.8C0 7.47 5.6 1.87 16.8 0L18.67 3.73C13.07 4.85 10.08 8.21 9.71 13.81H16.8V28H0ZM19.2 28V16.8C19.2 7.47 24.8 1.87 36 0L37.87 3.73C32.27 4.85 29.28 8.21 28.91 13.81H36V28H19.2Z"
        fill="#C9A96E"
        fillOpacity="0.12"
      />
    </svg>
  );
}

// ─── Testimonials Section ──────────────────────────────────────────────────────

export default function Testimonials() {
  return (
    <section
      className="section-pad bg-[#FAF7F2]"
      aria-labelledby="testimonials-heading"
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">

        <AnimatedSection className="mb-12 lg:mb-16 text-center">
          <p className="eyebrow mb-3">Real Homes, Real Stories</p>
          <h2
            id="testimonials-heading"
            className="font-serif text-[2.2rem] lg:text-[3rem] font-light text-[#3D2B1F]"
          >
            What Our Customers Say
          </h2>
        </AnimatedSection>

        <StaggeredChildren
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6"
          staggerMs={100}
          baseDelay={50}
        >
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="group bg-white border border-[rgba(61,43,31,0.06)] p-8 lg:p-10 flex flex-col hover:border-[rgba(201,169,110,0.3)] hover:shadow-[0_8px_40px_rgba(201,169,110,0.07)] transition-all duration-500"
            >
              {/* Quote mark */}
              <div className="mb-5">
                <QuoteIcon />
              </div>

              {/* Quote text */}
              <p className="font-serif text-[1.05rem] lg:text-[1.1rem] text-[#3D2B1F] font-light leading-[1.75] italic flex-1 mb-8">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Attribution */}
              <div>
                {/* Stars */}
                <div className="flex items-center gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} />
                  ))}
                </div>

                {/* Gold divider */}
                <div className="w-7 h-px bg-[#C9A96E] mb-3 opacity-40 group-hover:w-12 transition-all duration-500" />

                <p className="font-sans text-[13px] font-medium text-[#3D2B1F] tracking-wide">
                  {t.name}
                </p>
                <p className="font-sans text-[11px] tracking-[0.18em] uppercase text-[#8B7D6E] mt-0.5">
                  {t.city}
                </p>
              </div>
            </div>
          ))}
        </StaggeredChildren>
      </div>
    </section>
  );
}
