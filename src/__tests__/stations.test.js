import { describe, it, expect } from 'vitest'
import { stations } from '../data/stations.js'

describe('stations data', () => {
  it('should have stations array', () => {
    expect(Array.isArray(stations)).toBe(true)
    expect(stations.length).toBeGreaterThan(0)
  })

  it('should have required properties for each station', () => {
    stations.forEach((station) => {
      expect(station).toHaveProperty('id')
      expect(station).toHaveProperty('name')
      expect(station).toHaveProperty('url')
      expect(typeof station.id).toBe('number')
      expect(typeof station.name).toBe('string')
      expect(typeof station.url).toBe('string')
    })
  })

  it('should have unique IDs', () => {
    const ids = stations.map((s) => s.id)
    const uniqueIds = [...new Set(ids)]
    expect(ids.length).toBe(uniqueIds.length)
  })

  it('should have valid URL format', () => {
    stations.forEach((station) => {
      expect(station.url).toMatch(/^https?:\/\//)
    })
  })
})
