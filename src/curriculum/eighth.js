export default {
  grade: '8th',
  domains: [
    {
      id: 'domain1',
      name: 'Number System',
      concepts: [
        {
          id: 'irrational-numbers',
          name: 'Irrational Numbers',
          skills: [
            {
              id: 'rat-vs-irrat',
              slug: 'determining-irrationals',
              name: 'Rational vs. Irrational Numbers',
              standard: '',
            },
            {
              id: 'rat-approx',
              slug: 'approximating-rationals',
              name: 'Rational Approximation',
              standard: '',
            },
          ],
          id: 'square-roots',
          name: 'Square Roots',
          skills: [
            {
              id: 'square-roots',
              slug: 'solving-perfect-squares',
              name: 'Square Roots',
            },
            {
              id: 'sqrt-approx-nl',
              slug: 'approximating-square-roots',
              name: 'Square Root Approximation on a Number Line',
            },
          ],
        },
      ],
    },
    {
      id: 'domain2',
      name: 'Expressions & Equations',
      concepts: [
        {
          id: 'exponent-rules',
          name: 'Exponent Rules',
          skills: [
            {
              id: 'exp-rules-pop',
              slug: 'product-of-powers',
              name: 'Exponent Rules (Product of Powers)',
              standard: '8.EE.A.1',
            },
            {
              id: 'exp-rules-qop',
              slug: 'quotient-of-powers',
              name: 'Exponent Rules (Quotient of Powers)',
              standard: '8.EE.A.1',
            },
            {
              id: 'exp-rules-ptp',
              slug: 'power-to-a-power',
              name: 'Exponent Rules (Power To A Power)',
              standard: '8.EE.A.1',
            },
            {
              id: 'exp-rules-neg',
              slug: 'negative-powers',
              name: 'Exponent Rules (Negative Powers)',
              standard: '8.EE.A.1',
            },
            {
              id: 'exp-rules-mix',
              slug: 'mixed-rules',
              name: 'Exponent Rules (Mixed)',
              standard: '8.EE.A.1',
            },
            // { id: '', name: '', standard: '' },
          ],
        },
      ],
    },
  ],
};
