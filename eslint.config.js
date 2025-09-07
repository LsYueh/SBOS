import { createConfigForNuxt } from '@nuxt/eslint-config'

export default createConfigForNuxt({
}).override('nuxt/javascript', {
  rules: {
    'no-unused-vars': 'warn',
  }
}).override('nuxt/vue/rules', {
  rules: {
    'vue/first-attribute-linebreak': 'off',
    'vue/multi-word-component-names': 'off',
  }
})
