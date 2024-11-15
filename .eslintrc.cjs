module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:storybook/recommended",
    "airbnb", // Airbnb 스타일 가이드 추가
    "airbnb-typescript", // TypeScript와 함께 사용
    "plugin:prettier/recommended", // Prettier와의 통합
  ],
  parserOptions: {
    project: "./tsconfig.json",
  },
  ignorePatterns: ["dist", ".eslintrc.cjs", "firebase-messaging-sw.js"],
  parser: "@typescript-eslint/parser",
  plugins: [
    "react-refresh",
    "@typescript-eslint", // TypeScript ESLint 플러그인
  ],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "prettier/prettier": "warn", // Prettier 관련 오류를 ESLint 경고로 표시
    "react/react-in-jsx-scope": "off", // React 17 이상에서는 필요 없음
    "react/function-component-definition": "off", // 화살표 함수 사용 허용
    "import/extensions": "off",
    "react/require-default-props": "off",
    "react/prop-types": "off",
    "no-console": "off",
    "jsx-a11y/no-noninteractive-element-interactions": "off",
    "react/no-unknown-property": "off",
    "react/jsx-props-no-spreading": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/naming-convention": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "jsx-a11y/click-events-have-key-events": "off",
    "no-underscore-dangle": "off",
    "no-alert": "off",
    "react-hooks/exhaustive-deps": "off",
    "react/no-array-index-key": "off",
    "no-nested-ternary": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "react/jsx-no-constructed-context-values": "off",
    "import/prefer-default-export": "off",
    "@typescript-eslint/no-unused-expressions": "off",
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: [
          "**/src/api/mocks/**", // msw 관련 파일 예외 처리
        ],
      },
    ],
  },
  overrides: [
    {
      files: ["vite.config.ts", "public/mockServiceWorker.js"],
      rules: {
        "@typescript-eslint/no-var-requires": "off",
      },
    },
  ],
  settings: {
    node: {
      allowModules: ["react-cookie"],
    },
    react: {
      version: "detect", // React 버전 자동 감지
    },
  },
};
