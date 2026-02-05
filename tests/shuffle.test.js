import { describe, it, expect } from 'vitest'
import { shuffleArray } from '../src/utils/shuffle'

describe('shuffleArray', () => {
  it('應該返回與原陣列長度相同的陣列', () => {
    const original = [1, 2, 3, 4, 5]
    const shuffled = shuffleArray(original)
    expect(shuffled).toHaveLength(original.length)
  })

  it('應該包含原陣列的所有元素', () => {
    const original = [1, 2, 3, 4, 5]
    const shuffled = shuffleArray(original)

    original.forEach(item => {
      expect(shuffled).toContain(item)
    })
  })

  it('不應該修改原陣列', () => {
    const original = [1, 2, 3, 4, 5]
    const originalCopy = [...original]
    shuffleArray(original)

    expect(original).toEqual(originalCopy)
  })

  it('空陣列應該返回空陣列', () => {
    const shuffled = shuffleArray([])
    expect(shuffled).toEqual([])
  })

  it('單一元素陣列應該返回相同元素', () => {
    const shuffled = shuffleArray([42])
    expect(shuffled).toEqual([42])
  })

  it('多次執行應該產生不同的順序（統計驗證）', () => {
    const original = [1, 2, 3, 4, 5]
    const results = []

    // 執行 10 次洗牌
    for (let i = 0; i < 10; i++) {
      results.push(shuffleArray(original).join(','))
    }

    // 至少應該有一些不同的結果（不是每次都一樣）
    const uniqueResults = new Set(results)
    expect(uniqueResults.size).toBeGreaterThan(1)
  })
})
