import { createGameObject } from './gameObject'

describe('createGameObject', () => {
  it('should return object', () => {
    expect(typeof createGameObject()()).toBe('object')
  })

  it('should has id equal "gameObject"', () => {
    expect(createGameObject({ id: 'gameObject' })({}).id).toBe('gameObject')
  })
})
