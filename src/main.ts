import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { BackTop, Button, Field, ImagePreview, Loading, Pagination, Popup, Tab, Tabs, Toast } from 'vant'
import 'vant/lib/index.css'
import App from './App.vue'
import i18n from './i18n'
import router from './router'
import './style.css'

const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)
app.use(i18n)
app
  .use(Popup)
  .use(Field)
  .use(Button)
  .use(Toast)
  .use(Tab)
  .use(Tabs)
  .use(Pagination)
  .use(Loading)
  .use(BackTop)
  .use(ImagePreview)
app.mount('#app')
