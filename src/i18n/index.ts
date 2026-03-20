import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import ja from './locales/ja.json'
import ko from './locales/ko.json'
import vi from './locales/vi.json'
import zhCN from './locales/zh-CN.json'
import zhTW from './locales/zh-TW.json'

type MessageSchema = typeof zhTW

const i18n = createI18n<[MessageSchema], 'zh-TW' | 'zh-CN' | 'en' | 'ja' | 'ko' | 'vi'>({
  legacy: false,
  locale: 'zh-TW',
  fallbackLocale: 'en',
  messages: {
    'zh-TW': zhTW,
    'zh-CN': zhCN,
    en: en,
    ja: ja,
    ko: ko,
    vi: vi,
  },
})

export default i18n
