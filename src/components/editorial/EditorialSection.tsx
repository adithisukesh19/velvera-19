import React from 'react';
import { CAMPAIGN_IMAGES } from '../../data/products';
import { Sparkles, ArrowRight } from 'lucide-react';

interface EditorialSectionProps {
  onExploreCollection: () => void;
}

export const EditorialSection: React.FC<EditorialSectionProps> = ({ onExploreCollection }) => {
  return (
    <section id="editorial" className="py-24 bg-[#141211] text-[#FAF7F2] relative overflow-hidden scroll-mt-20">
      {/* Subtle Atmospheric Light Pools */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#4A121A]/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-[#C5A059]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Editorial Top Headline */}
        <div className="mb-16 max-w-4xl">
          <div className="flex items-center gap-3 text-xs tracking-[0.25em] uppercase text-[#C5A059] font-medium mb-4">
            <span>VELVÉRA Editorial Campaign</span>
            <span aria-hidden="true">·</span>
            <span>Vol. IV</span>
          </div>

          <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal leading-[1.08] tracking-tight">
            “An Art Form. <br className="hidden sm:inline" />
            A Feeling. <br className="hidden sm:inline" />
            <span className="italic text-[#E8D5B5]">A Finish.”</span>
          </h2>

          <p className="mt-6 text-base sm:text-lg text-[#C8BFB5] max-w-2xl font-light leading-relaxed">
            Makeup is not an act of concealment — it is an architectural punctuation of identity.
            At VELVÉRA, each formulation begins in our Parisian lab with cold-pressed botanical matrices
            and finishes with crushed micro-fine pigments that move with your skin like molten silk.
          </p>
        </div>

        {/* Asymmetrical Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-16">
          {/* Main Portrait Card (7 cols) */}
          <div className="lg:col-span-7 relative h-[520px] sm:h-[600px] overflow-hidden border border-[#2D2825] group">
            <img
              src={CAMPAIGN_IMAGES.portrait}
              alt="VELVÉRA Haute Beauté Editorial Portrait"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

            <div className="absolute bottom-8 left-8 right-8 text-white">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#C5A059] block mb-2">
                Face of the Season · The Glass Bordeaux Aesthetic
              </span>
              <p className="font-serif text-2xl sm:text-3xl font-normal text-[#FAF7F2] max-w-lg">
                &ldquo;A velvet red lip that never feels dry, paired with complexion so translucent it catches every prism of light.&rdquo;
              </p>
              <span className="text-xs text-[#9E9287] block mt-3 font-sans">
                Elena Rostova · Creative Director, Studio VELVÉRA
              </span>
            </div>
          </div>

          {/* Right Column Stack (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            {/* Texture Close-up */}
            <div className="relative h-64 sm:h-72 overflow-hidden border border-[#2D2825] group">
              <img
                src={CAMPAIGN_IMAGES.texture}
                alt="Liquid Highlighter formulation texture"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[11px] uppercase tracking-widest text-[#E8D5B5] block mb-1">
                  Formula Alchemy
                </span>
                <p className="font-serif text-lg text-white font-normal">
                  Micro-Reflective Starlight Pigment Slurry
                </p>
              </div>
            </div>

            {/* Editorial Story Box */}
            <div className="p-8 bg-[#1B1816] border border-[#2D2825] flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#C5A059] font-medium block mb-3">
                  01. The Three Pillars
                </span>
                <h3 className="font-serif text-2xl text-[#FAF7F2] mb-3">
                  Purity of Ingredient. Weightlessness of Feel.
                </h3>
                <p className="text-xs text-[#A89E94] leading-relaxed mb-6 font-light">
                  Formulated without parabens, talc, micro-plastics, or synthetic fragrances.
                  Each pigment is coated in plant-derived squalane to prevent moisture loss across 12 full hours of wear.
                </p>
              </div>

              <button
                onClick={onExploreCollection}
                className="inline-flex items-center gap-3 text-xs uppercase tracking-widest text-[#E8D5B5] hover:text-white transition-colors cursor-pointer group"
              >
                <span>Experience the Formulas</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Press Quotes Bar */}
        <div className="border-t border-[#2D2825] pt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <p className="font-serif text-xl text-[#FAF7F2] italic mb-2">
              &ldquo;VELVÉRA has completely redefined what a modern luxury lipstick feels like on the lips.&rdquo;
            </p>
            <span className="text-xs text-[#8C837B] uppercase tracking-wider font-sans">
              Vogue India Beauty Awards
            </span>
          </div>

          <div>
            <p className="font-serif text-xl text-[#FAF7F2] italic mb-2">
              &ldquo;The glass-skin fluid creates an ethereal, high-fashion sheen without an ounce of grease.&rdquo;
            </p>
            <span className="text-xs text-[#8C837B] uppercase tracking-wider font-sans">
              Harper’s Bazaar
            </span>
          </div>

          <div>
            <p className="font-serif text-xl text-[#FAF7F2] italic mb-2">
              &ldquo;The architectural 3D casing is worthy of permanent display on your vanity.&rdquo;
            </p>
            <span className="text-xs text-[#8C837B] uppercase tracking-wider font-sans">
              Elle Luxury Edit
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
