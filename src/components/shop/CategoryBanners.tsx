import React from 'react';
import { CategoryFilter } from '../../types';
import { CAMPAIGN_IMAGES } from '../../data/products';
import { ArrowUpRight } from 'lucide-react';

interface CategoryBannersProps {
  onSelectCategory: (category: CategoryFilter) => void;
}

export const CategoryBanners: React.FC<CategoryBannersProps> = ({ onSelectCategory }) => {
  const categories = [
    {
      id: 'lips' as CategoryFilter,
      title: 'Lips',
      subtitle: 'Velvet Haute Pigments & Glazes',
      image: CAMPAIGN_IMAGES.lips,
      count: '6 Shades',
    },
    {
      id: 'face' as CategoryFilter,
      title: 'Face & Complexion',
      subtitle: 'Glass-Skin Fluid & Petal Blushes',
      image: CAMPAIGN_IMAGES.face,
      count: '9 Formulas',
    },
    {
      id: 'eyes' as CategoryFilter,
      title: 'Eyes',
      subtitle: 'Dimensional Chromatic Quads',
      image: CAMPAIGN_IMAGES.eyes,
      count: '4 Textures',
    },
  ];

  return (
    <section id="categories" className="py-20 px-6 md:px-12 max-w-7xl mx-auto scroll-mt-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#8C733E] font-medium block mb-2">
            Curated Collections
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#141211] font-normal tracking-tight">
            Shop by Category
          </h2>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <button
            onClick={() => onSelectCategory('bestsellers')}
            className="text-xs uppercase tracking-wider text-[#141211] hover:text-[#4A121A] border-b border-[#141211] pb-0.5 font-medium transition-colors cursor-pointer"
          >
            Explore Bestsellers
          </button>
          <span className="text-[#C5A059]" aria-hidden="true">·</span>
          <button
            onClick={() => onSelectCategory('new')}
            className="text-xs uppercase tracking-wider text-[#141211] hover:text-[#4A121A] border-b border-[#141211] pb-0.5 font-medium transition-colors cursor-pointer"
          >
            New Arrivals
          </button>
        </div>
      </div>

      {/* 3-Column Editorial Category Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className="group relative h-[440px] sm:h-[480px] bg-[#EFE9DF] overflow-hidden cursor-pointer border border-[#E2D5BE] transition-transform duration-500 hover:-translate-y-1.5"
          >
            {/* Background Editorial Image */}
            <img
              src={cat.image}
              alt={cat.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Measured Editorial Contrast Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300" />

            {/* Subtle Gold Border Hover Accent */}
            <div className="absolute inset-0 border border-transparent group-hover:border-[#D4AF37]/40 transition-colors pointer-events-none" />

            {/* Content Overlay */}
            <div className="absolute inset-0 p-8 flex flex-col justify-between text-white z-10">
              <div className="flex justify-between items-start">
                <span className="text-[11px] tracking-[0.2em] uppercase text-[#E8D5B5] font-medium">
                  {cat.count}
                </span>
                <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center transition-transform group-hover:rotate-45">
                  <ArrowUpRight size={18} className="text-white" />
                </div>
              </div>

              <div>
                <h3 className="font-serif text-3xl sm:text-4xl font-normal text-[#FAF7F2] mb-1">
                  {cat.title}
                </h3>
                <p className="text-xs text-[#E8D5B5] tracking-wide mb-4">
                  {cat.subtitle}
                </p>
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#FAF7F2] font-medium border-b border-white/40 pb-1 group-hover:border-white transition-colors">
                  <span>Explore Series</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
