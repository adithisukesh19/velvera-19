import React, { useState } from 'react';
import { Product, Shade, CategoryFilter } from '../../types';
import { Star, Eye, ShoppingBag, Check, Search, X } from 'lucide-react';

interface ProductCatalogProps {
  products: Product[];
  activeCategory: CategoryFilter;
  onSelectCategory: (category: CategoryFilter) => void;
  onInspect3D: (product: Product) => void;
  onAddToCart: (product: Product, shade: Shade, quantity: number) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  activeCategory,
  onSelectCategory,
  onInspect3D,
  onAddToCart,
  searchQuery,
  onSearchChange,
}) => {
  // Track selected shade per product ID
  const [selectedShades, setSelectedShades] = useState<Record<string, number>>({});
  const [addedItemFeedback, setAddedItemFeedback] = useState<string | null>(null);

  const filterTabs: { id: CategoryFilter; label: string }[] = [
    { id: 'all', label: 'All Creations' },
    { id: 'lips', label: 'Lips' },
    { id: 'face', label: 'Complexion' },
    { id: 'eyes', label: 'Eyes' },
    { id: 'bestsellers', label: 'Bestsellers' },
    { id: 'new', label: 'New Arrivals' },
  ];

  // Filtering logic
  const filteredProducts = products.filter((p) => {
    // Category match
    const categoryMatch =
      activeCategory === 'all'
        ? true
        : activeCategory === 'bestsellers'
        ? p.isBestseller
        : activeCategory === 'new'
        ? p.isNewArrival
        : p.category === activeCategory;

    // Search query match
    const query = searchQuery.trim().toLowerCase();
    const searchMatch =
      !query ||
      p.name.toLowerCase().includes(query) ||
      p.subtitle.toLowerCase().includes(query) ||
      p.shades.some((s) => s.name.toLowerCase().includes(query));

    return categoryMatch && searchMatch;
  });

  const handleSelectShade = (productId: string, shadeIdx: number) => {
    setSelectedShades((prev) => ({ ...prev, [productId]: shadeIdx }));
  };

  const handleAdd = (product: Product) => {
    const shadeIdx = selectedShades[product.id] ?? product.defaultShadeIndex ?? 0;
    const shade = product.shades[shadeIdx] || product.shades[0];
    onAddToCart(product, shade, 1);
    setAddedItemFeedback(product.id);
    setTimeout(() => setAddedItemFeedback(null), 1800);
  };

  return (
    <section id="catalog" className="py-20 px-6 md:px-12 max-w-7xl mx-auto scroll-mt-20">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-[#E8DEC8]">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#8C733E] font-medium block mb-2">
            The Haute Beauté Portfolio
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#141211] font-normal tracking-tight">
            Permanent & Limited Editions
          </h2>
        </div>

        {/* Search input in catalog */}
        <div className="mt-6 md:mt-0 relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search shades or formula..."
            className="w-full bg-white border border-[#D9C8BE] px-4 py-2 pl-9 text-xs text-[#141211] placeholder:text-[#8C837B] focus:outline-none focus:border-[#141211] transition-colors"
          />
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C837B]" />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C837B] hover:text-[#141211] cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs (Interactive segmented buttons allowed by frontend-design skill) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
        {filterTabs.map((tab) => {
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectCategory(tab.id)}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-medium whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#141211] text-[#FAF7F2] shadow-sm'
                  : 'bg-white/80 border border-[#D9C8BE] text-[#554E48] hover:border-[#141211] hover:text-[#141211]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Products Grid (3-column desktop baseline) */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center bg-white/60 border border-[#E8DEC8] p-12">
          <p className="font-serif text-2xl text-[#141211] mb-2">No creations found</p>
          <p className="text-xs text-[#70665E] mb-6">
            We couldn’t find any products matching &ldquo;{searchQuery}&rdquo;.
          </p>
          <button
            onClick={() => {
              onSearchChange('');
              onSelectCategory('all');
            }}
            className="px-6 py-2.5 bg-[#141211] text-[#FAF7F2] text-xs uppercase tracking-wider font-medium cursor-pointer"
          >
            View All Creations
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => {
            const currentShadeIdx = selectedShades[product.id] ?? product.defaultShadeIndex ?? 0;
            const currentShade = product.shades[currentShadeIdx] || product.shades[0];
            const isJustAdded = addedItemFeedback === product.id;

            return (
              <div
                key={product.id}
                className="group relative bg-[#FAF7F2] border border-[#E8DEC8] flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                {/* Product Image Stage (65-75% visual dominance) */}
                <div className="relative aspect-[4/3] sm:aspect-[1/1] overflow-hidden bg-[#F3ECE0] border-b border-[#E8DEC8]">
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Subtle 3D Quick Inspect Button */}
                  <div className="absolute top-3 right-3 z-10">
                    <button
                      onClick={() => onInspect3D(product)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#FAF7F2]/90 hover:bg-[#141211] hover:text-white text-[#141211] text-[11px] font-medium tracking-wide uppercase border border-[#D9C8BE] backdrop-blur-sm transition-colors cursor-pointer shadow-xs"
                      title="Inspect in 3D"
                    >
                      <Eye size={13} className="text-[#8C733E]" />
                      <span>3D View</span>
                    </button>
                  </div>

                  {/* Subtle Limited / Bestseller Text (Unboxed, no colored pill) */}
                  {(product.isBestseller || product.isNewArrival) && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="text-[10px] uppercase tracking-widest text-[#141211] font-semibold bg-[#FAF7F2]/90 px-2 py-1 border border-[#D9C8BE]">
                        {product.isBestseller ? 'Bestseller' : 'New Arrival'}
                      </span>
                    </div>
                  )}

                  {/* Active Shade Tint Overlay preview */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1 transition-colors duration-300"
                    style={{ backgroundColor: currentShade.hex }}
                  />
                </div>

                {/* Card Information */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Category & Rating */}
                    <div className="flex items-center justify-between text-xs text-[#70665E] mb-1.5">
                      <span className="uppercase tracking-widest font-medium text-[11px] text-[#8C733E]">
                        {product.category}
                      </span>
                      <div className="flex items-center gap-1 text-[#141211]">
                        <Star size={12} className="fill-[#C5A059] text-[#C5A059]" />
                        <span className="font-medium text-xs tabular-nums">{product.rating}</span>
                        <span className="text-[11px] text-[#8C837B]">({product.reviewsCount})</span>
                      </div>
                    </div>

                    {/* Product Name */}
                    <h3 className="font-serif text-xl sm:text-2xl text-[#141211] font-medium leading-snug mb-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-[#70665E] line-clamp-1 mb-3">
                      {product.subtitle}
                    </p>

                    {/* Price in INR (Tabular Numerals) */}
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="font-serif text-xl font-semibold text-[#141211] tabular-nums">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-[#8C837B] line-through tabular-nums">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    {/* Shade Selector Row */}
                    <div className="mb-5">
                      <div className="flex items-center justify-between text-[11px] text-[#554E48] mb-2">
                        <span className="font-medium">
                          Shade: <strong className="text-[#141211]">{currentShade.name}</strong>
                        </span>
                        <span className="text-[#8C733E] font-mono">{currentShade.code}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {product.shades.map((shade, idx) => (
                          <button
                            key={shade.id}
                            onClick={() => handleSelectShade(product.id, idx)}
                            className={`w-6 h-6 rounded-full border transition-all cursor-pointer ${
                              idx === currentShadeIdx
                                ? 'ring-2 ring-offset-1 ring-[#141211] scale-110'
                                : 'border-black/20 hover:scale-105'
                            }`}
                            style={{ backgroundColor: shade.hex }}
                            title={`${shade.name} (${shade.code})`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions: Add to Bag + 3D View */}
                  <div className="pt-4 border-t border-[#E8DEC8] flex items-center gap-2">
                    <button
                      onClick={() => handleAdd(product)}
                      className={`flex-1 py-2.5 px-4 text-xs uppercase tracking-wider font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                        isJustAdded
                          ? 'bg-[#2E5E3A] text-white'
                          : 'bg-[#141211] text-[#FAF7F2] hover:bg-[#4A121A]'
                      }`}
                    >
                      {isJustAdded ? (
                        <>
                          <Check size={14} />
                          <span>Added to Bag</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={14} />
                          <span>Add to Bag</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => onInspect3D(product)}
                      className="p-2.5 border border-[#D9C8BE] text-[#141211] hover:border-[#141211] hover:bg-[#141211]/5 transition-colors cursor-pointer"
                      title="Inspect 3D Model"
                      aria-label="Inspect 3D Model"
                    >
                      <Eye size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
