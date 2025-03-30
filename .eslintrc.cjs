/** @type { import("eslint").Linter.Config } */
module.exports = {
	root: true,
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:svelte/recommended',
		'prettier'
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
		extraFileExtensions: ['.svelte'],
		tsconfigRootDir: __dirname,
		project: ['./tsconfig.json']
	},
	plugins: ['@typescript-eslint'],
	env: {
		browser: true,
		es2017: true,
		node: true
	},
	rules: {
		// Example rules (customize as needed)
		'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/no-explicit-any': 'warn',
		'svelte/no-at-html-tags': 'warn',
		'svelte/no-at-html-tags': 'warn', // Warn when using @html to avoid XSS risks
		'svelte/valid-compile': 'error', // Ensure valid Svelte syntax
		'svelte/no-unused-class-name': 'warn' // Warn about unused CSS class names
	},
	ignorePatterns: [
		'.DS_Store',
		'node_modules',
		'/build',
		'/.svelte-kit',
		'/package',
		'.env',
		'.env.*',
		'!.env.example',
		'.svelte-kit/',
		'build/',
		'dist/',
		'pnpm-lock.yaml',
		'package-lock.json',
		'yarn.lock'
	]
};
