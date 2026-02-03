import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import RadioPlayer from '../components/RadioPlayer.vue'

// Mock window.open
vi.stubGlobal('open', vi.fn())

// Mock Audio
class MockAudio {
  constructor() {
    this.paused = true
  }
  play() {
    this.paused = false
    return Promise.resolve()
  }
  pause() {
    this.paused = true
  }
  addEventListener() {}
  removeEventListener() {}
}

vi.stubGlobal('Audio', MockAudio)

describe('RadioPlayer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the component', () => {
    const wrapper = mount(RadioPlayer)
    expect(wrapper.find('h1').text()).toBe('Radio Player')
  })

  it('should display station list', () => {
    const wrapper = mount(RadioPlayer)
    const stationCards = wrapper.findAll('.rounded-2xl')
    expect(stationCards.length).toBeGreaterThan(0)
  })

  it('should show "Stream" for HTTPS stations', () => {
    const wrapper = mount(RadioPlayer)
    const streamLabels = wrapper.findAll('.text-slate-400')
    const hasStreamLabel = streamLabels.some((el) => el.text() === 'Stream')
    expect(hasStreamLabel).toBe(true)
  })

  it('should show "External Link" for HTTP stations', () => {
    const wrapper = mount(RadioPlayer)
    const labels = wrapper.findAll('.text-slate-400')
    const hasExternalLabel = labels.some((el) => el.text() === 'External Link')
    expect(hasExternalLabel).toBe(true)
  })

  it('should not show "Now Playing" indicator initially', () => {
    const wrapper = mount(RadioPlayer)
    expect(wrapper.text()).not.toContain('Now Playing')
  })

  it('should not show stop button initially', () => {
    const wrapper = mount(RadioPlayer)
    expect(wrapper.text()).not.toContain('Stop')
  })
})
