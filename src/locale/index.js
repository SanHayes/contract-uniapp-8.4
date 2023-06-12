import zhTW from './zh-TW.json'
import en from './en.json'
import es from './es.json'
import hi from './hi.json'
import IN from './IN.json'
import ja from './ja.json'
import vi from './vi.json'


const messages = {
    en,
    'zh-TW': zhTW,
    es,
    hi,
    IN,
    ja,
    vi
}

let i18nConfig = {
    locale: uni.getLocale(),// 获取已设置的语言
    messages
}
export default i18nConfig