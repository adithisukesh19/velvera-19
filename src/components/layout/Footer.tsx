import React, { useState } from 'react';
import { ArrowRight, Check, ShieldCheck, Sparkles, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer id="story" className="bg-[#121110] text-[#E8DED3] border-t border-[#262220] pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Top Newsletter & Atelier Invitation */}
        <div className="pb-16 border-b border-[#262220] grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-medium block mb-2">
              The VELVÉRA Atelier Circle
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl text-[#FAF7F2] font-normal tracking-tight mb-3">
              Receive Private Salon Invitations & Exclusive Formula Previews
            </h3>
            <p className="text-xs sm:text-sm text-[#9E9287] font-light leading-relaxed max-w-lg">
              Join our private directory to receive complimentary engraved packaging privileges,
              first access to limited 3D shade releases, and seasonal color forecast bulletins.
            </p>
          </div>

          <div className="lg:col-span-6">
            {subscribed ? (
              <div className="p-4 bg-[#1C281F] border border-[#2E5E3A] text-xs text-[#E1EFE3] flex items-center gap-3">
                <Check size={18} className="text-[#4CAF50] shrink-0" />
                <span>Thank you for joining the Atelier Circle. An invitation voucher has been dispatched.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your personal email address..."
                  className="flex-1 bg-[#1A1817] border border-[#3E3835] px-4 py-3 text-xs text-white placeholder:text-[#6E645C] focus:outline-none focus:border-[#C5A059] transition-colors"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#FAF7F2] text-[#121110] hover:bg-[#C5A059] hover:text-black text-xs uppercase tracking-widest font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <span>Subscribe</span>
                  <ArrowRight size={14} />
                </button>
              </form>
            )}
            <span className="text-[11px] text-[#70665E] block mt-2">
              We respect your sanctuary. Unsubscribe at any time with a single click.
            </span>
          </div>
        </div>

        {/* Multi-column Navigation */}
        <div className="py-16 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 text-xs text-[#9E9287]">
          {/* Brand Info */}
          <div className="col-span-2">
            <span className="font-serif text-2xl tracking-[0.2em] font-medium text-[#FAF7F2] uppercase block mb-4">
              VELVÉRA
            </span>
            <p className="text-xs leading-relaxed text-[#8C8075] max-w-sm mb-6">
              Haute Beauté house bridging architectural 3D product design with clean French-Indian cosmetic chemistry.
              Formulations certified vegan, cruelty-free, and dermatologically proven.
            </p>
            <div className="flex items-center gap-4 text-xs tracking-wider uppercase text-[#C5A059]">
              <span>Paris</span>
              <span aria-hidden="true">·</span>
              <span>Mumbai</span>
              <span aria-hidden="true">·</span>
              <span>London</span>
              <span aria-hidden="true">·</span>
              <span>New Delhi</span>
            </div>
          </div>

          {/* Boutique Salons */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-medium text-[#FAF7F2] mb-4">
              Atelier Salons
            </h4>
            <ul className="space-y-2.5">
              <li>Bandra West, Mumbai</li>
              <li>The Chanakya, New Delhi</li>
              <li>Rue Saint-Honoré, Paris</li>
              <li>Mayfair, London</li>
              <li>The Dubai Mall Fashion Avenue</li>
            </ul>
          </div>

          {/* Client Concierge */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-medium text-[#FAF7F2] mb-4">
              Concierge & Care
            </h4>
            <ul className="space-y-2.5">
              <li>Complimentary Engraving</li>
              <li>Shipping & Global Track</li>
              <li>Authenticity Guarantee</li>
              <li>Bespoke Consultation</li>
              <li>Recycling Empties Program</li>
            </ul>
          </div>

          {/* Formulations & Ethics */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-medium text-[#FAF7F2] mb-4">
              Formulation Ethics
            </h4>
            <ul className="space-y-2.5">
              <li>100% Vegan & Cruelty-Free</li>
              <li>Clean Squalane & Hyaluronic</li>
              <li>Zero Micro-plastics</li>
              <li>Sustainable Aluminium & Glass</li>
              <li>Dermatologist Tested</li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-8 border-t border-[#262220] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#70665E]">
          <div>
            <span>© {new Date().getFullYear()} VELVÉRA Haute Beauté S.A. All rights reserved.</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <a
              href="/velvera_source_code.zip"
              download="velvera_source_code.zip"
              className="text-[#C5A059] hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Download Project Files (.zip)</span>
            </a>
            <span className="hover:text-[#E8DED3] transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#E8DED3] transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-[#E8DED3] transition-colors cursor-pointer">Cookie Preferences</span>
            <span className="hover:text-[#E8DED3] transition-colors cursor-pointer">Accessibility Statement</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
