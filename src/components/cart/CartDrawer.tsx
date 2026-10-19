import React, { useState } from 'react';
import { CartItem } from '../../types';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: () => void;
  onExploreProducts: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onExploreProducts,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState<{ text: string; error?: boolean } | null>(null);

  if (!isOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 3500;

  // Subtotal calculation
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingCost = isFreeShipping || cartItems.length === 0 ? 0 : 250;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingCost);

  const progressPercent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'VELVERA10' || code === 'COUTURE') {
      setDiscountPercent(10);
      setPromoMessage({ text: '10% Atelier courtesy discount applied.' });
    } else if (code === 'VIP20') {
      setDiscountPercent(20);
      setPromoMessage({ text: '20% VIP Privilege discount applied.' });
    } else {
      setPromoMessage({ text: 'Invalid invitation code. Try "VELVERA10".', error: true });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F2] border-l border-[#D9C8BE] shadow-2xl flex flex-col justify-between">
          {/* Drawer Header */}
          <div className="p-6 border-b border-[#E8DEC8] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag size={18} className="text-[#141211]" />
              <h2 className="font-serif text-2xl text-[#141211] font-medium tracking-tight">
                Shopping Bag
              </h2>
              <span className="text-xs text-[#70665E] font-mono">({cartItems.length})</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[#554E48] hover:text-[#141211] cursor-pointer"
              aria-label="Close cart"
            >
              <X size={20} />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          {cartItems.length > 0 && (
            <div className="px-6 py-3 bg-[#F4EFEB] border-b border-[#E8DEC8] text-xs">
              <div className="flex justify-between items-center mb-1 text-[#554E48]">
                {isFreeShipping ? (
                  <span className="font-medium text-[#2E5E3A]">
                    ✓ You have unlocked Complimentary Express Delivery!
                  </span>
                ) : (
                  <span>
                    Add <strong className="text-[#141211] font-mono">₹{(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString('en-IN')}</strong> for Complimentary Delivery
                  </span>
                )}
                <span className="text-[11px] font-mono">{progressPercent}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#E2D5BE] overflow-hidden">
                <div
                  className="h-full bg-[#4A121A] transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#F3ECE0] flex items-center justify-center text-[#8C733E] mb-4">
                  <ShoppingBag size={28} />
                </div>
                <h3 className="font-serif text-2xl text-[#141211] mb-2 font-normal">
                  Your bag is empty
                </h3>
                <p className="text-xs text-[#70665E] max-w-xs mb-6">
                  Explore our permanent collection of lipsticks, foundations, and highlighters.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onExploreProducts();
                  }}
                  className="px-6 py-3 bg-[#141211] text-[#FAF7F2] text-xs uppercase tracking-wider font-medium hover:bg-[#4A121A] transition-colors cursor-pointer"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 pb-6 border-b border-[#E8DEC8] last:border-b-0"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-24 bg-[#EFE9DF] border border-[#D9C8BE] overflow-hidden shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Item Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif text-base text-[#141211] font-medium leading-snug">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-[#8C837B] hover:text-[#4A121A] transition-colors p-0.5 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      {/* Shade indicator */}
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className="w-3 h-3 rounded-full border border-black/15 shrink-0"
                          style={{ backgroundColor: item.selectedShade.hex }}
                        />
                        <span className="text-xs text-[#554E48]">
                          {item.selectedShade.name} <span className="font-mono text-[10px]">({item.selectedShade.code})</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#D9C8BE] bg-white">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-7 text-xs text-[#141211] hover:text-[#8C733E] flex items-center justify-center cursor-pointer"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-xs font-mono font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-7 text-xs text-[#141211] hover:text-[#8C733E] flex items-center justify-center cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      {/* Item Total Price */}
                      <span className="font-serif text-base font-semibold text-[#141211] tabular-nums">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer (Subtotal & Actions) */}
          {cartItems.length > 0 && (
            <div className="p-6 bg-white border-t border-[#E8DEC8] space-y-4">
              {/* Promo code form */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter Invitation / Promo Code"
                    className="w-full bg-[#FAF7F2] border border-[#D9C8BE] px-3 py-2 text-xs uppercase tracking-wider text-[#141211] placeholder:normal-case placeholder:tracking-normal focus:outline-none focus:border-[#141211]"
                  />
                  <Tag size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C837B]" />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#FAF7F2] border border-[#141211] text-xs uppercase tracking-wider text-[#141211] font-medium hover:bg-[#141211] hover:text-white transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </form>

              {promoMessage && (
                <p
                  className={`text-[11px] ${
                    promoMessage.error ? 'text-[#842029]' : 'text-[#2E5E3A]'
                  }`}
                >
                  {promoMessage.text}
                </p>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#554E48] pt-2">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="tabular-nums font-mono">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#2E5E3A]">
                    <span>Atelier Privilege ({discountPercent}%)</span>
                    <span className="tabular-nums font-mono">-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Express Couture Delivery</span>
                  <span className="tabular-nums font-mono">
                    {shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-serif font-semibold text-[#141211] pt-2 border-t border-[#E8DEC8]">
                  <span>Total Due</span>
                  <span className="tabular-nums">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Primary Checkout CTA */}
              <button
                onClick={onCheckout}
                className="w-full py-3.5 bg-[#141211] text-[#FAF7F2] text-xs uppercase tracking-[0.18em] font-medium hover:bg-[#4A121A] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={15} />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#8C837B]">
                <ShieldCheck size={13} className="text-[#8C733E]" />
                <span>Complimentary luxury velvet wrapping & 2 samples included</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
