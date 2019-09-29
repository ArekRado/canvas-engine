import { time } from './time'

describe('time', () => {
  it('should return object', () => {
    expect(typeof time()()).toBe('object')
  })

  it('should has id equal "time"', () => {
    expect(time()({}).id).toBe('time')
  })
})
