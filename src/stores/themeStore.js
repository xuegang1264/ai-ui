import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { themes, defaultTheme } from '../themes'

const STORAGE_KEY = 'ai-ui-theme'

function getSavedTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY) || defaultTheme
  } catch {
    return defaultTheme
  }
}

function applyTheme(key) {
  const valid = themes.some((t) => t.key === key)
  const themeKey = valid ? key : defaultTheme
  document.documentElement.dataset.theme = themeKey
  try {
    localStorage.setItem(STORAGE_KEY, themeKey)
  } catch {
    // ignore
  }
  return themeKey
}

export const useThemeStore = defineStore('theme', () => {
  const currentTheme = ref(applyTheme(getSavedTheme()))

  function setTheme(key) {
    currentTheme.value = applyTheme(key)
  }

  watch(currentTheme, (key) => {
    applyTheme(key)
  })

  return {
    themes,
    currentTheme,
    setTheme,
  }
})

export { applyTheme }
