import { vector, Vector2D } from '@arekrado/vector-2d'

type Matrix = [number, number, number, number, number, number]

const identity = [1, 0, 0, 1, 0, 0]
const i = identity

// todo is it required to multiply by 1?
const transform = (m: Matrix): Matrix => [
  i[0] * m[0] + i[2] * m[1],
  i[1] * m[0] + i[3] * m[1],
  i[0] * m[2] + i[2] * m[3],
  i[1] * m[2] + i[3] * m[3],
  i[0] * m[4] + i[2] * m[5] + i[4],
  i[1] * m[4] + i[3] * m[5] + i[5],
]

export const rotate = (angle: number): Matrix => {
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  return transform([cos, -sin, sin, cos, 0, 0])
}

export const scale = (v: Vector2D): Matrix =>
  transform([v[0], 0, 0, v[1], 0, 0])

export const translate = (v: Vector2D): Matrix =>
  transform([1, 0, 0, 1, v[0], v[1]])

export const applyMatrixToVector2D = (m: Matrix, v: Vector2D) =>
  vector(v[0] * m[0] + v[1] * m[2] + m[4], v[0] * m[1] + v[1] * m[3] + m[5])
