import { mouse } from './mouse'

describe('mouse', () => {
  it('should return object', () => {
    expect(typeof mouse()()).toBe('object')
  })

  it('should has id equal "mouse"', () => {
    expect(mouse()({}).id).toBe('mouse')
  })

  it('should save mouse position to state', () => {
    const map = {}
    window.addEventListener = jest.fn((event, cb) => {
      map[event] = cb
    })

    const go = mouse()()
    map.mousemove({ x: 1, y: 1 })

    expect(go.position).toEqual({ x: 1, y: 1 })
  })
})
