import { magnitude, sub, Vector2D } from '@arekrado/vector-2d'
import { CollideBox } from '../type'

type DetectAABBcollision = (params: {
  v1: Vector2D
  size1: Vector2D
  v2: Vector2D
  size2: Vector2D
}) => boolean
export const detectAABBcollision: DetectAABBcollision = ({
  v1: [x1, y1],
  size1: [size1x, size1y],
  v2: [x2, y2],
  size2: [size2x, size2y],
}) =>
  x1 <= x2 + size2x &&
  x1 + size1x >= x2 &&
  y1 <= y2 + size2y &&
  y1 + size1y >= y2

type DetectPointBoxCollision = (params: {
  point: Vector2D
  box: {
    position: Vector2D
    size: Vector2D
  }
}) => boolean
export const detectPointBoxCollision: DetectPointBoxCollision = ({
  point,
  box,
}) =>
  point[0] <= box.position[0] + box.size[0] &&
  point[0] >= box.position[0] &&
  point[1] <= box.position[1] + box.size[1] &&
  point[1] >= box.position[1]

type DetectPointCircleCollision = (params: {
  point: Vector2D
  circle: {
    position: Vector2D
    radius: number
  }
}) => boolean
export const detectPointCircleCollision: DetectPointCircleCollision = ({
  point,
  circle,
}) => {
  const distance = magnitude(sub(point, circle.position))

  return distance <= circle.radius
}
