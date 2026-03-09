export function useDailyStorage() {
  /**
   * 檢查該 key 是否已在今天被標記
   * @param key 儲存於 localStorage 的名稱
   */
  const isMarkedToday = (key: string): boolean => {
    const storedDate = localStorage.getItem(key)
    const today = new Date().toLocaleDateString()
    return storedDate === today
  }

  /**
   * 設定今天不再顯示
   * @param key 儲存於 localStorage 的名稱
   */
  const setMarkToday = (key: string) => {
    const today = new Date().toLocaleDateString()
    localStorage.setItem(key, today)
  }

  /**
   * 清除標記 (手動重製用)
   */
  const clearMark = (key: string) => {
    localStorage.removeItem(key)
  }

  return {
    isMarkedToday,
    setMarkToday,
    clearMark,
  }
}
