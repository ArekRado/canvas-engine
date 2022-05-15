import { equals, magnitude, sub, Vector2D } from '@arekrado/vector-2d'

/**
 * XXXXXXXXX | point                         | rectangle                         | circle
 * point     | detectPointPointCollision     |
 * rectangle | detectPointrectangleCollision | detectRectangleRectangleCollision
 * circle    | detectPointCircleCollision    |
 */

export const detectPointPointCollision = ({
  point1,
  point2,
}: {
  point1: Vector2D
  point2: Vector2D
}) => equals(point1, point2)

export const detectRectangleRectangleCollision = ({
  v1: [x1, y1],
  size1: [size1x, size1y],
  v2: [x2, y2],
  size2: [size2x, size2y],
}: {
  v1: Vector2D
  size1: Vector2D
  v2: Vector2D
  size2: Vector2D
}) =>
  x1 <= x2 + size2x &&
  x1 + size1x >= x2 &&
  y1 <= y2 + size2y &&
  y1 + size1y >= y2

export const detectPointBoxCollision = ({
  point,
  box,
}: {
  point: Vector2D
  box: {
    position: Vector2D
    size: Vector2D
  }
}) =>
  point[0] <= box.position[0] + box.size[0] &&
  point[0] >= box.position[0] &&
  point[1] <= box.position[1] + box.size[1] &&
  point[1] >= box.position[1]

export const detectPointCircleCollision = ({
  point,
  circle,
}: {
  point: Vector2D
  circle: {
    position: Vector2D
    radius: number
  }
}) => {
  const distance = magnitude(sub(point, circle.position))

  return distance <= circle.radius
}
