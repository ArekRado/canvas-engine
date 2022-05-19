import { vector, Vector2D } from '@arekrado/vector-2d'
import {
  detectCircleLineCollision,
  detectLineLineCollision,
  detectPointLineCollision,
  detectRectangleRectangleCollision,
} from '../system/collider/detectCollision'

describe('detectCollision', () => {
  describe('detectRectangleRectangleCollision', () => {
    it('should detect edge collisions', () => {
      const edgeV1: Vector2D[] = [
        [-1, 1],
        [-1, 0],
        [-1, -1],
        [0, 1],
        [0, -1],
        [1, 1],
        [1, 0],
        [1, -1],
      ]

      edgeV1.forEach((v1) => {
        expect(
          detectRectangleRectangleCollision({
            rectangle1: {
              position: v1,
              size: vector(1, 1),
            },
            rectangle2: {
              position: vector(0, 0),
              size: vector(1, 1),
            },
          }),
        ).toBeTruthy()
      })
    })

    it('should not detect collisions when object is outside', () => {
      const outsideV1: Vector2D[] = [
        [-2, 1],
        [-2, 0],
        [-2, -1],
        [0, 2],
        [0, -2],
        [2, 1],
        [2, 0],
        [2, -1],
      ]

      outsideV1.forEach((v1) => {
        expect(
          detectRectangleRectangleCollision({
            rectangle1: {
              position: v1,
              size: vector(1, 1),
            },
            rectangle2: {
              position: vector(0, 0),
              size: vector(1, 1),
            },
          }),
        ).toBeFalsy()
      })
    })

    it('should detect collisions when object inside', () => {
      const outsideV1: Vector2D[] = [
        [0, 0],
        [-0.5, 1],
        [-0.5, 0],
        [-0.5, -1],
        [0, 0.5],
        [0, -0.5],
        [0.5, 0.5],
        [0.5, 0],
        [0.5, -0.5],
      ]

      outsideV1.forEach((v1) => {
        expect(
          detectRectangleRectangleCollision({
            rectangle1: {
              position: v1,
              size: vector(1, 1),
            },
            rectangle2: {
              position: vector(0, 0),
              size: vector(1, 1),
            },
          }),
        ).toBeTruthy()
      })
    })
  })

  it('detectPointLineCollision', () => {
    expect(
      detectPointLineCollision({
        point: [0, 0],
        line: {
          position: [0, 0],
          position2: [0, 0],
        },
      }),
    ).toBeTruthy()

    expect(
      detectPointLineCollision({
        point: [0, 0],
        line: {
          position: [0, 0],
          position2: [1, 1],
        },
      }),
    ).toBeTruthy()

    expect(
      detectPointLineCollision({
        point: [1, 1],
        line: {
          position: [0, 0],
          position2: [2, 2],
        },
      }),
    ).toBeTruthy()

    expect(
      detectPointLineCollision({
        point: [1, 2],
        line: {
          position: [0, 0],
          position2: [2, 2],
        },
      }),
    ).toBeFalsy()

    expect(
      detectPointLineCollision({
        point: [1, 1],
        line: {
          position: [0, 0],
          position2: [1, 0.999],
        },
      }),
    ).toBeFalsy()
  })

  it('detectCircleLineCollision', () => {
    expect(
      detectCircleLineCollision({
        circle: { position: [0, 0], radius: 1 },
        // line end inside circle
        line: { position: [0.5, 0.5], position2: [3, 3] },
      }),
    ).toBeTruthy()

    expect(
      detectCircleLineCollision({
        circle: { position: [0, 0], radius: 1 },
        // line second end inside circle
        line: { position: [3, 3], position2: [0.5, 0.5] },
      }),
    ).toBeTruthy()

    expect(
      detectCircleLineCollision({
        circle: { position: [0, 0], radius: 1 },
        // line crossing circle
        line: { position: [0, 0], position2: [1, 1] },
      }),
    ).toBeTruthy()

    expect(
      detectCircleLineCollision({
        circle: { position: [0, 0], radius: 1 },
        // line outside circle
        line: { position: [9, 9], position2: [10, 10] },
      }),
    ).toBeFalsy()
  })

  it('detectLineLineCollision', () => {
    expect(
      detectLineLineCollision({
        line1: { position: [-1, -1], position2: [1, 1] },
        line2: { position: [-1, -1], position2: [1, 1] },
      }),
    ).toBeTruthy()

    expect(
      detectLineLineCollision({
        line1: { position: [-1, -1], position2: [1, 1] },
        line2: { position: [-1, 1], position2: [1, -1] },
      }),
    ).toBeTruthy()

    expect(
      detectLineLineCollision({
        line1: { position: [-1, -1], position2: [1, 1] },
        line2: { position: [-2, -2], position2: [2, 2] },
      }),
    ).toBeTruthy()

    expect(
      detectLineLineCollision({
        line1: { position: [-1, -1], position2: [1, 1] },
        line2: { position: [1, 1], position2: [2, 2] },
      }),
    ).toBeTruthy()

    expect(
      detectLineLineCollision({
        line1: { position: [-1, -1], position2: [1, 1] },
        line2: { position: [100, 100], position2: [100, 100] },
      }),
    ).toBeFalsy()
  })
})
