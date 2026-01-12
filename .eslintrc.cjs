module.exports = {
  root: true,
  env: { es2020: true },
  extends: ['eslint:recommended'],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'node_modules', 'password.txt'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: ['@stylistic/js'],
  rules: {
    '@stylistic/js/indent': ['error', 2],
    '@stylistic/js/linebreak-style': ['error', 'unix'],
    '@stylistic/js/quotes': ['error', 'single'],
    eqeqeq: 'error',
    'no-trailing-spaces': 'error',
    'object-curly-spacing': ['error', 'always'],
    'arrow-spacing': ['error', { before: true, after: true }],
    'no-console': 'off',
  },
  overrides: [
    {
      // Configuration for server files
      files: ['server/**/*.js'],
      env: {
        node: true,
      },
    },
    {
      // Configuration for client files
      files: ['client/**/*.js', 'client/**/*.jsx'],
      env: {
        browser: true,
      },
      extends: [
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:react-hooks/recommended',
      ],
      settings: { react: { version: '18.2' } },
      plugins: ['react-refresh'],
      rules: {
        'react/prop-types': 'off',
        'react-refresh/only-export-components': [
          'warn',
          { allowConstantExport: true },
        ],
      },
    },
  ],
};
