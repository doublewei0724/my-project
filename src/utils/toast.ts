import { closeToast, showLoadingToast as vantShowLoadingToast, showToast as vantShowToast } from 'vant'

/**
 * 自定義全域 Toast 工具，解決文字覆蓋問題
 */
export const myToast = {
  // 普通提示
  success(message: string, options = {}) {
    closeToast() // 1. 先強行關閉上一個，清空內部變數
    setTimeout(() => {
      // 2. 給予 20ms 緩衝讓 DOM 完全重置
      vantShowToast({
        type: 'success',
        message,
        ...options,
      })
    }, 20)
  },

  // 失敗提示
  fail(message: string, options = {}) {
    closeToast()
    setTimeout(() => {
      vantShowToast({
        type: 'fail',
        message,
        ...options,
      })
    }, 20)
  },

  // 文字提示
  info(message: string, options = {}) {
    closeToast()
    setTimeout(() => {
      vantShowToast({
        message,
        ...options,
      })
    }, 20)
  },

  // 加載中 (Loading)
  loading(message: string) {
    closeToast()
    return vantShowLoadingToast({
      message,
      forbidClick: true,
      duration: 0,
    })
  },

  // 關閉所有
  clear: closeToast,
}
