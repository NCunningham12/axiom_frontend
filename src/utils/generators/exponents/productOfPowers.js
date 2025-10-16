export function generateProductOfPowers() {
  const baseOptions = ['a', 'b', 'x', 'y'];
  const base = baseOptions[Math.floor(Math.random() * baseOptions.length)];

  const m = Math.floor(Math.random() * 5) + 1; // 1–5
  const n = Math.floor(Math.random() * 5) + 1; // 1–5
  const total = m + n;

  const question = `${base}^{${m}} \\cdot ${base}^{${n}}`;
  const answer = `${base}^{${total}}`;

  return {
    id: `productOfPowers-${base}${m}${n}`,
    topic: 'exponents',
    type: 'productOfPowers',
    question,
    answer,
  };
}
