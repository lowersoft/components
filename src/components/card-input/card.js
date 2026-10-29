// Card numbers: brand detection, grouping and the Luhn checksum.

/** The brands told apart by their number prefix, in the order of the brand reel. */
export const BRANDS = {
  visa: { label: 'Visa', pattern: /^4/, lengths: [13, 16, 19], groups: [4, 4, 4, 4, 3], cvc: 3 },
  mastercard: { label: 'Mastercard', pattern: /^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/, lengths: [16], groups: [4, 4, 4, 4], cvc: 3 },
  amex: { label: 'American Express', pattern: /^3[47]/, lengths: [15], groups: [4, 6, 5], cvc: 4 },
  discover: { label: 'Discover', pattern: /^(6011|65|64[4-9]|622)/, lengths: [16, 19], groups: [4, 4, 4, 4, 3], cvc: 3 },
};

// An unknown number is grouped like most cards until its brand shows.
const UNKNOWN = { lengths: [16], groups: [4, 4, 4, 4], cvc: 3 };

export const brandOf = (digits) => Object.keys(BRANDS).find((key) => BRANDS[key].pattern.test(digits)) ?? null;

export const specOf = (brand) => BRANDS[brand] ?? UNKNOWN;

export const maxLength = (brand) => Math.max(...specOf(brand).lengths);

/** "4242424242424242" -> "4242 4242 4242 4242", by the brand's groups. */
export const formatNumber = (digits, brand) => {
  const parts = [];
  let rest = digits;
  for (const size of specOf(brand).groups) {
    if (!rest) break;
    parts.push(rest.slice(0, size));
    rest = rest.slice(size);
  }
  return parts.join(' ');
};

/** The Luhn checksum every card number carries in its last digit. */
export const luhn = (digits) => {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let digit = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return digits.length > 0 && sum % 10 === 0;
};
