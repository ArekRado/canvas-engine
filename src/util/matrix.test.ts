import { applyMatrixToVector2D, rotate, scale, translate } from './matrix'
import { degreesToRadians } from './radian'
import { toFixedVector3D } from './toFixedVector3D'

describe('matrix', () => {
  describe('applyMatrixToVector2D', () => {
    it('should apply matrix to vector', () => {
      expect(applyMatrixToVector2D(translate([1, 0]), [0, 0])).toEqual([1, 0])
      expect(applyMatrixToVector2D(translate([1, 0]), [1, 1])).toEqual([2, 1])

      expect(applyMatrixToVector2D(scale([1, 1]), [1, 1])).toEqual([1, 1])
      expect(applyMatrixToVector2D(scale([2, 1]), [1, 1])).toEqual([2, 1])
      expect(applyMatrixToVector2D(scale([2, 2]), [1, 1])).toEqual([2, 2])
      expect(applyMatrixToVector2D(scale([-1, 10]), [3, -5])).toEqual([-3, -50])

      expect(
        toFixedVector3D(
          applyMatrixToVector2D(rotate(degreesToRadians(180)), [1, 0]),
          5,
        ),
      ).toEqual([-1, -0])
      expect(
        toFixedVector3D(
          applyMatrixToVector2D(rotate(degreesToRadians(90)), [1, 1]),
          5,
        ),
      ).toEqual([1, -1])
      expect(
        toFixedVector3D(
          applyMatrixToVector2D(rotate(degreesToRadians(30)), [1, 1]),
          5,
        ),
      ).toEqual([1.36603, 0.36603])
      expect(
        toFixedVector3D(
          applyMatrixToVector2D(rotate(degreesToRadians(-90)), [0.2, 0]),
          5,
        ),
      ).toEqual([0, 0.2])
    })
  })
})
