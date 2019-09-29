import { rectangleAndPoint } from './rectangleAndPoint'
import { vector } from '../../utils/vector'

describe('rectangleAndPoint', () => {
  test('should return true when point is in rectangle', () => {
    expect(
      rectangleAndPoint(
        {
          v1: vector(0, 0),
          v2: vector(1, 1),
        },
        vector(0.5, 0.5),
      ),
    ).toBe(true)

    expect(
      rectangleAndPoint(
        {
          v1: vector(-1, -1),
          v2: vector(0, 0),
        },
        vector(-0.5, -0.5),
      ),
    ).toBe(true)

    expect(
      rectangleAndPoint(
        {
          v1: vector(0, 0),
          v2: vector(0, 0),
        },
        vector(0, 0),
      ),
    ).toBe(true)
  })

  test('should return true when point is on edge', () => {
    expect(
      rectangleAndPoint(
        {
          v1: vector(0, 0),
          v2: vector(1, 1),
        },
        vector(1, 0),
      ),
    ).toBe(true)

    expect(
      rectangleAndPoint(
        {
          v1: vector(-1, -1),
          v2: vector(0, 0),
        },
        vector(-1, 0),
      ),
    ).toBe(true)

    expect(
      rectangleAndPoint(
        {
          v1: vector(0, 0),
          v2: vector(0, 0),
        },
        vector(0, 0),
      ),
    ).toBe(true)

    expect(
      rectangleAndPoint(
        {
          v1: vector(-1, -1),
          v2: vector(0, 0),
        },
        vector(-1, -1),
      ),
    ).toBe(true)
  })

  test('should return false when point is out of rectangle', () => {
    expect(
      rectangleAndPoint(
        {
          v1: vector(1, 1),
          v2: vector(0, 0),
        },
        vector(-1, -1),
      ),
    ).toBe(false)
  })
})
