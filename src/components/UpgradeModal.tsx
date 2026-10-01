import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  Award, 
  CreditCard, 
  Smartphone,
  Building2,
  ArrowRight,
  FileCheck2,
  AlertCircle,
  Clock,
  Printer,
  ChevronRight,
  Tag,
  HelpCircle
} from 'lucide-react';
import { COURSES } from '../data/courses';
import { 
  validateCreditCard, 
  validatePakistaniMobileWallet, 
  validateBankReference, 
  TEST_CARDS 
} from '../utils/paymentValidation';

interface UpgradeModalProps {
  courseId?: string | null;
  onClose: () => void;
  onEnrollSuccess: (courseId: string) => void;
}

type PaymentMethod = 'card' | 'mobile_wallet' | 'bank_transfer';

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  courseId,
  onClose,
  onEnrollSuccess
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courseId || COURSES[0].id);
  const selectedCourse = COURSES.find(c => c.id === selectedCourseId) || COURSES[0];
  
  // Checkout states
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card');
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  // Card details (clean by default for strict validation check)
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [showSandboxCards, setShowSandboxCards] = useState(false);

  // Mobile wallet details (JazzCash / Easypaisa)
  const [walletProvider, setWalletProvider] = useState<'easypaisa' | 'jazzcash' | 'raast'>('easypaisa');
  const [mobileNumber, setMobileNumber] = useState('');
  const [walletCnic, setWalletCnic] = useState('');

  // Bank Transfer details
  const [bankDepositRef, setBankDepositRef] = useState('');

  // Processing & Confirmation
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [paymentTimestamp, setPaymentTimestamp] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  if (!selectedCourse) return null;

  // Price calculations
  const originalPKR = selectedCourse.pricePKR;
  const originalUSD = selectedCourse.priceUSD;
  const discountAmountPKR = Math.round((originalPKR * discountPercent) / 100);
  const discountAmountUSD = Math.round((originalUSD * discountPercent) / 100);
  // Tax / Fees: 0% / Waived for students via education grant
  const taxFeesPKR = 0;
  const taxFeesUSD = 0;
  const finalPricePKR = Math.max(0, originalPKR - discountAmountPKR + taxFeesPKR);
  const finalPriceUSD = Math.max(0, originalUSD - discountAmountUSD + taxFeesUSD);

  const applyCode = (codeToApply: string) => {
    const code = codeToApply.trim().toUpperCase();
    if (code === 'CYBERSHIELD20' || code === 'FELLOW20' || code === 'ZAIB20') {
      setDiscountPercent(20);
      setAppliedPromoCode(code);
      setPromoMessage('✓ 20% Security Fellowship Discount Applied!');
      setFormError(null);
    } else if (code === 'STUDENT50') {
      setDiscountPercent(50);
      setAppliedPromoCode(code);
      setPromoMessage('✓ 50% Verified Student Scholarship Applied!');
      setFormError(null);
    } else {
      setPromoMessage(null);
      setFormError('Invalid coupon code. Try "CYBERSHIELD20" or "STUDENT50"');
    }
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    applyCode(promoCode);
  };

  const removeDiscount = () => {
    setDiscountPercent(0);
    setAppliedPromoCode(null);
    setPromoMessage(null);
    setPromoCode('');
  };

  const handleFillTestCard = (testCard: typeof TEST_CARDS[0]) => {
    setCardNumber(testCard.number);
    setCardHolder(testCard.holder);
    setCardExpiry(testCard.expiry);
    setCardCvc(testCard.cvv);
    setFormError(null);
    setShowSandboxCards(false);
  };

  const handleExecutePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Strict Authenticity & Checksum Validation
    if (selectedMethod === 'card') {
      const cardResult = validateCreditCard(cardNumber, cardExpiry, cardCvc, cardHolder);
      if (!cardResult.isValid) {
        setFormError(cardResult.errorMessage || 'Invalid credit/debit card information.');
        return;
      }
    } else if (selectedMethod === 'mobile_wallet') {
      const walletResult = validatePakistaniMobileWallet(mobileNumber, walletCnic, walletProvider);
      if (!walletResult.isValid) {
        setFormError(walletResult.errorMessage || 'Invalid mobile wallet credentials.');
        return;
      }
    } else if (selectedMethod === 'bank_transfer') {
      const bankResult = validateBankReference(bankDepositRef);
      if (!bankResult.isValid) {
        setFormError(bankResult.errorMessage || 'Invalid bank transaction reference ID.');
        return;
      }
    }

    // Begin simulated 256-bit encrypted gateway processing
    setIsProcessing(true);
    setProcessingStep('Connecting to secure banking payment gateway (256-bit SSL)...');

    setTimeout(() => {
      setProcessingStep('Validating card authenticity with payment network...');
    }, 900);

    setTimeout(() => {
      setProcessingStep('Fraud telemetry check passed (Luhn Verified). Approving transaction...');
    }, 1800);

    setTimeout(() => {
      const generatedTx = 'CS-PAY-' + Math.floor(100000 + Math.random() * 900000);
      setTransactionId(generatedTx);
      setPaymentTimestamp(new Date().toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }));
      setIsProcessing(false);
      setPaymentSuccess(true);
      
      // Permanently mark course as enrolled & paid in persistence
      onEnrollSuccess(selectedCourse.id);
    }, 2700);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#091120] border border-cyan-500/40 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950/95 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white font-mono uppercase tracking-wider">
                Secure Checkout & Payment Portal
              </h3>
              <p className="text-[10px] font-mono text-slate-400">
                CyberShield Official Student Enrollment • SSL 256-Bit Encrypted
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {paymentSuccess ? (
            /* PAYMENT RECEIPT & SUCCESS VIEW */
            <div className="space-y-5 text-center py-2 animate-in fade-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.3)]">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                  Payment Approved & Authenticated
                </span>
                <h4 className="text-xl font-bold text-white mt-2">
                  Official Course Enrollment Confirmed
                </h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto mt-1">
                  Your payment has been successfully cleared. Full lifetime access to lectures, virtual lab containers, playbooks, and accreditation certificate is now active.
                </p>
              </div>

              {/* Official Itemized Electronic Invoice & Receipt */}
              <div className="rounded-xl bg-slate-950 border border-slate-800 text-left font-mono overflow-hidden max-w-xl mx-auto shadow-2xl">
                <div className="p-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-cyan-400" />
                    <span className="font-bold text-white uppercase tracking-wider">Official Invoice & Receipt</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {paymentTimestamp || new Date().toLocaleDateString()}
                  </div>
                </div>

                <div className="p-4 space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-800/80 text-[11px]">
                    <div>
                      <span className="text-slate-400 block">Transaction Reference:</span>
                      <span className="text-cyan-400 font-bold">{transactionId}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Payment Method:</span>
                      <span className="text-white font-medium uppercase">
                        {selectedMethod === 'card' ? 'Visa / MasterCard' : selectedMethod === 'mobile_wallet' ? walletProvider.toUpperCase() : 'Meezan Bank Wire'}
                      </span>
                    </div>
                  </div>

                  {/* 5-ITEM ITEMIZED BREAKDOWN: Course, Price, Discount, Tax / Fees, Total */}
                  <div className="space-y-2.5 pt-1">
                    <div className="flex items-start justify-between gap-4 py-1.5 border-b border-slate-800/60">
                      <div>
                        <span className="text-slate-400 block text-[11px] uppercase tracking-wider">Course:</span>
                        <span className="text-white font-bold text-sm block">{selectedCourse.title}</span>
                        <span className="text-[10px] text-cyan-300/80">
                          {selectedCourse.category} • {selectedCourse.modulesCount} Chapters • Lifetime License
                        </span>
                      </div>
                      <div className="text-right text-slate-300 flex-shrink-0 text-xs font-semibold">
                        PKR {originalPKR.toLocaleString()}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-slate-300 text-xs py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">Price:</span>
                      <span className="text-white font-mono font-medium">
                        PKR {originalPKR.toLocaleString()} <span className="text-slate-400 text-[11px]">(${originalUSD} USD)</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">
                        Discount {appliedPromoCode ? `(${appliedPromoCode} - ${discountPercent}%)` : ''}:
                      </span>
                      <span className={discountAmountPKR > 0 ? "text-emerald-400 font-bold font-mono" : "text-slate-400 font-mono"}>
                        {discountAmountPKR > 0 ? `-PKR ${discountAmountPKR.toLocaleString()} (-$${discountAmountUSD} USD)` : 'PKR 0 (0%)'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs py-1 border-b border-slate-800/60">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <span>Tax / Fees:</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                          100% Subsidized
                        </span>
                      </div>
                      <span className="text-slate-300 font-mono">
                        PKR 0.00 <span className="text-slate-500 text-[11px]">($0.00 USD)</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 text-sm font-bold">
                      <span className="text-cyan-400 uppercase tracking-wider">Total:</span>
                      <span className="text-emerald-400 text-base font-extrabold font-mono">
                        PKR {finalPricePKR.toLocaleString()} <span className="text-xs text-slate-300 font-normal">(${finalPriceUSD} USD)</span>
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800">
                    <span>Enrollment State:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified & Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handlePrintReceipt}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-mono font-semibold text-slate-300 bg-slate-900 border border-slate-700 hover:bg-slate-800 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Printer className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Print / Save Receipt</span>
                </button>

                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-mono text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
                >
                  <span>Start Learning Course Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* PAYMENT CHECKOUT FORM */
            <div className="space-y-6">
              
              {/* Course Selection Dropdown (if user wants to view/enroll in another course) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider">
                    Select Target Course:
                  </label>
                  <span className="text-[10px] font-mono text-cyan-400">
                    Lifetime License & Labs
                  </span>
                </div>
                <select
                  value={selectedCourse.id}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  {COURSES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} — PKR {c.pricePKR.toLocaleString()} (${c.priceUSD} USD)
                    </option>
                  ))}
                </select>
              </div>

              {/* ITEMIZED BILLING BREAKDOWN TABLE: Course, Price, Discount, Tax / Fees, Total */}
              <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden font-mono shadow-md">
                <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <FileCheck2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Tuition & Fees Breakdown</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/20">
                    Live Rates (PKR & USD)
                  </span>
                </div>

                <div className="p-4 space-y-2.5 text-xs">
                  {/* Row 1: Course */}
                  <div className="flex items-start justify-between gap-4 pb-2 border-b border-slate-800/70">
                    <div className="space-y-0.5">
                      <div className="text-[10px] uppercase text-slate-400">Course:</div>
                      <div className="font-bold text-white text-sm line-clamp-1">
                        {selectedCourse.title}
                      </div>
                      <div className="text-[10px] text-cyan-400/80 flex items-center gap-2">
                        <span>{selectedCourse.category}</span>
                        <span>•</span>
                        <span>{selectedCourse.modulesCount} Modules</span>
                        <span>•</span>
                        <span className="text-emerald-400">Complete Practical Labs</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 text-slate-300 font-bold">
                      PKR {originalPKR.toLocaleString()}
                    </div>
                  </div>

                  {/* Row 2: Price */}
                  <div className="flex items-center justify-between py-1 border-b border-slate-800/70">
                    <span className="text-slate-400">Price:</span>
                    <span className="text-white font-medium">
                      PKR {originalPKR.toLocaleString()} <span className="text-slate-400 text-[11px]">(${originalUSD} USD)</span>
                    </span>
                  </div>

                  {/* Row 3: Discount */}
                  <div className="flex items-center justify-between py-1 border-b border-slate-800/70">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Discount:</span>
                      {appliedPromoCode && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                          {appliedPromoCode} ({discountPercent}% OFF)
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={discountAmountPKR > 0 ? "text-emerald-400 font-bold" : "text-slate-400"}>
                        {discountAmountPKR > 0 ? `-PKR ${discountAmountPKR.toLocaleString()} (-$${discountAmountUSD} USD)` : 'PKR 0 (0%)'}
                      </span>
                      {appliedPromoCode && (
                        <button
                          type="button"
                          onClick={removeDiscount}
                          className="text-[10px] text-red-400 hover:text-red-300 underline cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Row 4: Tax / Fees */}
                  <div className="flex items-center justify-between py-1 border-b border-slate-800/70">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400">Tax / Fees:</span>
                      <span className="text-[10px] text-slate-400">
                        (PST/GST & Payment Gateway)
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/20">
                        Waived
                      </span>
                      <span className="text-slate-300">
                        PKR 0.00 <span className="text-slate-500 text-[11px]">($0.00 USD)</span>
                      </span>
                    </div>
                  </div>

                  {/* Row 5: Total */}
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">Total:</span>
                      <span className="text-[10px] text-slate-400 font-normal">All-inclusive final payable</span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg sm:text-xl font-extrabold text-cyan-300 font-mono">
                        PKR {finalPricePKR.toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-400 font-mono">
                        (${finalPriceUSD} USD)
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coupon / Fellowship Code Field with Quick One-Click Chips */}
              <div className="space-y-2">
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter Promo Code (e.g. CYBERSHIELD20)"
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white uppercase font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-white border border-slate-700 transition-colors cursor-pointer"
                  >
                    Apply Code
                  </button>
                </form>

                {/* Quick 1-click promo code chips */}
                <div className="flex items-center gap-2 flex-wrap text-[11px] font-mono">
                  <span className="text-slate-400">Available Coupons:</span>
                  <button
                    type="button"
                    onClick={() => applyCode('CYBERSHIELD20')}
                    className="px-2 py-0.5 rounded bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/30 text-cyan-300 cursor-pointer transition-colors"
                  >
                    CYBERSHIELD20 (20% Off)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyCode('STUDENT50')}
                    className="px-2 py-0.5 rounded bg-amber-950/60 hover:bg-amber-900/80 border border-amber-500/30 text-amber-300 cursor-pointer transition-colors"
                  >
                    STUDENT50 (50% Off)
                  </button>
                </div>

                {promoMessage && (
                  <p className="text-xs font-mono text-emerald-400 mt-1">{promoMessage}</p>
                )}
              </div>

              {/* Step 2: Payment Method Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider">
                  Select Payment Method:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('card')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      selectedMethod === 'card'
                        ? 'bg-cyan-950/40 border-cyan-400 text-white shadow-md'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <CreditCard className={`w-4 h-4 ${selectedMethod === 'card' ? 'text-cyan-400' : 'text-slate-500'}`} />
                      {selectedMethod === 'card' && <div className="w-2 h-2 rounded-full bg-cyan-400" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold font-mono">Credit/Debit</div>
                      <div className="text-[10px] text-slate-400">Visa / Master</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('mobile_wallet')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      selectedMethod === 'mobile_wallet'
                        ? 'bg-cyan-950/40 border-cyan-400 text-white shadow-md'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Smartphone className={`w-4 h-4 ${selectedMethod === 'mobile_wallet' ? 'text-cyan-400' : 'text-slate-500'}`} />
                      {selectedMethod === 'mobile_wallet' && <div className="w-2 h-2 rounded-full bg-cyan-400" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold font-mono">Mobile Wallet</div>
                      <div className="text-[10px] text-slate-400">Easypaisa / JazzCash</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('bank_transfer')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      selectedMethod === 'bank_transfer'
                        ? 'bg-cyan-950/40 border-cyan-400 text-white shadow-md'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Building2 className={`w-4 h-4 ${selectedMethod === 'bank_transfer' ? 'text-cyan-400' : 'text-slate-500'}`} />
                      {selectedMethod === 'bank_transfer' && <div className="w-2 h-2 rounded-full bg-cyan-400" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold font-mono">Bank / Raast</div>
                      <div className="text-[10px] text-slate-400">Direct Wire Transfer</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Form by Selected Payment Method */}
              <form onSubmit={handleExecutePayment} className="space-y-4">
                
                {/* Method 1: Credit / Debit Card */}
                {selectedMethod === 'card' && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-300 font-semibold">Card Details</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                          Luhn MOD-10 Validated
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowSandboxCards(!showSandboxCards)}
                        className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 underline flex items-center gap-1 cursor-pointer"
                      >
                        <HelpCircle className="w-3 h-3" />
                        <span>{showSandboxCards ? 'Hide Sandbox Cards' : 'View Sandbox Test Cards'}</span>
                      </button>
                    </div>

                    {showSandboxCards && (
                      <div className="p-3 rounded-lg bg-[#0c1626] border border-cyan-500/30 text-xs font-mono space-y-2">
                        <div className="text-[11px] text-cyan-300 font-bold flex items-center justify-between">
                          <span>Sandbox Test Card Numbers (Passes Strict Luhn Check):</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {TEST_CARDS.map((tc) => (
                            <div key={tc.number} className="p-2 rounded bg-slate-950/80 border border-slate-800 text-[11px] flex flex-col justify-between gap-1">
                              <div>
                                <span className="text-cyan-400 font-bold">{tc.brand}: </span>
                                <span className="text-white tracking-wider">{tc.number}</span>
                              </div>
                              <div className="text-slate-400 text-[10px]">
                                Exp: {tc.expiry} • CVV: {tc.cvv}
                              </div>
                              <button
                                type="button"
                                onClick={() => handleFillTestCard(tc)}
                                className="mt-1 w-full py-1 px-2 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold cursor-pointer transition-colors"
                              >
                                Autofill {tc.brand}
                              </button>
                            </div>
                          ))}
                        </div>
                        <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                          ⚠️ Note: Random numbers or unverified test values will fail the automated Luhn checksum and will be rejected.
                        </p>
                      </div>
                    )}

                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">
                        Cardholder Name (as shown on card)
                      </label>
                      <input
                        type="text"
                        required
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        placeholder="e.g. Muhammad Zaib Zafar"
                        className="w-full px-3 py-2 bg-[#060c17] border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1 flex justify-between">
                        <span>Card Number</span>
                        <span className="text-slate-500">16 digits (Visa: 4... / MC: 5...)</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4242 4242 4242 4242"
                        className="w-full px-3 py-2 bg-[#060c17] border border-slate-800 rounded-lg text-xs text-white font-mono tracking-wider focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 mb-1">
                          Expiry Date (MM/YY)
                        </label>
                        <input
                          type="text"
                          required
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY (e.g. 12/28)"
                          className="w-full px-3 py-2 bg-[#060c17] border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 mb-1">
                          CVC / CVV
                        </label>
                        <input
                          type="password"
                          required
                          maxLength={4}
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          placeholder="883"
                          className="w-full px-3 py-2 bg-[#060c17] border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Method 2: Mobile Wallet (Easypaisa / JazzCash / Raast) */}
                {selectedMethod === 'mobile_wallet' && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setWalletProvider('easypaisa')}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                          walletProvider === 'easypaisa'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                            : 'bg-slate-900 text-slate-400'
                        }`}
                      >
                        Easypaisa
                      </button>
                      <button
                        type="button"
                        onClick={() => setWalletProvider('jazzcash')}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                          walletProvider === 'jazzcash'
                            ? 'bg-amber-950 text-amber-300 border border-amber-500/50'
                            : 'bg-slate-900 text-slate-400'
                        }`}
                      >
                        JazzCash
                      </button>
                      <button
                        type="button"
                        onClick={() => setWalletProvider('raast')}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                          walletProvider === 'raast'
                            ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50'
                            : 'bg-slate-900 text-slate-400'
                        }`}
                      >
                        Raast ID
                      </button>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">
                        Mobile Wallet Account Number (03XX-XXXXXXX)
                      </label>
                      <input
                        type="text"
                        required
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        placeholder="0300-1234567"
                        className="w-full px-3 py-2 bg-[#060c17] border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">
                        Account Holder CNIC (for 3D-Secure mobile push prompt)
                      </label>
                      <input
                        type="text"
                        required
                        value={walletCnic}
                        onChange={(e) => setWalletCnic(e.target.value)}
                        placeholder="35201-1234567-1"
                        className="w-full px-3 py-2 bg-[#060c17] border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <p className="text-[11px] font-mono text-slate-400 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                      ⚡ After clicking "Pay", you will receive a prompt on your phone or mobile banking app to approve the tuition fee of PKR {finalPricePKR.toLocaleString()}.
                    </p>
                  </div>
                )}

                {/* Method 3: Bank Transfer / Raast Direct Wire */}
                {selectedMethod === 'bank_transfer' && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="text-xs font-mono text-slate-300 font-semibold pb-1 border-b border-slate-800">
                      Official CyberShield Pakistan Bank Details
                    </div>

                    <div className="p-3 rounded-lg bg-[#060c17] border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1">
                      <div><span className="text-slate-500">Bank:</span> Meezan Bank Ltd (Islamic Banking)</div>
                      <div><span className="text-slate-500">Account Title:</span> CyberShield PK Security Education</div>
                      <div><span className="text-slate-500">IBAN:</span> <span className="text-cyan-300">PK78MEZN0001002345678901</span></div>
                      <div><span className="text-slate-500">Branch:</span> Lahore Corporate Center</div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">
                        Deposit Slip / Transaction Reference Number (TID)
                      </label>
                      <input
                        type="text"
                        required
                        value={bankDepositRef}
                        onChange={(e) => setBankDepositRef(e.target.value)}
                        placeholder="e.g. MEZN-TX-8829104"
                        className="w-full px-3 py-2 bg-[#060c17] border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                )}

                {/* Error Banner */}
                {formError && (
                  <div className="p-2.5 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-mono flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Processing State */}
                {isProcessing && (
                  <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-center space-y-2">
                    <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs font-mono text-cyan-300 animate-pulse">
                      {processingStep}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`w-full py-3 px-4 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2 ${
                    isProcessing
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 hover:from-cyan-300 hover:to-blue-300 shadow-[0_0_20px_rgba(0,240,255,0.3)]'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    Authorize & Pay PKR {finalPricePKR.toLocaleString()} (${finalPriceUSD} USD)
                  </span>
                </button>

                <p className="text-[11px] font-mono text-slate-500 text-center flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>7-Day Full Money Back Guarantee • Encrypted Checkout</span>
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
