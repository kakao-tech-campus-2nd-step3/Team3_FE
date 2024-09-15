import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tsParser from '@typescript-eslint/parser'; // TypeScript 파서

export default [
  {
    ignores: ['dist'], // dist 폴더 무시
    extends: [
      js.configs.recommended, // 기본 JavaScript 규칙
      'plugin:@typescript-eslint/recommended', // TypeScript 권장 규칙
      'plugin:prettier/recommended', // Prettier와 ESLint 연동
    ],
    files: ['**/*.{ts,tsx}'], // TypeScript 파일에만 적용
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: tsParser, // TypeScript 파서 설정
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'prettier/prettier': 'warn', // Prettier 규칙 위반 시 경고
    },
  },
];
