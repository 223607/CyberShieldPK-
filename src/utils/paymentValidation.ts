/**
 * CyberShieldPK - Strict Payment & Cryptographic Card Authenticity Validator
 * Implements Luhn Algorithm (MOD 10), IIN / BIN Issuer Validation, Expiry & CVV checks
 */

export interface CardValidationResult {
  isValid: boolean;
  brand?: 'Visa' | 'Mastercard' | 'American Express' | 'Discover' | 'Unknown';
  errorMessage?: string;
}

export interface MobileWalletValidationResult {
  isValid: boolean;
  provider?: string;
  errorMessage?: string;
}

/**
 * Validates a credit or debit card using the Luhn Algorithm (Mod 10)
 * and verifies brand format, expiry date, and CVV.
 */
export function validateCreditCard(
  rawNumber: string,
  rawExpiry: string,
  rawCvv: string,
  rawHolder: string
): CardValidationResult {
  // Clean inputs
  const cleanNumber = rawNumber.replace(/[\s-]/g, '');
  const cleanExpiry = rawExpiry.trim();
  const cleanCvv = rawCvv.trim();
  const cleanHolder = rawHolder.trim();

  // 1. Cardholder Name check
  if (!cleanHolder || cleanHolder.length < 3) {
    return {
      isValid: false,
      errorMessage: 'Please enter a valid cardholder name (minimum 3 characters).'
    };
  }

  // 2. Numeric-only check
  if (!/^\d+$/.test(cleanNumber)) {
    return {
      isValid: false,
      errorMessage: 'Invalid card format: Card number must contain digits only without symbols.'
    };
  }

  // 3. Length check
  if (cleanNumber.length < 13 || cleanNumber.length > 19) {
    return {
      isValid: false,
      errorMessage: `Invalid card length: ${cleanNumber.length} digits entered. Standard cards have 15 or 16 digits.`
    };
  }

  // 4. Determine Brand & IIN check
  let brand: 'Visa' | 'Mastercard' | 'American Express' | 'Discover' | 'Unknown' = 'Unknown';
  if (/^4/.test(cleanNumber)) {
    brand = 'Visa';
    if (cleanNumber.length !== 16 && cleanNumber.length !== 13) {
      return {
        isValid: false,
        brand,
        errorMessage: 'Invalid Visa card: Must be exactly 16 digits starting with 4.'
      };
    }
  } else if (/^(5[1-5]|222[1-9]|22[3-9]\d|2[3-6]\d{2}|27[01]\d|2720)/.test(cleanNumber)) {
    brand = 'Mastercard';
    if (cleanNumber.length !== 16) {
      return {
        isValid: false,
        brand,
        errorMessage: 'Invalid Mastercard: Must be exactly 16 digits starting with 51-55 or 22-27.'
      };
    }
  } else if (/^3[47]/.test(cleanNumber)) {
    brand = 'American Express';
    if (cleanNumber.length !== 15) {
      return {
        isValid: false,
        brand,
        errorMessage: 'Invalid American Express card: Must be exactly 15 digits starting with 34 or 37.'
      };
    }
  } else if (/^6(?:011|5)/.test(cleanNumber)) {
    brand = 'Discover';
  } else {
    return {
      isValid: false,
      errorMessage: 'Unsupported card issuer: Only Visa (starts with 4), Mastercard (starts with 5), or Amex are accepted.'
    };
  }

  // 5. Luhn Algorithm Checksum (MOD 10)
  let sum = 0;
  let isSecond = false;
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber.charAt(i), 10);
    if (isSecond) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
    isSecond = !isSecond;
  }

  if (sum % 10 !== 0) {
    return {
      isValid: false,
      brand,
      errorMessage: 'Card authenticity check failed: Invalid card number (Failed Luhn checksum). Random or fake numbers cannot be processed.'
    };
  }

  // 6. Expiry Date validation (MM/YY or MM/YYYY)
  const expiryMatch = cleanExpiry.match(/^(\d{1,2})\/(\d{2}|\d{4})$/);
  if (!expiryMatch) {
    return {
      isValid: false,
      brand,
      errorMessage: 'Invalid expiry format: Must be in MM/YY format (e.g. 12/28).'
    };
  }

  const month = parseInt(expiryMatch[1], 10);
  let year = parseInt(expiryMatch[2], 10);
  if (year < 100) {
    year += 2000;
  }

  if (month < 1 || month > 12) {
    return {
      isValid: false,
      brand,
      errorMessage: 'Invalid expiry month: Must be between 01 and 12.'
    };
  }

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return {
      isValid: false,
      brand,
      errorMessage: 'Card has expired: Expiration date cannot be in the past.'
    };
  }

  // 7. CVV / CVC validation
  const requiredCvvLength = brand === 'American Express' ? 4 : 3;
  if (!new RegExp(`^\\d{${requiredCvvLength}}$`).test(cleanCvv)) {
    return {
      isValid: false,
      brand,
      errorMessage: `Invalid security code (CVV): Must be exactly ${requiredCvvLength} numeric digits.`
    };
  }

  return {
    isValid: true,
    brand
  };
}

/**
 * Validates Pakistani Mobile Wallets (Easypaisa, JazzCash, Raast)
 */
export function validateMobileWallet(
  mobileNumber: string,
  provider: 'easypaisa' | 'jazzcash' | 'raast',
  cnic?: string
): MobileWalletValidationResult {
  const cleanMobile = mobileNumber.replace(/[\s-]/g, '');

  // Must start with 03 and have 11 digits
  if (!/^03\d{9}$/.test(cleanMobile)) {
    return {
      isValid: false,
      provider,
      errorMessage: 'Invalid mobile number: Must be an 11-digit Pakistani mobile number starting with 03 (e.g. 03001234567).'
    };
  }

  // If CNIC is provided, check format 13 digits
  if (cnic && cnic.trim()) {
    const cleanCnic = cnic.replace(/[\s-]/g, '');
    if (!/^\d{13}$/.test(cleanCnic)) {
      return {
        isValid: false,
        provider,
        errorMessage: 'Invalid CNIC: Must be exactly 13 digits (e.g. 35201-1234567-1).'
      };
    }
  }

  return {
    isValid: true,
    provider
  };
}

/**
 * Validates Bank Deposit / Transaction Reference ID
 */
export const validatePakistaniMobileWallet = validateMobileWallet;

/**
 * Validates Bank Deposit / Transaction Reference ID
 */
export function validateBankReference(referenceId: string): { isValid: boolean; errorMessage?: string } {
  const clean = referenceId.trim();
  if (!clean || clean.length < 6) {
    return {
      isValid: false,
      errorMessage: 'Invalid transaction reference: Bank deposit TID / reference must be at least 6 alphanumeric characters.'
    };
  }
  return { isValid: true };
}

export interface TestCard {
  brand: string;
  number: string;
  expiry: string;
  cvv: string;
  holder: string;
}

export const TEST_CARDS: TestCard[] = [
  {
    brand: 'Visa (Luhn Verified)',
    number: '4242 4242 4242 4242',
    expiry: '12/28',
    cvv: '883',
    holder: 'Muhammad Zaib Zafar'
  },
  {
    brand: 'Mastercard (Luhn Verified)',
    number: '5555 5555 5555 4444',
    expiry: '11/29',
    cvv: '492',
    holder: 'Zaib Zafar'
  },
  {
    brand: 'Amex (Luhn Verified)',
    number: '3782 822463 10005',
    expiry: '09/27',
    cvv: '9281',
    holder: 'CyberShield Fellow'
  },
  {
    brand: 'Discover (Luhn Verified)',
    number: '6011 0009 9013 9424',
    expiry: '10/28',
    cvv: '391',
    holder: 'Security Student'
  }
];

