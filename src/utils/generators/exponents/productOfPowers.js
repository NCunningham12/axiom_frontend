export function generateProductOfPowers() {
  const baseOptions = ['a', 'b', 'x', 'y'];
  const base = baseOptions[Math.floor(Math.random() * baseOptions.length)];

  const m = Math.floor(Math.random() * 5) + 1; // 1–5
  const n = Math.floor(Math.random() * 5) + 1; // 1–5
  const total = m + n;

  const question = `${base}^{${m}} \\cdot ${base}^{${n}}`;

  return {
    id: `productOfPowers-${base}${m}${n}`,
    concept: 'exponents',
    type: 'productOfPowers',
    inputType: 'exponentInput',
    directions: 'Solve the exponent using the Product of Powers Rule',
    question: question,
    answer: {
      base: base,
      exponent: total,
    },
  };
}
