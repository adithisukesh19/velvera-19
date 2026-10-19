import React, { useState } from 'react';
import { X, User, LogOut, Check, Sparkles, Package, ShieldCheck, Mail, ArrowRight, Download } from 'lucide-react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: {
    name: string;
    email: string;
    tier: string;
  } | null;
  onLogin: (name: string, email: string) => void;
  onLogout: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [isSwitching, setIsSwitching] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  if (!isOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      const name = nameInput.trim() || emailInput.split('@')[0];
      onLogin(name, emailInput.trim());
      setIsSwitching(false);
      setFeedbackMessage('Signed in successfully.');
      setTimeout(() => setFeedbackMessage(''), 2000);
    }
  };

  const handleSignOut = () => {
    onLogout();
    setIsSwitching(true);
    setFeedbackMessage('Logged out from account.');
    setTimeout(() => setFeedbackMessage(''), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#FAF7F2] border border-[#D9C8BE] shadow-2xl p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full border border-[#D9C8BE] flex items-center justify-center text-[#141211] hover:bg-[#141211] hover:text-white transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <span className="text-xs uppercase tracking-[0.25em] text-[#8C733E] font-medium block mb-1">
            VELVÉRA Client Atelier
          </span>
          <h3 className="font-serif text-3xl text-[#141211] font-normal">
            Account & Atelier Profile
          </h3>
        </div>

        {feedbackMessage && (
          <div className="mb-4 p-3 bg-[#EBF2EC] border border-[#2E5E3A] text-xs text-[#2E5E3A] flex items-center gap-2">
            <Check size={14} />
            <span>{feedbackMessage}</span>
          </div>
        )}

        {currentUser && !isSwitching ? (
          /* Active Account State */
          <div>
            <div className="bg-white border border-[#E8DEC8] p-5 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#141211] text-[#E8D5B5] flex items-center justify-center font-serif text-xl font-medium">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-serif text-xl text-[#141211] font-medium">
                    {currentUser.name}
                  </h4>
                  <p className="text-xs text-[#70665E]">{currentUser.email}</p>
                  <span className="inline-block mt-1 text-[10px] uppercase tracking-wider text-[#8C733E] font-medium">
                    {currentUser.tier}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E8DEC8] space-y-2 text-xs text-[#554E48]">
                <div className="flex justify-between items-center">
                  <span>Atelier Rewards Balance</span>
                  <span className="font-mono font-medium text-[#141211]">1,250 Points</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Complimentary Engraving Privilege</span>
                  <span className="text-[#2E5E3A] font-medium">Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Couture Courier Priority</span>
                  <span className="text-[#2E5E3A] font-medium">Unlocked</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <a
                href="/velvera_source_code.zip"
                download="velvera_source_code.zip"
                className="w-full py-2.5 px-4 bg-[#141211] text-[#FAF7F2] text-xs uppercase tracking-wider font-medium hover:bg-[#4A121A] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Download size={14} />
                <span>Download Project Files (.zip)</span>
              </a>

              <button
                onClick={() => setIsSwitching(true)}
                className="w-full py-2.5 px-4 border border-[#141211] text-xs uppercase tracking-wider text-[#141211] font-medium hover:bg-[#141211] hover:text-white transition-colors cursor-pointer"
              >
                Log In to Another Account
              </button>

              <button
                onClick={handleSignOut}
                className="w-full py-2.5 px-4 border border-[#D9C8BE] text-xs uppercase tracking-wider text-[#70665E] hover:text-[#842029] hover:border-[#842029] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut size={14} />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        ) : (
          /* Sign In / Switch Account Form */
          <div>
            <p className="text-xs text-[#70665E] mb-5">
              Sign in with your email or credentials to access your private salon reservations, saved shades, and couture order receipts.
            </p>

            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-medium text-[#141211] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ananya Sharma"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full bg-white border border-[#D9C8BE] px-3 py-2 text-xs text-[#141211] focus:outline-none focus:border-[#141211]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-medium text-[#141211] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full bg-white border border-[#D9C8BE] px-3 py-2 text-xs text-[#141211] focus:outline-none focus:border-[#141211]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#141211] text-[#FAF7F2] text-xs uppercase tracking-wider font-medium hover:bg-[#4A121A] transition-colors cursor-pointer"
              >
                Sign In to Account
              </button>

              {currentUser && (
                <button
                  type="button"
                  onClick={() => setIsSwitching(false)}
                  className="w-full text-center text-xs text-[#70665E] hover:text-[#141211] mt-2 cursor-pointer"
                >
                  Return to current account ({currentUser.name})
                </button>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
