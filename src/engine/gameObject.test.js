import { gameObject } from './gameObject'

describe('gameObject', () => {
  it('should return object', () => {
    expect(typeof gameObject()()).toBe('object')
  })

  it('should has id equal "gameObject"', () => {
    expect(gameObject()({}).id).toBe('gameObject')
  })
})
