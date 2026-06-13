import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import './themes/warm-editorial.css'
import './themes/dark-tech.css'
import './themes/nature-green.css'
import './themes/ocean-blue.css'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import App from './App.vue'
import router from './router'
import { applyTheme } from './stores/themeStore'

// 在 Vue 挂载前应用保存的主题，避免闪烁
applyTheme(localStorage.getItem('ai-ui-theme'))

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
