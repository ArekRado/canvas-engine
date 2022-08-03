import { add, Vector2D } from '@arekrado/vector-2d'
import {
  Transform,
  Collider,
  ColliderDataLine,
  ColliderDataCircle,
  ColliderDataRectangle,
  ColliderDataPoint,
  ColliderDataPolygon,
} from '../../type'
import {
  Circle,
  getCircleCircleIntersection,
  getCircleLineIntersection,
  getLineLineIntersection,
  getPointCircleIntersection,
  getPointLineIntersection,
  getPointPointIntersection,
  getPolygonCircleIntersection,
  getPolygonLineIntersection,
  getPolygonPointIntersection,
  getPolygonPolygonIntersection,
  Intersection,
  Line,
  Point,
  Polygon,
} from './getIntersection'
import { applyMatrixToVector2D, rotate } from '../../util/matrix'
import { createCacheContainer } from '../../util/cache'

export const cache = createCacheContainer<Vector2D>()

export const applyTransformsToPosition = ({
  colliderPosition,
  transform,
}: {
  colliderPosition: Vector2D
  transform: Transform
}): Vector2D => {
  const position = add(
    [transform.position[0], transform.position[1]],
    colliderPosition,
  )

  const rotatedPosition = applyMatrixToVector2D(
    rotate(transform.rotation),
    position,
  )

  return rotatedPosition
}

type MapToShapeParams<ColliderData> = {
  transform: Transform
  colliderData: ColliderData
}

export const mapToPolygon = ({
  transform,
  colliderData,
}: MapToShapeParams<ColliderDataPolygon>): Polygon => {
  return colliderData.verticles.reduce((acc, point) => {
    const newPoint = applyTransformsToPosition({
      colliderPosition: point,
      transform,
    })

    acc.push(newPoint)

    return acc
  }, [] as Vector2D[])
}

const mapToLine = ({
  transform,
  colliderData,
}: MapToShapeParams<ColliderDataLine>): Line => {
  return {
    position: applyTransformsToPosition({
      colliderPosition: colliderData.position,
      transform,
    }),
    position2: applyTransformsToPosition({
      colliderPosition: colliderData.position2,
      transform,
    }),
  }
}

const mapToCircle = ({
  transform,
  colliderData,
}: MapToShapeParams<ColliderDataCircle>): Circle => {
  return {
    position: applyTransformsToPosition({
      colliderPosition: colliderData.position,
      transform,
    }),
    radius: colliderData.radius,
  }
}

export const mapRectangleToPolygon = ({
  transform,
  colliderData,
}: MapToShapeParams<ColliderDataRectangle>): Polygon => {
  return mapToPolygon({
    transform,
    colliderData: {
      type: 'polygon',
      verticles: [
        [colliderData.position[0], colliderData.position[1]],
        [
          colliderData.position[0] + colliderData.size[0],
          colliderData.position[1],
        ],
        [
          colliderData.position[0] + colliderData.size[0],
          colliderData.position[1] + colliderData.size[1],
        ],
        [
          colliderData.position[0],
          colliderData.position[1] + colliderData.size[1],
        ],
      ],
    },
  })
}

const mapToPoint = ({
  transform,
  colliderData,
}: MapToShapeParams<ColliderDataPoint>): Point =>
  applyTransformsToPosition({
    colliderPosition: colliderData.position,
    transform,
  })

type CollisionType = 'point' | 'rectangle' | 'circle' | 'line' | 'polygon'
export type CollisionDetectorNormalizer = (params: {
  transform1: Transform
  collider1Data: Collider['data']
  transform2: Transform
  collider2Data: Collider['data']
}) => Intersection | null
type CollisionsMatrix = Record<
  CollisionType,
  Record<CollisionType, CollisionDetectorNormalizer>
>

//
// Circle
//
const circleCircleDetector: CollisionDetectorNormalizer = ({
  transform1,
  collider1Data,
  transform2,
  collider2Data,
}) =>
  getCircleCircleIntersection({
    circle1: mapToCircle({
      transform: transform1,
      colliderData: collider1Data as ColliderDataCircle,
    }),
    circle2: mapToCircle({
      transform: transform2,
      colliderData: collider2Data as ColliderDataCircle,
    }),
  })
const circleLineDetector: CollisionDetectorNormalizer = ({
  transform1,
  collider1Data,
  transform2,
  collider2Data,
}) =>
  getCircleLineIntersection({
    circle: mapToCircle({
      transform: transform1,
      colliderData: collider1Data as ColliderDataCircle,
    }),
    line: mapToLine({
      transform: transform2,
      colliderData: collider2Data as ColliderDataLine,
    }),
  })
const circlePointDetector: CollisionDetectorNormalizer = ({
  transform1,
  collider1Data,
  transform2,
  collider2Data,
}) =>
  getPointCircleIntersection({
    circle: mapToCircle({
      transform: transform1,
      colliderData: collider1Data as ColliderDataCircle,
    }),
    point: mapToPoint({
      transform: transform2,
      colliderData: collider2Data as ColliderDataPoint,
    }),
  })
const circleRectangleDetector: CollisionDetectorNormalizer = ({
  transform1,
  collider1Data,
  transform2,
  collider2Data,
}) =>
  getPolygonCircleIntersection({
    circle: mapToCircle({
      transform: transform1,
      colliderData: collider1Data as ColliderDataCircle,
    }),
    polygon: mapRectangleToPolygon({
      transform: transform2,
      colliderData: collider2Data as ColliderDataRectangle,
    }),
  })
const circlePolygonDetector: CollisionDetectorNormalizer = ({
  transform1,
  collider1Data,
  transform2,
  collider2Data,
}) =>
  getPolygonCircleIntersection({
    circle: mapToCircle({
      transform: transform1,
      colliderData: collider1Data as ColliderDataCircle,
    }),
    polygon: mapToPolygon({
      transform: transform2,
      colliderData: collider2Data as ColliderDataPolygon,
    }),
  })

//
// Line
//
const lineCircleDetector: CollisionDetectorNormalizer = ({
  transform1,
  collider1Data,
  transform2,
  collider2Data,
}) =>
  getCircleLineIntersection({
    line: mapToLine({
      transform: transform1,
      colliderData: collider1Data as ColliderDataLine,
    }),
    circle: mapToCircle({
      transform: transform2,
      colliderData: collider2Data as ColliderDataCircle,
    }),
  })
const lineLineDetector: CollisionDetectorNormalizer = ({
  transform1,
  collider1Data,
  transform2,
  collider2Data,
}) =>
  getLineLineIntersection({
    line1: mapToLine({
      transform: transform1,
      colliderData: collider1Data as ColliderDataLine,
    }),
    line2: mapToLine({
      transform: transform2,
      colliderData: collider2Data as ColliderDataLine,
    }),
  })
const linePointDetector: CollisionDetectorNormalizer = ({
  transform1,
  collider1Data,
  transform2,
  collider2Data,
}) =>
  getPointLineIntersection({
    line: mapToLine({
      transform: transform1,
      colliderData: collider1Data as ColliderDataLine,
    }),
    point: mapToPoint({
      transform: transform2,
      colliderData: collider2Data as ColliderDataPoint,
    }),
  })
const lineRectangleDetector: CollisionDetectorNormalizer = ({
  transform1,
  collider1Data,
  transform2,
  collider2Data,
}) =>
  getPolygonLineIntersection({
    line: mapToLine({
      transform: transform1,
      colliderData: collider1Data as ColliderDataLine,
    }),
    polygon: mapRectangleToPolygon({
      transform: transform2,
      colliderData: collider2Data as ColliderDataRectangle,
    }),
  })
const linePolygonDetector: CollisionDetectorNormalizer = ({
  transform1,
  collider1Data,
  transform2,
  collider2Data,
}) =>
  getPolygonLineIntersection({
    line: mapToLine({
      transform: transform1,
      colliderData: collider1Data as ColliderDataLine,
    }),
    polygon: mapToPolygon({
      transform: transform2,
      colliderData: collider2Data as ColliderDataPolygon,
    }),
  })

//
// Point
//
const pointCircleDetector: CollisionDetectorNormalizer = ({
  transform1,
  collider1Data,
  transform2,
  collider2Data,
}) =>
  getPointCircleIntersection({
    point: mapToPoint({
      transform: transform1,
      colliderData: collider1Data as ColliderDataPoint,
    }),
    circle: mapToCircle({
      transform: transform2,
      colliderData: collider2Data as ColliderDataCircle,
    }),
  })
const pointLineDetector: CollisionDetectorNormalizer = ({
  transform1,
  collider1Data,
  transform2,
  collider2Data,
}) =>
  getPointLineIntersection({
    point: mapToPoint({
      transform: transform1,
      colliderData: collider1Data as ColliderDataPoint,
    }),
    line: mapToLine({
      transform: transform2,
      colliderData: collider2Data as ColliderDataLine,
    }),
  })
const pointPointDetector: CollisionDetectorNormalizer = ({
  transform1,
  collider1Data,
  transform2,
  collider2Data,
}) =>
  getPointPointIntersection({
    point1: mapToPoint({
      transform: transform1,
      colliderData: collider1Data as ColliderDataPoint,
    }),
    point2: mapToPoint({
      transform: transform2,
      colliderData: collider2Data as ColliderDataPoint,
    }),
  })
const pointRectangleDetector: CollisionDetectorNormalizer = ({
  transform1,
  collider1Data,
  transform2,
  collider2Data,
}) =>
  getPolygonPointIntersection({
    point: mapToPoint({
      transform: transform1,
      colliderData: collider1Data as ColliderDataPoint,
    }),
    polygon: mapRectangleToPolygon({
      transform: transform2,
      colliderData: collider2Data as ColliderDataRectangle,
    }),
  })
const pointPolygonDetector: CollisionDetectorNormalizer = ({
  transform1,
  collider1Data,
  transform2,
  collider2Data,
}) =>
  getPolygonPointIntersection({
    point: mapToPoint({
      transform: transform1,
      colliderData: collider1Data as ColliderDataPoint,
    }),
    polygon: mapToPolygon({
      transform: transform2,
      colliderData: collider2Data as ColliderDataPolygon,
    }),
  })

//
// Rectangle
//
const rectangleCircleDetector: CollisionDetectorNormalizer = ({
  transform1,
  collider1Data,
  transform2,
  collider2Data,
}) =>
  getPolygonCircleIntersection({
    polygon: mapRectangleToPolygon({
      transform: transform1,
      colliderData: collider1Data as ColliderDataRectangle,
    }),
    circle: mapToCircle({
      transform: transform2,
      colliderData: collider2Data as ColliderDataCircle,
    }),
  })
const rectangleLineDetector: CollisionDetectorNormalizer = ({
  transform1,
  collider1Data,
  transform2,
  collider2Data,
}) =>
  getPolygonLineIntersection({
    polygon: mapRectangleToPolygon({
      transform: transform1,
      colliderData: collider1Data as ColliderDataRectangle,
    }),
    line: mapToLine({
      transform: transform2,
      colliderData: collider2Data as ColliderDataLine,
    }),
  })
const rectanglePointDetector: CollisionDetectorNormalizer = ({
  transform1,
  collider1Data,
  transform2,
  collider2Data,
}) =>
  getPolygonPointIntersection({
    polygon: mapRectangleToPolygon({
      transform: transform1,
      colliderData: collider1Data as ColliderDataRectangle,
    }),
    point: mapToPoint({
      transform: transform2,
      colliderData: collider2Data as ColliderDataPoint,
    }),
  })
const rectangleRectangleDetector: CollisionDetectorNormalizer = ({
  transform1,
  collider1Data,
  transform2,
  collider2Data,
}) =>
  getPolygonPolygonIntersection({
    polygon1: mapRectangleToPolygon({
      transform: transform1,
      colliderData: collider1Data as ColliderDataRectangle,
    }),
    polygon2: mapRectangleToPolygon({
      transform: transform2,
      colliderData: collider2Data as ColliderDataRectangle,
    }),
  })
const rectanglePolygonDetector: CollisionDetectorNormalizer = ({
  transform1,
  collider1Data,
  transform2,
  collider2Data,
}) =>
  getPolygonPolygonIntersection({
    polygon1: mapRectangleToPolygon({
      transform: transform1,
      colliderData: collider1Data as ColliderDataRectangle,
    }),
    polygon2: mapToPolygon({
      transform: transform2,
      colliderData: collider2Data as ColliderDataPolygon,
    }),
  })

//
// Polygon
//
const polygonCircleDetector: CollisionDetectorNormalizer = ({
  transform1,
  collider1Data,
  transform2,
  collider2Data,
}) =>
  getPolygonCircleIntersection({
    polygon: mapToPolygon({
      transform: transform1,
      colliderData: collider1Data as ColliderDataPolygon,
    }),
    circle: mapToCircle({
      transform: transform2,
      colliderData: collider2Data as ColliderDataCircle,
    }),
  })
const polygonLineDetector: CollisionDetectorNormalizer = ({
  transform1,
  collider1Data,
  transform2,
  collider2Data,
}) =>
  getPolygonLineIntersection({
    polygon: mapToPolygon({
      transform: transform1,
      colliderData: collider1Data as ColliderDataPolygon,
    }),
    line: mapToLine({
      transform: transform2,
      colliderData: collider2Data as ColliderDataLine,
    }),
  })
const polygonPointDetector: CollisionDetectorNormalizer = ({
  transform1,
  collider1Data,
  transform2,
  collider2Data,
}) =>
  getPolygonPointIntersection({
    polygon: mapToPolygon({
      transform: transform1,
      colliderData: collider1Data as ColliderDataPolygon,
    }),
    point: mapToPoint({
      transform: transform2,
      colliderData: collider2Data as ColliderDataPoint,
    }),
  })
const polygonRectangleDetector: CollisionDetectorNormalizer = ({
  transform1,
  collider1Data,
  transform2,
  collider2Data,
}) =>
  getPolygonPolygonIntersection({
    polygon1: mapToPolygon({
      transform: transform1,
      colliderData: collider1Data as ColliderDataPolygon,
    }),
    polygon2: mapRectangleToPolygon({
      transform: transform2,
      colliderData: collider2Data as ColliderDataRectangle,
    }),
  })
const polygonPolygonDetector: CollisionDetectorNormalizer = ({
  transform1,
  collider1Data,
  transform2,
  collider2Data,
}) =>
  getPolygonPolygonIntersection({
    polygon1: mapToPolygon({
      transform: transform1,
      colliderData: collider1Data as ColliderDataPolygon,
    }),
    polygon2: mapToPolygon({
      transform: transform2,
      colliderData: collider2Data as ColliderDataPolygon,
    }),
  })

export const collisionsMatrix: CollisionsMatrix = {
  circle: {
    circle: circleCircleDetector,
    line: circleLineDetector,
    point: circlePointDetector,
    rectangle: circleRectangleDetector,
    polygon: circlePolygonDetector,
  },
  line: {
    circle: lineCircleDetector,
    line: lineLineDetector,
    point: linePointDetector,
    rectangle: lineRectangleDetector,
    polygon: linePolygonDetector,
  },
  point: {
    circle: pointCircleDetector,
    line: pointLineDetector,
    point: pointPointDetector,
    rectangle: pointRectangleDetector,
    polygon: pointPolygonDetector,
  },
  rectangle: {
    circle: rectangleCircleDetector,
    line: rectangleLineDetector,
    point: rectanglePointDetector,
    rectangle: rectangleRectangleDetector,
    polygon: rectanglePolygonDetector,
  },
  polygon: {
    circle: polygonCircleDetector,
    line: polygonLineDetector,
    point: polygonPointDetector,
    rectangle: polygonRectangleDetector,
    polygon: polygonPolygonDetector,
  },
}
