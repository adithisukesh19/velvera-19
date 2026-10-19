import React, { useState } from 'react';
import { ShoppingBag, Search, Sparkles, X, Menu, User } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenShadeFinder: () => void;
  onOpenSearch: () => void;
  onOpenAccount: () => void;
  currentUser: { name: string; email: string } | null;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenShadeFinder,
  onOpenSearch,
  onOpenAccount,
  currentUser,
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Collection', id: 'catalog' },
    { label: 'Signature 3D', id: 'signature-experience' },
    { label: 'Complexion & Lips', id: 'categories' },
    { label: 'Editorial', id: 'editorial' },
    { label: 'Our Story', id: 'story' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-[#141211] text-[#E8D5B5] text-[11px] uppercase tracking-[0.22em] py-2 px-4 text-center border-b border-[#2A2624] font-medium flex items-center justify-center gap-3">
        <span>Complimentary Signature Velvet Pouch on Orders Over ₹4,000</span>
        <span className="hidden sm:inline text-[#8C733E]" aria-hidden="true">·</span>
        <span className="hidden sm:inline">Pan-India Express Couture Delivery</span>
      </div>

      {/* Main Sticky Navigation Bar (Strict 3-zone contract) */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DEC8]/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark (Single text element) */}
          <button
            onClick={() => handleLinkClick('hero')}
            className="font-serif text-2xl sm:text-3xl tracking-[0.18em] font-medium text-[#141211] uppercase hover:text-[#4A121A] transition-colors whitespace-nowrap shrink-0 cursor-pointer text-left"
          >
            VELVÉRA
          </button>

          {/* Zone 2: 4-5 Clean Single-Line Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 text-xs uppercase tracking-[0.16em] font-medium text-[#554E48]">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className="hover:text-[#141211] transition-colors relative py-1 cursor-pointer whitespace-nowrap shrink-0"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: Primary Actions (Search, Shade Finder, Cart) */}
          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="text-[#554E48] hover:text-[#141211] transition-colors p-1 cursor-pointer"
              title="Search products"
              aria-label="Search collection"
            >
              <Search size={19} />
            </button>

            {/* Find Your Shade Tool */}
            <button
              onClick={onOpenShadeFinder}
              className="hidden sm:flex items-center gap-1.5 text-xs uppercase tracking-wider font-medium text-[#8C733E] hover:text-[#4A121A] transition-colors py-1 cursor-pointer"
              title="Find Your Shade interactive quiz"
            >
              <Sparkles size={14} />
              <span className="whitespace-nowrap">Shade Finder</span>
            </button>

            {/* Account Profile / Switch Account Trigger */}
            <button
              onClick={onOpenAccount}
              className="flex items-center gap-1.5 text-xs text-[#554E48] hover:text-[#141211] transition-colors p-1 cursor-pointer"
              title={currentUser ? `Account: ${currentUser.name}` : 'Sign In / Account'}
              aria-label="Account & Profile"
            >
              <User size={19} />
              {currentUser && (
                <span className="hidden xl:inline text-[11px] font-medium max-w-[80px] truncate">
                  {currentUser.name.split(' ')[0]}
                </span>
              )}
            </button>

            {/* Shopping Bag Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2 text-[#141211] hover:text-[#4A121A] transition-colors flex items-center cursor-pointer"
              aria-label={`Shopping bag with ${cartCount} items`}
            >
              <ShoppingBag size={21} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#4A121A] text-[#FAF7F2] text-[10px] font-semibold w-5 h-5 rounded-full flex items-center justify-center tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1 text-[#141211] cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#E8DEC8] bg-[#FAF7F2] px-6 py-6 space-y-4 shadow-lg animate-fade-in">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className="block w-full text-left font-serif text-lg text-[#141211] py-1 hover:text-[#4A121A] transition-colors cursor-pointer"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-4 border-t border-[#E8DEC8] flex flex-col gap-3">
              <button
                onClick={() => {
                  onOpenAccount();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 text-xs uppercase tracking-wider font-medium text-[#141211]"
              >
                <User size={15} />
                <span>{currentUser ? `Account: ${currentUser.name}` : 'Sign In / Account'}</span>
              </button>
              <button
                onClick={() => {
                  onOpenShadeFinder();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 text-xs uppercase tracking-wider font-medium text-[#8C733E]"
              >
                <Sparkles size={14} />
                <span>Find Your Shade Quiz</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
