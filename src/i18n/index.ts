import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'
import zhTW from './locales/zh-TW.json'

type MessageSchema = typeof zhTW

const i18n = createI18n<[MessageSchema], 'zh-TW' | 'zh-CN' | 'en'>({
  legacy: false,
  locale: 'zh-TW',
  fallbackLocale: 'en',
  messages: {
    'zh-TW': zhTW,
    'zh-CN': zhCN,
    en: en,
  },
})

export default i18n
