// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
  features: {
    stylistic: {
      commaDangle: 'always-multiline',
      braceStyle: '1tbs',
    },
  },
}).append({
  rules: {
    '@stylistic/member-delimiter-style': 'off',
    '@stylistic/operator-linebreak': 'off',
    '@stylistic/arrow-parens': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/html-self-closing': ['warn', {
      html: { void: 'any' },
    }],
  },
})
