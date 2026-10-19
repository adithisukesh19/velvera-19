import React, { useState } from 'react';
import { Product, Shade } from '../../types';
import { PRODUCTS } from '../../data/products';
import { X, Sparkles, Check, ArrowRight, RotateCcw } from 'lucide-react';

interface ShadeFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, shade: Shade, quantity: number) => void;
  onInspect3D: (product: Product) => void;
}

export const ShadeFinderModal: React.FC<ShadeFinderModalProps> = ({
  isOpen,
  onClose,
  onAddToCart,
  onInspect3D,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [skinTone, setSkinTone] = useState<'fair' | 'light-medium' | 'tan' | 'deep' | null>(null);
  const [undertone, setUndertone] = useState<'warm' | 'cool' | 'neutral' | null>(null);
  const [finish, setFinish] = useState<'matte' | 'dewy' | 'gloss' | null>(null);
  const [added, setAdded] = useState(false);

  if (!isOpen) return null;

  // Compute recommendation
  const getRecommendation = () => {
    // Flagship lipstick is always a primary, but choose shade based on undertone & tone
    const lipstick = PRODUCTS[0];
    let recommendedLipShade = lipstick.shades[0]; // Bordeaux Noir

    if (undertone === 'warm') {
      recommendedLipShade = lipstick.shades.find((s) => s.id === 'shade-06') || lipstick.shades[5]; // Spiced Terracotta
    } else if (undertone === 'cool') {
      recommendedLipShade = lipstick.shades.find((s) => s.id === 'shade-02') || lipstick.shades[1]; // Velvet Dahlia
    } else if (skinTone === 'fair' || skinTone === 'light-medium') {
      recommendedLipShade = lipstick.shades.find((s) => s.id === 'shade-04') || lipstick.shades[3]; // Rose Cashmere
    }

    // Matching foundation shade
    const foundation = PRODUCTS[1];
    let recommendedFoundShade = foundation.shades[1];
    if (skinTone === 'fair') recommendedFoundShade = foundation.shades[0];
    if (skinTone === 'tan') recommendedFoundShade = foundation.shades[3];
    if (skinTone === 'deep') recommendedFoundShade = foundation.shades[4];

    return {
      lipstick,
      lipShade: recommendedLipShade,
      foundation,
      foundShade: recommendedFoundShade,
    };
  };

  const rec = getRecommendation();

  const handleReset = () => {
    setSkinTone(null);
    setUndertone(null);
    setFinish(null);
    setStep(1);
    setAdded(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#FAF7F2] border border-[#D9C8BE] shadow-2xl p-6 sm:p-10 overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full border border-[#D9C8BE] flex items-center justify-center text-[#141211] hover:bg-[#141211] hover:text-white transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>

        {/* Modal Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#8C733E] font-medium mb-1">
            <Sparkles size={13} />
            <span>VELVÉRA Atelier Diagnostic</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#141211] font-normal">
            Find Your Signature Shade
          </h2>
          <p className="text-xs sm:text-sm text-[#70665E] mt-1">
            Answer 3 quick questions for a bespoke pigment and formula match calibrated to your complexion.
          </p>

          {/* Progress Indicators */}
          <div className="flex items-center gap-2 mt-4">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 transition-all ${
                  step >= s ? 'bg-[#4A121A]' : 'bg-[#E8DEC8]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: Skin Tone */}
        {step === 1 && (
          <div>
            <h3 className="text-sm uppercase tracking-wider font-medium text-[#141211] mb-4">
              Step 1 of 3: Select Your Skin Tone Depth
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {[
                { id: 'fair', label: 'Fair / Porcelain', hex: '#F6E6D7' },
                { id: 'light-medium', label: 'Light-Medium', hex: '#EACBAE' },
                { id: 'tan', label: 'Tan / Olive', hex: '#C8976C' },
                { id: 'deep', label: 'Deep / Rich', hex: '#7D4D34' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSkinTone(item.id as any)}
                  className={`p-4 border text-center transition-all cursor-pointer flex flex-col items-center ${
                    skinTone === item.id
                      ? 'border-[#141211] bg-white ring-1 ring-[#141211]'
                      : 'border-[#D9C8BE] bg-[#F7F2EA] hover:border-[#8C733E]'
                  }`}
                >
                  <span
                    className="w-10 h-10 rounded-full border border-black/10 shadow-inner mb-3"
                    style={{ backgroundColor: item.hex }}
                  />
                  <span className="text-xs font-medium text-[#141211]">{item.label}</span>
                </button>
              ))}
            </div>

            <button
              disabled={!skinTone}
              onClick={() => setStep(2)}
              className="w-full py-3 bg-[#141211] text-[#FAF7F2] text-xs uppercase tracking-wider font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#4A121A] transition-colors cursor-pointer"
            >
              Next: Undertone →
            </button>
          </div>
        )}

        {/* STEP 2: Undertone */}
        {step === 2 && (
          <div>
            <h3 className="text-sm uppercase tracking-wider font-medium text-[#141211] mb-2">
              Step 2 of 3: What is Your Undertone?
            </h3>
            <p className="text-xs text-[#70665E] mb-4">
              Look at the veins on your inner wrist under natural daylight.
            </p>

            <div className="space-y-3 mb-8">
              {[
                {
                  id: 'warm',
                  title: 'Warm / Golden',
                  desc: 'Veins appear greenish or olive; gold jewelry complements your skin best.',
                },
                {
                  id: 'cool',
                  title: 'Cool / Rosy',
                  desc: 'Veins appear blueish or purple; silver jewelry makes your skin pop.',
                },
                {
                  id: 'neutral',
                  title: 'Neutral / Balanced',
                  desc: 'Veins appear blue-green; both gold and silver look equally harmonious.',
                },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setUndertone(item.id as any)}
                  className={`w-full p-4 border text-left transition-all cursor-pointer ${
                    undertone === item.id
                      ? 'border-[#141211] bg-white ring-1 ring-[#141211]'
                      : 'border-[#D9C8BE] bg-[#F7F2EA] hover:border-[#8C733E]'
                  }`}
                >
                  <span className="block text-xs font-semibold uppercase tracking-wider text-[#141211] mb-1">
                    {item.title}
                  </span>
                  <span className="block text-xs text-[#554E48]">{item.desc}</span>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="py-3 px-6 border border-[#D9C8BE] text-xs uppercase tracking-wider text-[#554E48] hover:text-[#141211] cursor-pointer"
              >
                Back
              </button>
              <button
                disabled={!undertone}
                onClick={() => setStep(3)}
                className="flex-1 py-3 bg-[#141211] text-[#FAF7F2] text-xs uppercase tracking-wider font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#4A121A] transition-colors cursor-pointer"
              >
                Next: Finish Preference →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Desired Finish */}
        {step === 3 && (
          <div>
            <h3 className="text-sm uppercase tracking-wider font-medium text-[#141211] mb-4">
              Step 3 of 3: Preferred Lip & Complexion Finish
            </h3>

            <div className="space-y-3 mb-8">
              {[
                {
                  id: 'matte',
                  title: 'Haute Velvet Matte',
                  desc: 'Rich, powdery, architectural opacity with cushion hydration.',
                },
                {
                  id: 'dewy',
                  title: 'Ethereal Glass Glow',
                  desc: 'High-luminosity moisture finish reflecting light like polished glass.',
                },
                {
                  id: 'gloss',
                  title: 'High-Mirror Cushion Lacquer',
                  desc: 'Volumizing peptide shine with diamond refractive brilliance.',
                },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setFinish(item.id as any)}
                  className={`w-full p-4 border text-left transition-all cursor-pointer ${
                    finish === item.id
                      ? 'border-[#141211] bg-white ring-1 ring-[#141211]'
                      : 'border-[#D9C8BE] bg-[#F7F2EA] hover:border-[#8C733E]'
                  }`}
                >
                  <span className="block text-xs font-semibold uppercase tracking-wider text-[#141211] mb-1">
                    {item.title}
                  </span>
                  <span className="block text-xs text-[#554E48]">{item.desc}</span>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="py-3 px-6 border border-[#D9C8BE] text-xs uppercase tracking-wider text-[#554E48] hover:text-[#141211] cursor-pointer"
              >
                Back
              </button>
              <button
                disabled={!finish}
                onClick={() => setStep(4)}
                className="flex-1 py-3 bg-[#4A121A] text-[#FAF7F2] text-xs uppercase tracking-wider font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#141211] transition-colors cursor-pointer"
              >
                Reveal My Matches
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Results & Matches */}
        {step === 4 && (
          <div className="animate-fade-in">
            <div className="p-4 bg-[#F2ECE1] border border-[#E0D3C0] mb-6">
              <span className="text-[11px] uppercase tracking-wider text-[#8C733E] font-medium block">
                Prescription Profile
              </span>
              <p className="font-serif text-lg text-[#141211]">
                {skinTone} skin with {undertone} undertones · {finish} finish
              </p>
            </div>

            {/* Recommended Lipstick */}
            <div className="p-5 bg-white border border-[#D9C8BE] mb-4 flex flex-col sm:flex-row items-center gap-5">
              <div
                className="w-14 h-14 rounded-full border-2 border-[#141211] shadow-inner shrink-0"
                style={{ backgroundColor: rec.lipShade.hex }}
              />
              <div className="flex-1 text-center sm:text-left">
                <span className="text-[10px] uppercase tracking-widest text-[#8C733E] font-medium block">
                  Top Recommended Lip Match
                </span>
                <h4 className="font-serif text-xl text-[#141211] font-medium">
                  {rec.lipstick.name}
                </h4>
                <p className="text-xs text-[#554E48] mt-0.5">
                  Shade: <strong className="text-[#4A121A]">{rec.lipShade.name}</strong> ({rec.lipShade.code}) · ₹{rec.lipstick.price.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onAddToCart(rec.lipstick, rec.lipShade, 1);
                    setAdded(true);
                  }}
                  className={`py-2 px-4 text-xs uppercase tracking-wider font-medium transition-colors cursor-pointer ${
                    added
                      ? 'bg-[#2E5E3A] text-white'
                      : 'bg-[#141211] text-white hover:bg-[#4A121A]'
                  }`}
                >
                  {added ? 'Added to Bag' : 'Add to Bag'}
                </button>
                <button
                  onClick={() => {
                    onInspect3D(rec.lipstick);
                    onClose();
                  }}
                  className="py-2 px-3 border border-[#D9C8BE] text-xs uppercase tracking-wider text-[#141211] hover:border-[#141211] cursor-pointer"
                  title="View 3D Model"
                >
                  3D View
                </button>
              </div>
            </div>

            {/* Recommended Foundation */}
            <div className="p-5 bg-white border border-[#D9C8BE] mb-6 flex flex-col sm:flex-row items-center gap-5">
              <div
                className="w-14 h-14 rounded-full border-2 border-[#141211] shadow-inner shrink-0"
                style={{ backgroundColor: rec.foundShade.hex }}
              />
              <div className="flex-1 text-center sm:text-left">
                <span className="text-[10px] uppercase tracking-widest text-[#8C733E] font-medium block">
                  Complexion Foundation Match
                </span>
                <h4 className="font-serif text-xl text-[#141211] font-medium">
                  {rec.foundation.name}
                </h4>
                <p className="text-xs text-[#554E48] mt-0.5">
                  Shade: <strong className="text-[#141211]">{rec.foundShade.name}</strong> ({rec.foundShade.code}) · ₹{rec.foundation.price.toLocaleString('en-IN')}
                </p>
              </div>
              <button
                onClick={() => {
                  onAddToCart(rec.foundation, rec.foundShade, 1);
                  setAdded(true);
                }}
                className="py-2 px-4 bg-[#141211] text-white hover:bg-[#4A121A] text-xs uppercase tracking-wider font-medium cursor-pointer"
              >
                Add to Bag
              </button>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-xs text-[#70665E] hover:text-[#141211] cursor-pointer"
              >
                <RotateCcw size={13} />
                <span>Retake Quiz</span>
              </button>
              <button
                onClick={onClose}
                className="text-xs uppercase tracking-wider text-[#141211] font-medium hover:underline cursor-pointer"
              >
                Close & Return to Store
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
