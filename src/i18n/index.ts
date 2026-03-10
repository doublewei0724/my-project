import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import ja from './locales/ja.json'
import ko from './locales/ko.json'
import zhTW from './locales/zh-TW.json'

type MessageSchema = typeof zhTW

const i18n = createI18n<[MessageSchema], 'zh-TW' | 'en' | 'ja' | 'ko'>({
  legacy: false,
  locale: 'zh-TW',
  fallbackLocale: 'en',
  messages: {
    'zh-TW': zhTW,
    en: en,
    ja: ja,
    ko: ko,
  },
})

export default i18n
