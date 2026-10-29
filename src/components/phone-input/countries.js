// Countries by ISO code: dialling code, national format (`#` is a digit,
// written without the trunk 0) and, where known, what a mobile number looks
// like there. Elsewhere a complete number is taken as one that can get a text.

// Formats and mobile patterns for the countries most numbers come from.
const DETAILED = {
  US: { dial: '1', mask: '(###) ###-####', mobile: /^[2-9]\d{2}[2-9]\d{6}$/ },
  CA: { dial: '1', mask: '(###) ###-####', mobile: /^[2-9]\d{2}[2-9]\d{6}$/ },
  GB: { dial: '44', mask: '#### ######', mobile: /^7\d{9}$/ },
  TR: { dial: '90', mask: '### ### ## ##', mobile: /^5\d{9}$/ },
  DE: { dial: '49', mask: '### ########', mobile: /^1[5-7]\d{9}$/ },
  FR: { dial: '33', mask: '# ## ## ## ##', mobile: /^[67]\d{8}$/ },
  ES: { dial: '34', mask: '### ### ###', mobile: /^[67]\d{8}$/ },
  IT: { dial: '39', mask: '### ### ####', mobile: /^3\d{9}$/ },
  NL: { dial: '31', mask: '# ## ## ## ##', mobile: /^6\d{8}$/ },
  IN: { dial: '91', mask: '##### #####', mobile: /^[6-9]\d{9}$/ },
  BR: { dial: '55', mask: '(##) #####-####', mobile: /^\d{2}9\d{8}$/ },
  JP: { dial: '81', mask: '##-####-####', mobile: /^[789]0\d{8}$/ },
  AU: { dial: '61', mask: '### ### ###', mobile: /^4\d{8}$/ },
  MX: { dial: '52', mask: '## #### ####', mobile: /^\d{10}$/ },
};

// Everywhere else: code, name, dialling code, the length of a mobile number
// and, for a code shared with another country, how its numbers start.
// Caribbean numbers carry their area code in the dialling code instead.
// Kazakhstan shares +7 with Russia; its numbers start with 6 or 7.
const TABLE = `AF|Afghanistan|93|9 AL|Albania|355|9 DZ|Algeria|213|9 AD|Andorra|376|6 AO|Angola|244|9 AR|Argentina|54|10
AM|Armenia|374|8 AU|Australia AT|Austria|43|10 AZ|Azerbaijan|994|9 BS|Bahamas|1242|7 BH|Bahrain|973|8 BD|Bangladesh|880|10
BB|Barbados|1246|7 BY|Belarus|375|9 BE|Belgium|32|9 BZ|Belize|501|7 BJ|Benin|229|10 BT|Bhutan|975|8 BO|Bolivia|591|8
BA|Bosnia and Herzegovina|387|8 BW|Botswana|267|8 BR|Brazil BN|Brunei|673|7 BG|Bulgaria|359|9 BF|Burkina Faso|226|8
BI|Burundi|257|8 KH|Cambodia|855|9 CM|Cameroon|237|9 CA|Canada CV|Cape Verde|238|7 CF|Central African Republic|236|8
TD|Chad|235|8 CL|Chile|56|9 CN|China|86|11 CO|Colombia|57|10 KM|Comoros|269|7 CG|Congo|242|9 CD|Congo (DRC)|243|9
CR|Costa Rica|506|8 CI|Côte d’Ivoire|225|10 HR|Croatia|385|9 CU|Cuba|53|8 CY|Cyprus|357|8 CZ|Czechia|420|9 DK|Denmark|45|8
DJ|Djibouti|253|8 DO|Dominican Republic|1809|7 EC|Ecuador|593|9 EG|Egypt|20|10 SV|El Salvador|503|8
GQ|Equatorial Guinea|240|9 ER|Eritrea|291|7 EE|Estonia|372|8 SZ|Eswatini|268|8 ET|Ethiopia|251|9 FJ|Fiji|679|7
FI|Finland|358|9 FR|France GA|Gabon|241|8 GM|Gambia|220|7 GE|Georgia|995|9 DE|Germany GH|Ghana|233|9 GR|Greece|30|10
GT|Guatemala|502|8 GN|Guinea|224|9 GW|Guinea-Bissau|245|9 GY|Guyana|592|7 HT|Haiti|509|8 HN|Honduras|504|8
HK|Hong Kong|852|8 HU|Hungary|36|9 IS|Iceland|354|7 IN|India ID|Indonesia|62|10 IR|Iran|98|10 IQ|Iraq|964|10
IE|Ireland|353|9 IL|Israel|972|9 IT|Italy JM|Jamaica|1876|7 JP|Japan JO|Jordan|962|9 KZ|Kazakhstan|7|10|[67] KE|Kenya|254|9
KW|Kuwait|965|8 KG|Kyrgyzstan|996|9 LA|Laos|856|10 LV|Latvia|371|8 LB|Lebanon|961|8 LS|Lesotho|266|8 LR|Liberia|231|9
LY|Libya|218|9 LI|Liechtenstein|423|7 LT|Lithuania|370|8 LU|Luxembourg|352|9 MO|Macao|853|8 MG|Madagascar|261|9
MW|Malawi|265|9 MY|Malaysia|60|9 MV|Maldives|960|7 ML|Mali|223|8 MT|Malta|356|8 MR|Mauritania|222|8 MU|Mauritius|230|8
MX|Mexico MD|Moldova|373|8 MC|Monaco|377|8 MN|Mongolia|976|8 ME|Montenegro|382|8 MA|Morocco|212|9 MZ|Mozambique|258|9
MM|Myanmar|95|9 NA|Namibia|264|9 NP|Nepal|977|10 NL|Netherlands NZ|New Zealand|64|9 NI|Nicaragua|505|8 NE|Niger|227|8
NG|Nigeria|234|10 KP|North Korea|850|10 MK|North Macedonia|389|8 NO|Norway|47|8 OM|Oman|968|8 PK|Pakistan|92|10
PS|Palestine|970|9 PA|Panama|507|8 PG|Papua New Guinea|675|8 PY|Paraguay|595|9 PE|Peru|51|9 PH|Philippines|63|10
PL|Poland|48|9 PT|Portugal|351|9 PR|Puerto Rico|1787|7 QA|Qatar|974|8 RO|Romania|40|9 RU|Russia|7|10 RW|Rwanda|250|9
SA|Saudi Arabia|966|9 SN|Senegal|221|9 RS|Serbia|381|9 SC|Seychelles|248|7 SL|Sierra Leone|232|8 SG|Singapore|65|8
SK|Slovakia|421|9 SI|Slovenia|386|8 SO|Somalia|252|9 ZA|South Africa|27|9 KR|South Korea|82|10 SS|South Sudan|211|9
ES|Spain LK|Sri Lanka|94|9 SD|Sudan|249|9 SR|Suriname|597|7 SE|Sweden|46|9 CH|Switzerland|41|9 SY|Syria|963|9
TW|Taiwan|886|9 TJ|Tajikistan|992|9 TZ|Tanzania|255|9 TH|Thailand|66|9 TG|Togo|228|8 TT|Trinidad and Tobago|1868|7
TN|Tunisia|216|8 TR|Türkiye TM|Turkmenistan|993|8 UG|Uganda|256|9 UA|Ukraine|380|9 AE|United Arab Emirates|971|9
GB|United Kingdom US|United States UY|Uruguay|598|8 UZ|Uzbekistan|998|9 VE|Venezuela|58|10 VN|Vietnam|84|9 YE|Yemen|967|9
ZM|Zambia|260|9 ZW|Zimbabwe|263|9`;

// Groups of three and four, the way most numbers are read out.
const GROUPS = { 6: '### ###', 7: '### ####', 8: '#### ####', 9: '### ### ###', 10: '### ### ####', 11: '### #### ####' };

/** All countries by ISO code, in alphabetical order of name. */
export const COUNTRIES = Object.fromEntries(
  TABLE.split(/\s+(?=[A-Z]{2}\|)/).map((row) => {
    const [code, name, dial, length, lead] = row.trim().split('|');
    return [code, { name, ...(DETAILED[code] ?? { dial, mask: GROUPS[length], mobile: null }), lead: lead ? new RegExp(`^${lead}`) : null }];
  }),
);

/** The country's flag, from the regional indicator letters of its code. */
export const flagOf = (code) => String.fromCodePoint(...[...code].map((letter) => 0x1f1a5 + letter.charCodeAt(0)));

export const slotsOf = (mask) => mask.replace(/[^#]/g, '').length;

/**
 * Lays `digits` into a mask. Returns what is filled (`typed`) and the faint
 * rest still to come (`rest`), drawn with a sample digit per slot.
 */
export const fillMask = (mask, digits) => {
  let typed = '';
  let rest = '';
  let used = 0;
  for (const char of mask) {
    if (used < digits.length) {
      if (char === '#') typed += digits[used++];
      else typed += char;
    } else {
      rest += char === '#' ? '0' : char;
    }
  }
  // Separators wait for the digit after them.
  const trimmed = typed.replace(/[^\d]+$/, '');
  return { typed: trimmed, rest: typed.slice(trimmed.length) + rest };
};

/**
 * Reads an international number, "+44 7700 900123" or "0044…": the country
 * whose code it starts with (longest code first; a shared code keeps the
 * current country) and the national digits after it.
 */
export const parseInternational = (text, current) => {
  // "+44 (0)7700…": the trunk 0 in brackets is dropped.
  const digits = text.trim().replace(/^00/, '+').replace('(0)', '').replace(/[^\d+]/g, '');
  if (!digits.startsWith('+')) return null;
  const rest = digits.slice(1);
  const matches = Object.entries(COUNTRIES)
    .filter(([, { dial }]) => rest.startsWith(dial))
    .sort(([, a], [, b]) => b.dial.length - a.dial.length);
  if (matches.length === 0) return null;
  const dial = matches[0][1].dial;
  const digitsAfter = rest.slice(dial.length);
  // A shared code goes by how the number starts, then keeps the current
  // country, then falls to the main one: the US for +1, Russia for +7.
  const sharing = matches.filter(([, country]) => country.dial === dial);
  const led = sharing.find(([, country]) => country.lead?.test(digitsAfter));
  const plain = sharing.filter(([, country]) => !country.lead).map(([code]) => code);
  const code = led?.[0] ?? (plain.includes(current) ? current : plain.includes('US') ? 'US' : (plain[0] ?? sharing[0][0]));
  return { code, digits: digitsAfter };
};

/** "1876" -> "+1 876": a Caribbean area code reads apart from the +1. */
export const dialLabel = (dial) => (dial.length === 4 && dial.startsWith('1') ? `+1 ${dial.slice(1)}` : `+${dial}`);
