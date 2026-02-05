/**
 * Fisher-Yates 洗牌演算法
 * 隨機打亂陣列順序
 * @param {Array} array - 要打亂的陣列
 * @returns {Array} 打亂後的新陣列（不修改原陣列）
 */
export const shuffleArray = (array) => {
  // 創建副本，避免修改原陣列
  const shuffled = [...array]

  // Fisher-Yates 演算法
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    // ES6 解構賦值交換
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return shuffled
}
