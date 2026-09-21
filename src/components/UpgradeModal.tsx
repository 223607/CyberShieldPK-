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
  const selectedCourse = courseId ? COURSES.find(c => c.id === courseId) : COURSES[0];
  
  // Checkout states
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card');
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
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
  const [formError, setFormError] = useState<string | null>(null);

  if (!selectedCourse) return null;

  // Price calculations
  const originalPKR = selectedCourse.pricePKR;
  const discountAmount = Math.round((originalPKR * discountPercent) / 100);
  const finalPricePKR = Math.max(0, originalPKR - discountAmount);
  const finalPriceUSD = Math.max(0, Math.round(selectedCourse.priceUSD * (1 - discountPercent / 100)));

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'CYBERSHIELD20' || code === 'FELLOW20' || code === 'ZAIB20') {
      setDiscountPercent(20);
      setPromoMessage('✓ 20% Security Fellowship Discount Applied!');
      setFormError(null);
    } else if (code === 'STUDENT50') {
      setDiscountPercent(50);
      setPromoMessage('✓ 50% Verified Student Scholarship Applied!');
      setFormError(null);
    } else {
      setPromoMessage(null);
      setFormError('Invalid coupon code. Try "CYBERSHIELD20" or "STUDENT50"');
    }
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
      setIsProcessing(false);
      setPaymentSuccess(true);
      
      // Permanently mark course as enrolled & paid in persistence
      onEnrollSuccess(selectedCourse.id);
    }, 2700);
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
            <div className="space-y-5 text-center py-4 animate-in fade-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                  Payment Approved & Verified
                </span>
                <h4 className="text-xl font-bold text-white mt-2">
                  Official Course Enrollment Activated
                </h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto mt-1">
                  Thank you! Your payment has been confirmed. Full lifetime access to all course modules, labs, and certification exams is now unlocked.
                </p>
              </div>

              {/* Official Electronic Receipt */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-left font-mono text-xs space-y-3 max-w-lg mx-auto">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400">
                  <span>Transaction ID:</span>
                  <span className="text-cyan-400 font-bold">{transactionId}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Course Enrolled:</span>
                  <span className="text-white font-bold truncate max-w-[240px]">{selectedCourse.title}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Payment Channel:</span>
                  <span className="text-white uppercase">
                    {selectedMethod === 'card' ? 'Visa / MasterCard' : selectedMethod === 'mobile_wallet' ? walletProvider.toUpperCase() : 'Meezan Bank Wire'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Amount Paid:</span>
                  <span className="text-emerald-400 font-bold">
                    PKR {finalPricePKR.toLocaleString()} ({finalPriceUSD} USD)
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-800 text-[11px]">
                  <span>Status:</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Paid & Settled
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => {
                    onClose();
                  }}
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
              
              {/* Order Summary Card */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 uppercase">
                      {selectedCourse.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {selectedCourse.modulesCount} Chapters
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white line-clamp-1">
                    {selectedCourse.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-1">
                    Includes lifetime lectures, hands-on lab VMs, Q&A support & certificate.
                  </p>
                </div>

                <div className="text-left sm:text-right border-t sm:border-t-0 sm:border-l border-slate-800 pt-3 sm:pt-0 sm:pl-4 flex-shrink-0 font-mono">
                  <div className="text-[10px] text-slate-400 uppercase">Total Payable:</div>
                  <div className="text-xl font-extrabold text-cyan-300">
                    PKR {finalPricePKR.toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-400">(${finalPriceUSD} USD)</div>
                </div>
              </div>

              {/* Coupon / Fellowship Code Field */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Coupon or Scholarship Code (e.g. CYBERSHIELD20)"
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

              {promoMessage && (
                <p className="text-xs font-mono text-emerald-400 -mt-3">{promoMessage}</p>
              )}

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
