import { equals, magnitude, sub, Vector2D } from '@arekrado/vector-2d'

export type Point = Vector2D
export type Circle = { position: Vector2D; radius: number }
export type Rectangle = { position: Vector2D; size: Vector2D }
export type Line = { position: Vector2D; position2: Vector2D }
export type Polygon = Vector2D[]

/**
 * XXXXXXXXX | point                         | rectangle                         | circle                       | line                       | polygon
 * point     | detectPointPointCollision     | x                                 | x                            | x                          | x
 * rectangle | detectPointrectangleCollision | detectRectangleRectangleCollision | x                            | x                          | detectPolygonPolygonCollision
 * circle    | detectPointCircleCollision    | detectRectangleCircleCollision    | detectCircleCircleCollision  | x                          | x
 * line      | detectPointLineCollision      | detectRectangleLineCollision      | detectCircleLineCollision    | detectLineLineCollision    | x
 * polygon   | detectPolygonPointCollision   | detectPolygonPolygonCollision     | detectPolygonCircleCollision | detectPolygonLineCollision | detectPolygonPolygonCollision
 */

export const detectPointPointCollision = ({
  point1,
  point2,
}: {
  point1: Point
  point2: Point
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
  rectangle1: Rectangle
  rectangle2: Rectangle
}) =>
  x1 <= x2 + size2x &&
  x1 + size1x >= x2 &&
  y1 <= y2 + size2y &&
  y1 + size1y >= y2

export const detectPointRectangleCollision = ({
  point,
  rectangle,
}: {
  point: Point
  rectangle: Rectangle
}) =>
  point[0] <= rectangle.position[0] + rectangle.size[0] &&
  point[0] >= rectangle.position[0] &&
  point[1] <= rectangle.position[1] + rectangle.size[1] &&
  point[1] >= rectangle.position[1]

export const detectPointCircleCollision = ({
  point,
  circle,
}: {
  point: Point
  circle: Circle
}) => {
  const distance = magnitude(sub(point, circle.position))

  return distance <= circle.radius
}

export const detectCircleCircleCollision = ({
  circle1,
  circle2,
}: {
  circle1: Circle
  circle2: Circle
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
  circle: Circle
  rectangle: Rectangle
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
 * @see http://jeffreythompson.org/collision-detection/line-point.php#not-a-line
 */
export const detectPointLineCollision = ({
  line,
  point,
}: {
  line: Line
  point: Point
}) => {
  const lineLength = magnitude(sub(line.position, line.position2))

  const distance1 = magnitude(sub(point, line.position))
  const distance2 = magnitude(sub(point, line.position2))

  const isColliding = lineLength === distance1 + distance2

  return isColliding
}

/**
 *
 * @see http://jeffreythompson.org/collision-detection/line-circle.php
 */
export const detectCircleLineCollision = ({
  circle,
  line,
}: {
  circle: Circle
  line: Line
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

/**
 *
 * @see http://jeffreythompson.org/collision-detection/line-line.php
 */
export const detectLineLineCollision = ({
  line1,
  line2,
}: {
  line1: Line
  line2: Line
}) => {
  const x1 = line1.position[0]
  const y1 = line1.position[1]
  const x2 = line1.position2[0]
  const y2 = line1.position2[1]

  const x3 = line2.position[0]
  const y3 = line2.position[1]
  const x4 = line2.position2[0]
  const y4 = line2.position2[1]

  const uA =
    ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) /
    ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))

  const uB =
    ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) /
    ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))

  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
    return true
  }
  return false

  // collision point
  // float intersectionX = x1 + (uA * (x2-x1));
  // float intersectionY = y1 + (uA * (y2-y1));
}

/**
 *
 * @see http://jeffreythompson.org/collision-detection/line-rect.php
 */
export const detectRectangleLineCollision = ({
  line,
  rectangle,
}: {
  line: Line
  rectangle: Rectangle
}) => {
  // (rx, ry, rx, ry + rh)
  const left = detectLineLineCollision({
    line1: line,
    line2: {
      position: rectangle.position,
      position2: [
        rectangle.position[0],
        rectangle.position[1] + rectangle.size[0],
      ],
    },
  })

  if (left) return true
  // (rx + rw, ry, rx + rw, ry + rh)
  const right = detectLineLineCollision({
    line1: line,
    line2: {
      position: rectangle.position,
      position2: [
        rectangle.position[0] + rectangle.size[0],
        rectangle.position[1] + rectangle.size[1],
      ],
    },
  })

  if (right) return true
  // (rx, ry, rx + rw, ry)
  const top = detectLineLineCollision({
    line1: line,
    line2: {
      position: rectangle.position,
      position2: [
        rectangle.position[0] + rectangle.size[0],
        rectangle.position[1],
      ],
    },
  })

  if (top) return true

  // (rx, ry + rh, rx + rw, ry + rh)
  const bottom = detectLineLineCollision({
    line1: line,
    line2: {
      position: [
        rectangle.position[0],
        rectangle.position[1] + rectangle.size[1],
      ],
      position2: [
        rectangle.position[0] + rectangle.size[0],
        rectangle.position[1] + rectangle.size[1],
      ],
    },
  })

  if (bottom) return true

  return false
}

export const detectPolygonPointCollision = ({
  polygon,
  point,
}: {
  polygon: Polygon
  point: Point
}) => {
  let collision = false

  // go through each of the vertices, plus
  // the next vertex in the list
  let next = 0
  for (let current = 0; current < polygon.length; current++) {
    // get next vertex in list
    // if we've hit the end, wrap around to 0
    next = current + 1
    if (next == polygon.length) next = 0

    // get the PVectors at our current position
    // this makes our if statement a little cleaner
    const vc: Vector2D = polygon[current] // c for "current"
    const vn: Vector2D = polygon[next] // n for "next"

    // compare position, flip 'collision' variable
    // back and forth
    if (
      ((vc[1] >= point[1] && vn[1] < point[1]) ||
        (vc[1] < point[1] && vn[1] >= point[1])) &&
      point[0] <
        ((vn[0] - vc[0]) * (point[1] - vc[1])) / (vn[1] - vc[1]) + vc[0]
    ) {
      collision = !collision
    }
  }
  return collision
}

export const detectPolygonCircleCollision = ({
  polygon,
  circle,
}: {
  polygon: Polygon
  circle: Circle
}) => {
  // go through each of the vertices, plus
  // the next vertex in the list
  let next = 0
  for (let current = 0; current < polygon.length; current++) {
    // get next vertex in list
    // if we've hit the end, wrap around to 0
    next = current + 1
    if (next == polygon.length) next = 0

    // get the PVectors at our current position
    // this makes our if statement a little cleaner
    const vc = polygon[current] // c for "current"
    const vn = polygon[next] // n for "next"

    // check for collision between the circle and
    // a line formed between the two vertices
    const collision = detectCircleLineCollision({
      line: {
        position: vc,
        position2: vn,
      },
      circle,
    })

    if (collision) return true
  }

  // the above algorithm only checks if the circle
  // is touching the edges of the polygon – in most
  // cases this is enough, but you can un-comment the
  // following code to also test if the center of the
  // circle is inside the polygon
  // const centerInside = detectPolygonPointCollision({
  //   polygon,
  //   point: circle.position,
  // })
  // if (centerInside) return true

  // otherwise, after all that, return false
  return false
}

// TODO: polygon detections should use rectangle detection first to improve speed
export const detectPolygonLineCollision = ({
  polygon,
  line,
}: {
  polygon: Polygon
  line: Line
}) => {
  // go through each of the vertices, plus the next
  // vertex in the list
  let next = 0
  for (let current = 0; current < polygon.length; current++) {
    // get next vertex in list
    // if we've hit the end, wrap around to 0
    next = current + 1
    if (next == polygon.length) next = 0

    // do a Line/Line comparison
    // if true, return 'true' immediately and
    // stop testing (faster)
    const hit = detectLineLineCollision({
      line1: line,
      line2: {
        // get the PVectors at our current position
        // extract X/Y coordinates from each
        position: polygon[current],
        position2: polygon[next],
      },
    })

    if (hit) {
      return true
    }
  }

  // never got a hit
  return false
}

export const detectPolygonPolygonCollision = ({
  polygon1,
  polygon2,
}: {
  polygon1: Polygon
  polygon2: Polygon
}) => {
  // go through each of the vertices, plus the next
  // vertex in the list
  let next = 0
  for (let current = 0; current < polygon1.length; current++) {
    // get next vertex in list
    // if we've hit the end, wrap around to 0
    next = current + 1
    if (next == polygon1.length) next = 0

    // now we can use these two points (a line) to compare
    // to the other polygon's vertices using polyLine()
    const collision = detectPolygonLineCollision({
      polygon: polygon2,
      line: {
        // get the PVectors at our current position
        // this makes our if statement a little cleaner
        position: polygon1[current],
        position2: polygon1[next],
      },
    })
    if (collision) return true

    // optional: check if the 2nd polygon is INSIDE the first
    // collision = polyPoint(p1, p2[0].x, p2[0].y);
    // if (collision) return true;
  }

  return false
}
