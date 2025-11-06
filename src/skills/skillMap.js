import * as productOfPowers from './exponents/productOfPowers';

// Add more skill files here
const rawSkills = {
  productOfPowers,
};

// Validate that each skill module has the required exports
const REQUIRED_KEYS = [
  'generateProblem',
  'renderProblem',
  'validateAnswer',
  'problemEditor',
];

const skillMap = {};

for (const [key, module] of Object.entries(rawSkills)) {
  const missing = REQUIRED_KEYS.filter(
    (fn) => typeof module[fn] !== 'function'
  );
  if (missing.length > 0) {
    console.error(
      `❌ Skill "${key}" is missing required exports: ${missing.join(', ')}`
    );
    continue; // skip invalid skill
  }
  skillMap[key] = module;
}

export default skillMap;
