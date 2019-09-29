import { createRigidbody } from './rigidbody'

describe('rigidbody', () => {
  it('should return object', () => {
    expect(typeof createRigidbody()).toBe('object')
  })
})
