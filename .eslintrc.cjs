module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended', 
    'plugin:@typescript-eslint/recommended', 
    'plugin:react-hooks/recommended', 
    'plugin:storybook/recommended',
    'airbnb', // Airbnb 스타일 가이드 추가
    'airbnb-typescript', // TypeScript와 함께 사용
    'plugin:prettier/recommended' // Prettier와의 통합
  ],
  parserOptions: {
    project: './tsconfig.json', 
  },
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: [
    'react-refresh',
    '@typescript-eslint', // TypeScript ESLint 플러그인
  ],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'prettier/prettier': 'warn', // Prettier 관련 오류를 ESLint 경고로 표시
    'react/react-in-jsx-scope': 'off', // React 17 이상에서는 필요 없음
    'react/function-component-definition': 'off', // 화살표 함수 사용 허용
    'import/extensions': 'off',
    "react/require-default-props": "off",
    'react/prop-types': 'off',
    "react/no-unknown-property": "off",
    "@typescript-eslint/no-explicit-any": "off",
  },
  settings: {
    react: {
      version: 'detect', // React 버전 자동 감지
    },
  },
};
