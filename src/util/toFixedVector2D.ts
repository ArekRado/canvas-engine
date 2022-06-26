import { vector, Vector2D } from '@arekrado/vector-2d'

export const toFixedVector2D = (
  v: Vector2D,
  fractionDigits: number,
): Vector2D =>
  vector(
    parseFloat(v[0].toFixed(fractionDigits)),
    parseFloat(v[1].toFixed(fractionDigits)),
  )
