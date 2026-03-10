/**
 * 處理 Public 資料夾下的路徑拼接
 * @returns 完整的 Base URL 路徑
 */
export const getAssetPath = (path: string): string => {
  const base = import.meta.env.BASE_URL
  // 確保 base 結尾與 path 開頭只有一個斜線
  const normalizedBase = base.endsWith('/') ? base : `${base}/`
  const normalizedPath = path.startsWith('/') ? path.substring(1) : path

  return `${normalizedBase}${normalizedPath}`
}
