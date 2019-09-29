import { keyboard } from './keyboard'

describe('keyboard', () => {
  it('should return object', () => {
    expect(typeof keyboard()()).toBe('object')
  })

  it('should has id equal "keyboard"', () => {
    expect(keyboard()({}).id).toBe('keyboard')
  })
})
