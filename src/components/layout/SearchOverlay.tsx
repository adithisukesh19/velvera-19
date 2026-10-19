import React, { useEffect, useRef } from 'react';
import { Product } from '../../types';
import { PRODUCTS } from '../../data/products';
import { Search, X, ArrowUpRight } from 'lucide-react';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
}) => {
  const [query, setQuery] = React.useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const results = query.trim()
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.shades.some((s) => s.name.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-[#141211]/90 backdrop-blur-md text-[#FAF7F2] p-6 md:p-16 flex flex-col animate-fade-in">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
        {/* Header with Close */}
        <div className="flex justify-between items-center pb-6 border-b border-[#2E2825]">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-medium">
            VELVÉRA Collection Search
          </span>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full border border-[#3E3835] flex items-center justify-center text-[#E8D5B5] hover:text-white hover:border-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Big Search Input */}
        <div className="py-8 relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type product name, shade (e.g. Bordeaux Noir), or formula..."
            className="w-full bg-transparent font-serif text-2xl sm:text-4xl text-[#FAF7F2] placeholder:text-[#5E554D] border-b border-[#3E3835] pb-4 focus:outline-none focus:border-[#C5A059] transition-colors"
          />
          <Search size={24} className="absolute right-0 top-11 text-[#8C837B]" />
        </div>

        {/* Quick Suggestion Tags */}
        {!query && (
          <div className="mt-4">
            <span className="text-xs uppercase tracking-wider text-[#8C837B] block mb-3">
              Popular Searches
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                "L'Élixir Velvet Rouge",
                'Glass-Skin Foundation',
                'Bordeaux Noir',
                'Liquid Blush',
                'Baked Highlighter',
                'Rose Cashmere',
              ].map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-3.5 py-1.5 border border-[#352F2B] bg-[#1E1B19] text-xs text-[#D9CFC4] hover:border-[#C5A059] hover:text-white transition-colors cursor-pointer"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results List */}
        <div className="mt-8 flex-1 overflow-y-auto space-y-4">
          {query.trim() && results.length === 0 && (
            <p className="text-sm text-[#8C837B]">
              No formulas matching &ldquo;{query}&rdquo;. Try browsing by category or checking spelling.
            </p>
          )}

          {results.map((product) => (
            <div
              key={product.id}
              onClick={() => {
                onSelectProduct(product);
                onClose();
              }}
              className="p-4 bg-[#1B1816] border border-[#2D2825] hover:border-[#C5A059] transition-all flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#2A2624] overflow-hidden shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#C5A059]">
                    {product.category}
                  </span>
                  <h4 className="font-serif text-lg text-white font-medium">
                    {product.name}
                  </h4>
                  <p className="text-xs text-[#8C837B]">{product.subtitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-serif text-lg text-[#E8D5B5] tabular-nums">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <ArrowUpRight size={18} className="text-[#8C837B] group-hover:text-white transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
