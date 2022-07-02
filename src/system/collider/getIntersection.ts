import {
  add,
  equals,
  magnitude,
  normalize,
  scale,
  sub,
  Vector2D,
} from '@arekrado/vector-2d'

export type Point = Vector2D
export type Circle = { position: Vector2D; radius: number }
export type Rectangle = { position: Vector2D; size: Vector2D }
export type Line = { position: Vector2D; position2: Vector2D }
export type Polygon = Vector2D[]
export type Intersection = {
  position: Vector2D
  figure:
    | {
        type: 'circle'
        data: Circle
      }
    | {
        type: 'line'
        data: Line
      }
    | {
        type: 'point'
        data: Point
      }
}

/**
 * XXXXXXXXX | point                         | rectangle                         | circle                       | line                       | polygon
 * point     | getPointPointIntersection     | x                                 | x                            | x                          | x
 * rectangle | getPointrectangleIntersection | getRectangleRectangleIntersection | x                            | x                          | getPolygonPolygonIntersection
 * circle    | getPointCircleIntersection    | getRectangleCircleIntersection    | getCircleCircleIntersection  | x                          | x
 * line      | getPointLineIntersection      | getRectangleLineIntersection      | getCircleLineIntersection    | getLineLineIntersection    | x
 * polygon   | getPolygonPointIntersection   | getPolygonPolygonIntersection     | getPolygonCircleIntersection | getPolygonLineIntersection | getPolygonPolygonIntersection
 */

export const getPointPointIntersection = ({
  point1,
  point2,
}: {
  point1: Point
  point2: Point
}): Intersection | null =>
  equals(point1, point2)
    ? {
        position: point1,
        figure: {
          type: 'point',
          data: point1,
        },
      }
    : null

// export const getRectangleRectangleIntersection = ({
//   rectangle1: {
//     position: [x1, y1],
//     size: [size1x, size1y],
//   },
//   rectangle2: {
//     position: [x2, y2],
//     size: [size2x, size2y],
//   },
// }: {
//   rectangle1: Rectangle
//   rectangle2: Rectangle
// }) =>
//   x1 <= x2 + size2x &&
//   x1 + size1x >= x2 &&
//   y1 <= y2 + size2y &&
//   y1 + size1y >= y2

// export const getPointRectangleIntersection = ({
//   point,
//   rectangle,
// }: {
//   point: Point
//   rectangle: Rectangle
// }) =>
//   point[0] <= rectangle.position[0] + rectangle.size[0] &&
//   point[0] >= rectangle.position[0] &&
//   point[1] <= rectangle.position[1] + rectangle.size[1] &&
//   point[1] >= rectangle.position[1]

export const getPointCircleIntersection = ({
  point,
  circle,
}: {
  point: Point
  circle: Circle
}): Intersection | null => {
  const distance = magnitude(sub(point, circle.position))
  if (distance <= circle.radius) {
    return {
      position: point,
      figure: { type: 'point', data: point },
    }
  }
  return null
}

export const getCircleCircleIntersection = ({
  circle1,
  circle2,
}: {
  circle1: Circle
  circle2: Circle
}): Intersection | null => {
  const positionDiff = sub(circle1.position, circle2.position)
  const distance = magnitude(positionDiff)

  if (distance <= circle1.radius + circle2.radius) {
    return {
      position: add(
        circle2.position,
        scale(circle2.radius, normalize(positionDiff)),
      ),
      figure: {
        type: 'circle',
        data: circle2,
      },
    }
  }

  return null
}

// /**
//  * @url http://jeffreythompson.org/collisiIntersection/circle-rect.php
//  */
// export const getRectangleCircleIntersection = ({
//   circle,
//   rectangle,
// }: {
//   circle: Circle
//   rectangle: Rectangle
// }) => {
//   const test: Vector2D = [0, 0]

//   if (circle.position[0] < rectangle.position[0]) {
//     test[0] = rectangle.position[0]
//   } else if (circle.position[0] > rectangle.position[0] + rectangle.size[0]) {
//     test[0] = rectangle.position[0] + rectangle.size[0]
//   }

//   if (circle.position[1] < rectangle.position[1]) {
//     test[1] = rectangle.position[1]
//   } else if (circle.position[1] > rectangle.position[1] + rectangle.size[1]) {
//     test[1] = rectangle.position[1] + rectangle.size[1]
//   }

//   const distX = circle.position[0] - test[0]
//   const distY = circle.position[1] - test[1]
//   const distance = Math.sqrt(distX ** 2 + distY ** 2)

//   const isColliding = distance <= circle.radius

//   return isColliding
// }

/**
 *
 * @see http://jeffreythompson.org/collisiIntersection/line-point.php#not-a-line
 */
export const getPointLineIntersection = ({
  line,
  point,
}: {
  line: Line
  point: Point
}): Intersection | null => {
  const lineLength = magnitude(sub(line.position, line.position2))

  const distance1 = magnitude(sub(point, line.position))
  const distance2 = magnitude(sub(point, line.position2))

  return lineLength === distance1 + distance2
    ? {
        position: point,
        figure: {
          type: 'line',
          data: line,
        },
      }
    : null
}

/**
 *
 * @see http://jeffreythompson.org/collisiIntersection/line-circle.php
 */
export const getCircleLineIntersection = ({
  circle,
  line,
}: {
  circle: Circle
  line: Line
}): Intersection | null => {
  const inside1 = getPointCircleIntersection({ circle, point: line.position })
  if (inside1) return inside1
  const inside2 = getPointCircleIntersection({ circle, point: line.position2 })
  if (inside2) return inside2

  const x1 = line.position[0]
  const y1 = line.position[1]
  const x2 = line.position2[0]
  const y2 = line.position2[1]
  const cx = circle.position[0]
  const cy = circle.position[1]

  // get length of the line
  let distX = x1 - x2
  let distY = y1 - y2
  const len = Math.sqrt(distX * distX + distY * distY)

  // get dot product of the line and circle
  const dot = ((cx - x1) * (x2 - x1) + (cy - y1) * (y2 - y1)) / Math.pow(len, 2)

  // find the closest point on the line
  const closestX = x1 + dot * (x2 - x1)
  const closestY = y1 + dot * (y2 - y1)

  // is this point actually on the line segment?
  // if so keep going, but if not, return false
  const onSegment = getPointLineIntersection({
    line,
    point: [closestX, closestY],
  })
  if (onSegment === null) return null

  // get distance to closest point
  distX = closestX - cx
  distY = closestY - cy
  const distance = Math.sqrt(distX * distX + distY * distY)

  if (distance <= circle.radius) {
    return {
      position: [closestX, closestY],
      figure: {
        type: 'line',
        data: line,
      },
    }
  }
  return null
}

/**
 *
 * @see http://jeffreythompson.org/collisiIntersection/line-line.php
 */
export const getLineLineIntersection = ({
  line1,
  line2,
}: {
  line1: Line
  line2: Line
}): Intersection | null => {
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
    // collision point
    const intersectionX = x1 + uA * (x2 - x1)
    const intersectionY = y1 + uA * (y2 - y1)

    return {
      position: [intersectionX, intersectionY],
      figure: {
        type: 'line',
        data: line2,
      },
    }
  }
  return null
}

// /**
//  *
//  * @see http://jeffreythompson.org/collisiIntersection/line-rect.php
//  */
// export const getRectangleLineIntersection = ({
//   line,
//   rectangle,
// }: {
//   line: Line
//   rectangle: Rectangle
// }) => {
//   // (rx, ry, rx, ry + rh)
//   const left = getLineLineIntersection({
//     line1: line,
//     line2: {
//       position: rectangle.position,
//       position2: [
//         rectangle.position[0],
//         rectangle.position[1] + rectangle.size[0],
//       ],
//     },
//   })

//   if (left) return left
//   // (rx + rw, ry, rx + rw, ry + rh)
//   const right = getLineLineIntersection({
//     line1: line,
//     line2: {
//       position: rectangle.position,
//       position2: [
//         rectangle.position[0] + rectangle.size[0],
//         rectangle.position[1] + rectangle.size[1],
//       ],
//     },
//   })

//   if (right) return right
//   // (rx, ry, rx + rw, ry)
//   const top = getLineLineIntersection({
//     line1: line,
//     line2: {
//       position: rectangle.position,
//       position2: [
//         rectangle.position[0] + rectangle.size[0],
//         rectangle.position[1],
//       ],
//     },
//   })

//   if (top) return top

//   // (rx, ry + rh, rx + rw, ry + rh)
//   const bottom = getLineLineIntersection({
//     line1: line,
//     line2: {
//       position: [
//         rectangle.position[0],
//         rectangle.position[1] + rectangle.size[1],
//       ],
//       position2: [
//         rectangle.position[0] + rectangle.size[0],
//         rectangle.position[1] + rectangle.size[1],
//       ],
//     },
//   })

//   return bottom
// }

export const getPolygonPointIntersection = ({
  polygon,
  point,
}: {
  polygon: Polygon
  point: Point
}): Intersection | null => {
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
    ? {
        position: point,
        figure: {
          type: 'point',
          data: point,
        },
      }
    : null
}

export const getPolygonCircleIntersection = ({
  polygon,
  circle,
}: {
  polygon: Polygon
  circle: Circle
}): Intersection | null => {
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
    const intersectionPoint = getCircleLineIntersection({
      line: {
        position: vc,
        position2: vn,
      },
      circle,
    })

    if (intersectionPoint !== null) return intersectionPoint
  }

  // the above algorithm only checks if the circle
  // is touching the edges of the polygon – in most
  // cases this is enough, but you can un-comment the
  // following code to also test if the center of the
  // circle is inside the polygon
  // const centerInside = getPolygonPointIntersection({
  //   polygon,
  //   point: circle.position,
  // })
  // if (centerInside) return true

  // otherwise, after all that, return false
  return null
}

// TODO: polygoIntersection should use rectangIntersection first to improve speed
export const getPolygonLineIntersection = ({
  polygon,
  line,
}: {
  polygon: Polygon
  line: Line
}): Intersection | null => {
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
    const hit = getLineLineIntersection({
      line1: line,
      line2: {
        // get the PVectors at our current position
        // extract X/Y coordinates from each
        position: polygon[current],
        position2: polygon[next],
      },
    })

    if (hit) {
      return hit
    }
  }

  // never got a hit
  return null
}

export const getPolygonPolygonIntersection = ({
  polygon1,
  polygon2,
}: {
  polygon1: Polygon
  polygon2: Polygon
}): Intersection | null => {
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
    const collision = getPolygonLineIntersection({
      polygon: polygon2,
      line: {
        // get the PVectors at our current position
        // this makes our if statement a little cleaner
        position: polygon1[current],
        position2: polygon1[next],
      },
    })
    if (collision) return collision

    // optional: check if the 2nd polygon is INSIDE the first
    // collision = polyPoint(p1, p2[0].x, p2[0].y);
    // if (collision) return true;
  }

  return null
}
