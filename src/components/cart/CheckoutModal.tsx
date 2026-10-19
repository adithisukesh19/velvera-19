import React, { useState } from 'react';
import { CartItem } from '../../types';
import { X, CheckCircle2, ShieldCheck, Truck, CreditCard, Smartphone, Banknote } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onOrderComplete: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onOrderComplete,
}) => {
  const [formData, setFormData] = useState({
    name: 'Ananya Sharma',
    email: 'ananya.sharma@example.com',
    phone: '+91 98765 43210',
    address: '42 Altamount Road, Cumballa Hill',
    city: 'Mumbai',
    postalCode: '400026',
    paymentMethod: 'upi' as 'upi' | 'card' | 'cod',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<string | null>(null);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shippingCost = subtotal >= 3500 || cartItems.length === 0 ? 0 : 250;
  const grandTotal = subtotal + shippingCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const generatedOrderId = `VEL-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderConfirmed(generatedOrderId);
      onOrderComplete();
    }, 1200);
  };

  const handleFinish = () => {
    setOrderConfirmed(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FAF7F2] border border-[#D9C8BE] shadow-2xl p-6 sm:p-10 my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full border border-[#D9C8BE] flex items-center justify-center text-[#141211] hover:bg-[#141211] hover:text-white transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>

        {orderConfirmed ? (
          /* Confirmation Receipt State */
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-[#EBF2EC] text-[#2E5E3A] flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={36} />
            </div>

            <span className="text-xs uppercase tracking-[0.25em] text-[#8C733E] font-medium block mb-2">
              Order Confirmed & Atelier Dispatched
            </span>

            <h3 className="font-serif text-3xl sm:text-4xl text-[#141211] font-normal mb-3">
              Thank You for Your Order
            </h3>

            <p className="text-sm text-[#554E48] max-w-md mx-auto mb-6">
              Your bespoke VELVÉRA order has been accepted. We are delicately wrapping your formulas in our signature velvet keepsake coffret.
            </p>

            <div className="bg-white border border-[#E8DEC8] p-6 max-w-md mx-auto text-left mb-8 space-y-3 text-xs">
              <div className="flex justify-between pb-3 border-b border-[#E8DEC8]">
                <span className="text-[#70665E]">Order Reference</span>
                <span className="font-mono font-semibold text-[#141211]">{orderConfirmed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#70665E]">Recipient</span>
                <span className="text-[#141211] font-medium">{formData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#70665E]">Shipping Destination</span>
                <span className="text-[#141211]">{formData.city}, {formData.postalCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#70665E]">Payment Mode</span>
                <span className="text-[#141211] uppercase font-mono">{formData.paymentMethod}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-[#E8DEC8] text-sm font-serif font-semibold text-[#141211]">
                <span>Total Amount</span>
                <span>₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="px-8 py-3.5 bg-[#141211] text-[#FAF7F2] text-xs uppercase tracking-wider font-medium hover:bg-[#4A121A] transition-colors cursor-pointer"
            >
              Continue Exploring VELVÉRA
            </button>
          </div>
        ) : (
          /* Checkout Form */
          <div>
            <div className="mb-6">
              <span className="text-xs uppercase tracking-[0.2em] text-[#8C733E] font-medium block mb-1">
                Secure Checkout
              </span>
              <h3 className="font-serif text-3xl text-[#141211] font-normal">
                Atelier Delivery Details
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Recipient Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-medium text-[#141211] mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white border border-[#D9C8BE] px-3 py-2 text-xs text-[#141211] focus:outline-none focus:border-[#141211]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-medium text-[#141211] mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white border border-[#D9C8BE] px-3 py-2 text-xs text-[#141211] focus:outline-none focus:border-[#141211]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-medium text-[#141211] mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white border border-[#D9C8BE] px-3 py-2 text-xs text-[#141211] focus:outline-none focus:border-[#141211]"
                />
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-medium text-[#141211] mb-1.5">
                  Street Address & Apartment *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-white border border-[#D9C8BE] px-3 py-2 text-xs text-[#141211] focus:outline-none focus:border-[#141211]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-medium text-[#141211] mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-white border border-[#D9C8BE] px-3 py-2 text-xs text-[#141211] focus:outline-none focus:border-[#141211]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-medium text-[#141211] mb-1.5">
                    Postal PIN Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full bg-white border border-[#D9C8BE] px-3 py-2 text-xs text-[#141211] focus:outline-none focus:border-[#141211]"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-medium text-[#141211] mb-2.5">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'upi', label: 'UPI / QR', icon: Smartphone },
                    { id: 'card', label: 'Card', icon: CreditCard },
                    { id: 'cod', label: 'Cash on Del.', icon: Banknote },
                  ].map((p) => {
                    const Icon = p.icon;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, paymentMethod: p.id as any })}
                        className={`p-3 border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                          formData.paymentMethod === p.id
                            ? 'border-[#141211] bg-white ring-1 ring-[#141211]'
                            : 'border-[#D9C8BE] bg-[#F7F2EA] hover:border-[#8C733E]'
                        }`}
                      >
                        <Icon size={18} className="text-[#141211]" />
                        <span className="text-xs font-medium text-[#141211]">{p.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Summary and Confirmation Button */}
              <div className="pt-4 border-t border-[#E8DEC8]">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs uppercase tracking-wider text-[#70665E]">Total Payable Amount</span>
                  <span className="font-serif text-2xl font-semibold text-[#141211] tabular-nums">
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#141211] text-[#FAF7F2] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#4A121A] transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {isSubmitting ? 'Verifying & Dispatching...' : `Confirm Order · ₹${grandTotal.toLocaleString('en-IN')}`}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
