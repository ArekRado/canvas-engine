import { Vector2D } from '@arekrado/vector-2d'
import { Vector3D } from '../type'

export const toFixedVector3D = (
  v: Vector3D | Vector2D,
  fractionDigits: number,
): Vector3D | Vector2D =>
  v[2] !== undefined
    ? [
        parseFloat(v[0].toFixed(fractionDigits)),
        parseFloat(v[1].toFixed(fractionDigits)),
        parseFloat(v[2].toFixed(fractionDigits)),
      ]
    : [
        parseFloat(v[0].toFixed(fractionDigits)),
        parseFloat(v[1].toFixed(fractionDigits)),
      ]
