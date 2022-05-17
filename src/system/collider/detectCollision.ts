import { equals, magnitude, sub, Vector2D } from '@arekrado/vector-2d'

/**
 * XXXXXXXXX | point                         | rectangle                         | circle                      | line
 * point     | detectPointPointCollision     | x                                 | x                           |
 * rectangle | detectPointrectangleCollision | detectRectangleRectangleCollision | x                           |
 * circle    | detectPointCircleCollision    | detectRectangleCircleCollision    | detectCircleCircleCollision |
 * line      | detectPointLineCollision      |                                   | detectCircleLineCollision   | 
 */

export const detectPointPointCollision = ({
  point1,
  point2,
}: {
  point1: Vector2D
  point2: Vector2D
}) => equals(point1, point2)

export const detectRectangleRectangleCollision = ({
  rectangle1: {
    position: [x1, y1],
    size: [size1x, size1y],
  },
  rectangle2: {
    position: [x2, y2],
    size: [size2x, size2y],
  },
}: {
  rectangle1: {
    position: Vector2D
    size: Vector2D
  }
  rectangle2: {
    position: Vector2D
    size: Vector2D
  }
}) =>
  x1 <= x2 + size2x &&
  x1 + size1x >= x2 &&
  y1 <= y2 + size2y &&
  y1 + size1y >= y2

export const detectPointRectangleCollision = ({
  point,
  rectangle,
}: {
  point: Vector2D
  rectangle: {
    position: Vector2D
    size: Vector2D
  }
}) =>
  point[0] <= rectangle.position[0] + rectangle.size[0] &&
  point[0] >= rectangle.position[0] &&
  point[1] <= rectangle.position[1] + rectangle.size[1] &&
  point[1] >= rectangle.position[1]

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

export const detectCircleCircleCollision = ({
  circle1,
  circle2,
}: {
  circle1: {
    position: Vector2D
    radius: number
  }
  circle2: {
    position: Vector2D
    radius: number
  }
}) => {
  const distance = magnitude(sub(circle1.position, circle2.position))

  return distance <= circle1.radius + circle2.radius
}

/**
 * @url http://jeffreythompson.org/collision-detection/circle-rect.php
 */
export const detectRectangleCircleCollision = ({
  circle,
  rectangle,
}: {
  circle: {
    position: Vector2D
    radius: number
  }
  rectangle: {
    position: Vector2D
    size: Vector2D
  }
}) => {
  const test: Vector2D = [0, 0]

  if (circle.position[0] < rectangle.position[0]) {
    test[0] = rectangle.position[0]
  } else if (circle.position[0] > rectangle.position[0] + rectangle.size[0]) {
    test[0] = rectangle.position[0] + rectangle.size[0]
  }

  if (circle.position[1] < rectangle.position[1]) {
    test[1] = rectangle.position[1]
  } else if (circle.position[1] > rectangle.position[1] + rectangle.size[1]) {
    test[1] = rectangle.position[1] + rectangle.size[1]
  }

  const distX = circle.position[0] - test[0]
  const distY = circle.position[1] - test[1]
  const distance = Math.sqrt(distX ** 2 + distY ** 2)

  const isColliding = distance <= circle.radius

  return isColliding
}

/**
 *
 * @url http://jeffreythompson.org/collision-detection/line-point.php#not-a-line
 */
export const detectPointLineCollision = ({
  line,
  point,
}: {
  line: { position: Vector2D; position2: Vector2D }
  point: Vector2D
}) => {
  const lineLength = magnitude(sub(line.position, line.position2))

  const distance1 = magnitude(sub(point, line.position))
  const distance2 = magnitude(sub(point, line.position2))

  const isColliding = lineLength === distance1 + distance2

  return isColliding
}

/**
 *
 * @url http://jeffreythompson.org/collision-detection/line-circle.php
 */
export const detectCircleLineCollision = ({
  circle,
  line,
}: {
  circle: {
    position: Vector2D
    radius: number
  }
  line: { position: Vector2D; position2: Vector2D }
}) => {
  const inside1 = detectPointCircleCollision({ circle, point: line.position })
  if (inside1) return true
  const inside2 = detectPointCircleCollision({ circle, point: line.position2 })
  if (inside2) return true

  const distX = line.position[0] - line.position2[0]
  const distY = line.position[1] - line.position2[1]
  const len = Math.sqrt(distX * distX + distY * distY)

  const dot =
    ((circle.position[0] - line.position[0]) *
      (line.position2[0] - line.position[0]) +
      (circle.position[1] - line.position[1]) *
        (line.position2[1] - line.position[1])) /
    len ** 2

  const closestX =
    line.position[0] + dot * (line.position2[0] - line.position[0])
  const closestY =
    line.position[1] + dot * (line.position2[0] - line.position[1])

  const onSegment = detectPointLineCollision({
    line,
    point: [closestX, closestY],
  })
  if (!onSegment) return false

  const dist = [closestX - circle.position[0], closestY - circle.position[1]]
  const distance = Math.sqrt(dist[0] * dist[0] + dist[1] * dist[1])

  const isColliding = distance <= circle.radius

  return isColliding
}
