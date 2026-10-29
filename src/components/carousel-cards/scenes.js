// Drawn scenes: flat layers in five tones (`sun`, `far`, `mid`, `near`,
// `sky`), each parallaxing by its own depth, a share of the layer width.

const pines = (xs, base, height) => xs.map((x, i) => `M${x - 5} ${base}L${x} ${base - height - (i % 3) * 4}L${x + 5} ${base}Z`).join('');

const windows = (x, y, cols, rows) => {
  let out = '';
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) if ((r * 7 + c * 3) % 4 !== 0) out += `<rect class="sky" x="${x + c * 7}" y="${y + r * 9}" width="3" height="3"/>`;
  return out;
};

const path = (tone, d) => `<path class="${tone}" d="${d}"/>`;
const sun = (cx, cy, r) => `<circle class="sun" cx="${cx}" cy="${cy}" r="${r}"/>`;

/** Each scene's layers, far to near: `[depth, markup]`. */
export const SCENES = {
  city: [
    [2, sun(150, 56, 16)],
    [4, path('far', 'M0 128Q60 98 120 116T208 106V200H0Z')],
    [7, path('mid', 'M0 152H18V138L26 130L34 138V146H48V128H62V140H76V132L84 124L92 132V150H110V136H126V146H140V126L150 118L160 126V148H176V138H192V150H208V200H0Z')],
    [11, `${path('near', 'M0 180Q104 164 208 178V200H0Z')}${path('near', 'M74 170V152Q74 148 78 148H118Q122 148 122 152V168Z')}<rect class="sky" x="80" y="152" width="8" height="7"/><rect class="sky" x="94" y="152" width="8" height="7"/><rect class="sky" x="108" y="152" width="8" height="7"/>`],
  ],
  mountains: [
    [2, sun(54, 48, 12)],
    [4, `${path('far', 'M0 122L30 92L52 108L84 60L112 100L140 72L172 110L208 86V200H0Z')}${path('sun', 'M74 75L84 60L94 75L88 71L83 77Z')}${path('sun', 'M133 82L140 72L148 82L143 79Z')}`],
    [7, path('mid', 'M0 152L40 118L70 140L104 110L140 146L176 120L208 140V200H0Z')],
    [11, path('near', `M0 182Q60 164 120 174T208 168V200H0Z${pines([18, 30, 42, 162, 176, 190], 178, 20)}`)],
  ],
  dunes: [
    [2, sun(128, 66, 22)],
    [4, path('far', 'M0 128Q50 104 100 124Q150 142 208 112V200H0Z')],
    [7, path('mid', 'M0 158Q70 120 130 150Q170 168 208 146V200H0Z')],
    [11, path('near', 'M0 188Q40 160 96 176Q150 194 208 170V200H0Z')],
  ],
  lake: [
    [2, sun(160, 42, 8)],
    [4, path('far', `M0 142V130H208V142Z${pines([8, 20, 32, 44, 56, 68, 80, 92, 104, 116, 128, 140, 152, 164, 176, 188, 200], 132, 14)}`)],
    [7, `<rect class="mid" x="0" y="142" width="208" height="58"/>${path('sky', 'M40 156H96V158H40ZM120 166H184V168H120ZM24 176H76V178H24Z')}`],
    [11, `${path('near', 'M0 184Q60 172 120 182T208 178V200H0Z')}${path('near', 'M132 180V162L148 148L164 162V180Z')}<rect class="sun" x="145" y="166" width="6" height="6"/>`],
  ],
  islands: [
    [2, sun(52, 54, 14)],
    [4, `<rect class="mid" x="0" y="130" width="208" height="70"/>${path('far', 'M96 131Q130 104 176 126L188 131Z')}${path('far', 'M10 131Q30 120 52 131Z')}`],
    [7, `${path('near', 'M52 160H88L82 167H58Z')}${path('sun', 'M70 157V122L90 157Z')}${path('sky', 'M66 157V130L54 157Z')}${path('far', 'M20 178H60V180H20ZM110 172H170V174H110Z')}`],
    [11, path('near', 'M0 200V182Q20 170 44 180Q60 187 70 200ZM150 200Q170 176 208 176V200Z')],
  ],
  skyline: [
    [2, sun(40, 40, 9)],
    [4, path('far', 'M0 200V120H16V96H30V120H44V80H58V112H76V60H82V40H86V60H92V110H110V90H128V118H150V70H166V112H180V96H196V124H208V200Z')],
    [7, `${path('mid', 'M0 200V140H24V118H50V146H70V108H100V150H120V126H148V134H170V112H196V144H208V200Z')}${windows(74, 116, 3, 4)}${windows(174, 120, 3, 3)}${windows(28, 126, 3, 2)}`],
    [11, path('near', 'M0 170H208V178H0ZM10 178H18V200H10ZM70 178H78V200H70ZM130 178H138V200H130ZM190 178H198V200H190Z')],
  ],
  terraces: [
    [2, sun(104, 58, 15)],
    [4, path('far', 'M0 108Q104 76 208 102V200H0Z')],
    [7, path('mid', 'M0 136Q104 112 208 132V200H0ZM0 148Q104 126 208 146V150Q104 130 0 152ZM0 164Q104 142 208 162V166Q104 146 0 168Z')],
    [11, path('near', 'M0 184Q104 162 208 180V200H0ZM24 184Q20 166 27 148H30Q24 166 28 184ZM28 148Q15 140 6 148Q16 143 28 151ZM28 148Q41 138 51 146Q39 142 28 151ZM28 148Q23 134 12 132Q24 136 29 149ZM28 148Q35 134 45 132Q33 138 29 149Z')],
  ],
  coast: [
    [2, sun(56, 92, 13)],
    [4, `<rect class="mid" x="0" y="112" width="208" height="88"/>${path('far', 'M118 200V122Q150 96 208 98V200Z')}`],
    [7, `${path('near', 'M208 200V128Q172 132 150 160Q136 182 112 200Z')}${path('sun', 'M208 146Q178 150 162 170Q150 186 136 200H140Q154 188 166 172Q182 154 208 150Z')}`],
    [11, path('near', 'M0 200V172Q50 156 100 200Z')],
  ],
};

/** A scene's markup: one parallax layer per depth. */
export const sceneMarkup = (name) =>
  `<div class="scene" aria-hidden="true">${(SCENES[name] ?? SCENES.mountains)
    .map(([depth, inner]) => `<div class="layer" style="--_depth: ${depth}%"><svg viewBox="0 0 208 200" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${inner}</svg></div>`)
    .join('')}</div>`;

export const DEMO_ITEMS = [
  { id: 'lisbon', title: 'Profiling week in Lisbon', location: 'Lisbon, Portugal', scene: 'city', badge: '2 days', dates: 'Oct 24 – 26', price: 340, rating: 4.92, reviewCount: 318 },
  { id: 'dolomites', title: 'Rewrite it in C, in the Dolomites', location: 'Val Gardena, Italy', scene: 'mountains', badge: '4 days', dates: 'Nov 3 – 7', price: 610, rating: 4.97, reviewCount: 142 },
  { id: 'dunes', title: 'Benchmarks in the dunes', location: 'Merzouga, Morocco', scene: 'dunes', badge: '2 days', dates: 'Nov 14 – 16', price: 280, rating: 4.88, reviewCount: 96 },
  { id: 'lapland', title: 'SIMD by hand, under the aurora', location: 'Inari, Finland', scene: 'lake', badge: '3 days', dates: 'Dec 5 – 8', price: 520, rating: 4.95, reviewCount: 210 },
  { id: 'naxos', title: 'Firmware on an island', location: 'Naxos, Greece', scene: 'islands', badge: '5 days', dates: 'May 9 – 14', price: 740, rating: 4.9, reviewCount: 187 },
  { id: 'tokyo', title: 'Low-latency week in Tokyo', location: 'Tokyo, Japan', scene: 'skyline', badge: '4 days', dates: 'Mar 20 – 24', price: 890, rating: 4.96, reviewCount: 402 },
  { id: 'ubud', title: 'Real-time audio in Ubud', location: 'Ubud, Indonesia', scene: 'terraces', badge: '3 days', dates: 'Jan 12 – 15', price: 390, rating: 4.91, reviewCount: 133 },
  { id: 'coast-road', title: 'Build a tiny OS in Big Sur', location: 'Big Sur, United States', scene: 'coast', badge: '3 days', dates: 'Apr 2 – 5', price: 560, rating: 4.89, reviewCount: 158 },
];
