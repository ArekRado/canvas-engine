import { defaultCollider, defaultTransform } from '../../util/defaultComponents'
import { degreesToRadians } from '../../util/radian'
import { getColliderContour } from './getColliderContour'

const toFixed = (x: number) => parseFloat(x.toFixed(3))

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
      ).toEqual([0, 0, 0, 0])

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
      ).toEqual([1, 1, 1, 1])

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
      ).toEqual([-4, -4, -4, -4])
    })

    it('rectangle', () => {
      expect(
        getColliderContour({
          transform: defaultTransform(),
          collider: defaultCollider({
            data: {
              type: 'rectangle',
              size: [30, 10],
              position: [80, 40],
            },
          }),
        }),
      ).toEqual([80, 40, 110, 50])

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
      ).toEqual([0, 0, 1, 1])

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
      ).toEqual([-1, -1, 0, 0])

      const p = getColliderContour({
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
      })

      expect([
        toFixed(p[0]),
        toFixed(p[1]),
        toFixed(p[2]),
        toFixed(p[3]),
      ]).toEqual([0, -1, 1, 0])

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

      expect([
        toFixed(p1[0]),
        toFixed(p1[1]),
        toFixed(p1[2]),
        toFixed(p1[3]),
      ]).toEqual([-1, -1, 0, 0])

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

      expect([
        toFixed(p2[0]),
        toFixed(p2[1]),
        toFixed(p2[2]),
        toFixed(p2[3]),
      ]).toEqual([0, -0.707, 1.414, 0.707])
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
      ).toEqual([0, 0, 0.5, 0.5])

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
      ).toEqual([-1, -1, -0.5, -0.5])

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
      ).toEqual([0, 0, 0.5, 0.5])

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

      expect([p1[0], p1[1], p1[2], p1[3]]).toEqual([0, 0, 0.5, 0.5])

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

      expect([p2[0], p2[1], p2[2], p2[3]]).toEqual([0, 0, 0.5, 0.5])
    })

    it('line', () => {
      expect(
        getColliderContour({
          transform: defaultTransform(),
          collider: defaultCollider({
            data: {
              type: 'line',
              position: [250, 50],
              position2: [270, 80],
            },
          }),
        }),
      ).toEqual([250, 50, 270, 80])

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
      ).toEqual([0, 0, 1, 1])

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
      ).toEqual([0, 0, 1, 1])

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
      ).toEqual([-1, -1, 0, 0])

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
      expect([
        toFixed(p1[0]),
        toFixed(p1[1]),
        toFixed(p1[2]),
        toFixed(p1[3]),
      ]).toEqual([0, -1, 1, 0])

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

      expect([
        toFixed(p2[0]),
        toFixed(p2[1]),
        toFixed(p2[2]),
        toFixed(p2[3]),
      ]).toEqual([-1, -1, 0, 0])

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

      expect([
        toFixed(p3[0]),
        toFixed(p3[1]),
        toFixed(p3[2]),
        toFixed(p3[3]),
      ]).toEqual([0, 0, 1.414, 0])
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

      expect([p1[0], p1[1], p1[2], p1[3]]).toEqual([-1, -1, 1, 1])

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

      expect([
        toFixed(p2[0]),
        toFixed(p2[1]),
        toFixed(p2[2]),
        toFixed(p2[3]),
      ]).toEqual([-1.414, -0.354, 1.414, 0.354])
    })
  })
})
