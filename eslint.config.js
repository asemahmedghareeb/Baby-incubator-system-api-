import globals from "globals";
import js from "@eslint/js";


const { 'no-useless-assignment': badRule, ...jsRules } = js.configs.all.rules;


export default [
  //js.configs.all,
  {
    files: ['**/*.{js,mjs,cjs}'],
    rules: {
      ...jsRules,
      'sort-imports': 'off',
      'one-var': 'off',
      'no-console': 'off',
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      }
    }
  },
];
