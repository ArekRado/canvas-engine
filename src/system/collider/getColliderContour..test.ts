import { defaultCollider, defaultTransform } from '../../util/defaultComponents'
import { degreesToRadians } from '../../util/radian'
import { toFixedVector2D } from '../../util/toFixedVector2D'
import { getColliderContour } from './getColliderContour'

describe('getColliderContour', () => {
  describe('should generate proper rectangle contour depending on collider', () => {
    it('point', () => {
      expect(
        getColliderContour({
          transform: defaultTransform({}),
          collider: defaultCollider({
            data: {
              type: 'point',
              position: [0, 0],
            },
          }),
        }),
      ).toEqual([
        [0, 0],
        [0, 0],
      ])

      expect(
        getColliderContour({
          transform: defaultTransform({}),
          collider: defaultCollider({
            data: {
              type: 'point',
              position: [1, 1],
            },
          }),
        }),
      ).toEqual([
        [1, 1],
        [0, 0],
      ])

      expect(
        getColliderContour({
          transform: defaultTransform({
            position: [1, 1],
            rotation: degreesToRadians(0),
          }),
          collider: defaultCollider({
            data: {
              type: 'point',
              position: [-5, -5],
            },
          }),
        }),
      ).toEqual([
        [-4, -4],
        [0, 0],
      ])
    })

    it('rectangle', () => {
      expect(
        getColliderContour({
          transform: defaultTransform({
            position: [0, 0],
            rotation: degreesToRadians(0),
          }),
          collider: defaultCollider({
            data: {
              type: 'rectangle',
              size: [1, 1],
              position: [0, 0],
            },
          }),
        }),
      ).toEqual([
        [0, 0],
        [1, 1],
      ])

      expect(
        getColliderContour({
          transform: defaultTransform({
            position: [-1, -1],
            rotation: degreesToRadians(0),
          }),
          collider: defaultCollider({
            data: {
              type: 'rectangle',
              size: [1, 1],
              position: [0, 0],
            },
          }),
        }),
      ).toEqual([
        [-1, -1],
        [1, 1],
      ])

      expect(
        getColliderContour({
          transform: defaultTransform({
            position: [0, 0],
            rotation: degreesToRadians(90),
          }),
          collider: defaultCollider({
            data: {
              type: 'rectangle',
              size: [1, 1],
              position: [0, 0],
            },
          }),
        }),
      ).toEqual([
        [0, -1],
        [1, 1],
      ])

      const p1 = getColliderContour({
        transform: defaultTransform({
          position: [0, 0],
          rotation: degreesToRadians(180),
        }),
        collider: defaultCollider({
          data: {
            type: 'rectangle',
            size: [1, 1],
            position: [0, 0],
          },
        }),
      })

      expect([toFixedVector2D(p1[0], 3), toFixedVector2D(p1[1], 3)]).toEqual([
        [-1, -1],
        [1, 1],
      ])

      const p2 = getColliderContour({
        transform: defaultTransform({
          position: [0, 0],
          rotation: degreesToRadians(45),
        }),
        collider: defaultCollider({
          data: {
            type: 'rectangle',
            size: [1, 1],
            position: [0, 0],
          },
        }),
      })

      expect([toFixedVector2D(p2[0], 3), toFixedVector2D(p2[1], 3)]).toEqual([
        [0, -0.707],
        [1.414, 1.414],
      ])
    })

    it('circle', () => {
      expect(
        getColliderContour({
          transform: defaultTransform({
            position: [0, 0],
            rotation: degreesToRadians(0),
          }),
          collider: defaultCollider({
            data: {
              type: 'circle',
              radius: 1,
              position: [0, 0],
            },
          }),
        }),
      ).toEqual([
        [0, 0],
        [0.5, 0.5],
      ])

      expect(
        getColliderContour({
          transform: defaultTransform({
            position: [-1, -1],
            rotation: degreesToRadians(0),
          }),
          collider: defaultCollider({
            data: {
              type: 'circle',
              radius: 1,
              position: [0, 0],
            },
          }),
        }),
      ).toEqual([
        [-1, -1],
        [-0.5, -0.5],
      ])

      expect(
        getColliderContour({
          transform: defaultTransform({
            position: [0, 0],
            rotation: degreesToRadians(90),
          }),
          collider: defaultCollider({
            data: {
              type: 'circle',
              radius: 1,
              position: [0, 0],
            },
          }),
        }),
      ).toEqual([
        [0, 0],
        [0.5, 0.5],
      ])

      const p1 = getColliderContour({
        transform: defaultTransform({
          position: [0, 0],
          rotation: degreesToRadians(180),
        }),
        collider: defaultCollider({
          data: {
            type: 'circle',
            radius: 1,
            position: [0, 0],
          },
        }),
      })

      expect([toFixedVector2D(p1[0], 3), toFixedVector2D(p1[1], 3)]).toEqual([
        [0, 0],
        [0.5, 0.5],
      ])

      const p2 = getColliderContour({
        transform: defaultTransform({
          position: [0, 0],
          rotation: degreesToRadians(45),
        }),
        collider: defaultCollider({
          data: {
            type: 'circle',
            radius: 1,
            position: [0, 0],
          },
        }),
      })

      expect([toFixedVector2D(p2[0], 3), toFixedVector2D(p2[1], 3)]).toEqual([
        [0, 0],
        [0.5, 0.5],
      ])
    })

    it('line', () => {
      expect(
        getColliderContour({
          transform: defaultTransform({
            position: [0, 0],
            rotation: degreesToRadians(0),
          }),
          collider: defaultCollider({
            data: {
              type: 'line',
              position2: [1, 1],
              position: [0, 0],
            },
          }),
        }),
      ).toEqual([
        [0, 0],
        [1, 1],
      ])

      expect(
        getColliderContour({
          transform: defaultTransform({
            position: [0, 0],
            rotation: degreesToRadians(0),
          }),
          collider: defaultCollider({
            data: {
              type: 'line',
              position2: [0, 0],
              position: [1, 1],
            },
          }),
        }),
      ).toEqual([
        [0, 0],
        [1, 1],
      ])

      expect(
        getColliderContour({
          transform: defaultTransform({
            position: [-1, -1],
            rotation: degreesToRadians(0),
          }),
          collider: defaultCollider({
            data: {
              type: 'line',
              position2: [1, 1],
              position: [0, 0],
            },
          }),
        }),
      ).toEqual([
        [-1, -1],
        [1, 1],
      ])

      const p1 = getColliderContour({
        transform: defaultTransform({
          position: [0, 0],
          rotation: degreesToRadians(90),
        }),
        collider: defaultCollider({
          data: {
            type: 'line',
            position2: [1, 1],
            position: [0, 0],
          },
        }),
      })
      expect([toFixedVector2D(p1[0], 3), toFixedVector2D(p1[1], 3)]).toEqual([
        [0, -1],
        [1, 1],
      ])

      const p2 = getColliderContour({
        transform: defaultTransform({
          position: [0, 0],
          rotation: degreesToRadians(180),
        }),
        collider: defaultCollider({
          data: {
            type: 'line',
            position2: [1, 1],
            position: [0, 0],
          },
        }),
      })

      expect([toFixedVector2D(p2[0], 3), toFixedVector2D(p2[1], 3)]).toEqual([
        [-1, -1],
        [1, 1],
      ])

      const p3 = getColliderContour({
        transform: defaultTransform({
          position: [0, 0],
          rotation: degreesToRadians(45),
        }),
        collider: defaultCollider({
          data: {
            type: 'line',
            position2: [1, 1],
            position: [0, 0],
          },
        }),
      })

      expect([toFixedVector2D(p3[0], 3), toFixedVector2D(p3[1], 3)]).toEqual([
        [0, 0],
        [1.414, 0],
      ])
    })

    it('polygon', () => {
      const p1 = getColliderContour({
        transform: defaultTransform({
          position: [0, 0],
          rotation: degreesToRadians(0),
        }),
        collider: defaultCollider({
          data: {
            type: 'polygon',
            verticles: [
              [-1, -1],
              [-0.5, 0],
              [0, -0.5],
              [1, 1],
            ],
          },
        }),
      })

      expect([toFixedVector2D(p1[0], 3), toFixedVector2D(p1[1], 3)]).toEqual([
        [-1, -1],
        [2, 2],
      ])

      const p2 = getColliderContour({
        transform: defaultTransform({
          position: [0, 0],
          rotation: degreesToRadians(45),
        }),
        collider: defaultCollider({
          data: {
            type: 'polygon',
            verticles: [
              [-1, -1],
              [-0.5, 0],
              [0, -0.5],
              [1, 1],
            ],
          },
        }),
      })

      expect([toFixedVector2D(p2[0], 3), toFixedVector2D(p2[1], 3)]).toEqual([
        [-1.414, -0.354],
        [2.828, 0.707],
      ])
    })
  })
})
