import { vector, Vector2D } from '@arekrado/vector-2d'
import { detectAABBcollision } from '../util/detectCollision'

describe('detectCollision', () => {
  describe('detectAABBcollision', () => {
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
          detectAABBcollision({
            v1,
            size1: vector(1, 1),
            v2: vector(0, 0),
            size2: vector(1, 1),
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
          detectAABBcollision({
            v1,
            size1: vector(1, 1),
            v2: vector(0, 0),
            size2: vector(1, 1),
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
          detectAABBcollision({
            v1,
            size1: vector(1, 1),
            v2: vector(0, 0),
            size2: vector(1, 1),
          }),
        ).toBeTruthy()
      })
    })
  })
})
