import { add, Vector2D } from '@arekrado/vector-2d'
import {
  InternalInitialState,
  Transform,
  Collider,
  ColliderDataLine,
  ColliderDataCircle,
  ColliderDataRectangle,
  ColliderDataPoint,
  ColliderDataPolygon,
  Entity,
  ECSEvent,
} from '../../type'
import { createSystem, systemPriority } from '../createSystem'
import { getComponent } from '../../component/getComponent'
import { componentName } from '../../component/componentName'
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
import { updateCollider } from './colliderCrud'
import { getTransform } from '../transform/transformCrud'
import { applyMatrixToVector2D, rotate } from '../../util/matrix'
import { emitEvent } from '../../event'
import { hasSameLayer } from './hasSameLayer'

export type CollisionEvent = ECSEvent<
  'collision',
  {
    entity: Entity
    colliderEntity: Entity
    intersection: Intersection
  }
>

const applyTransformsToPosition = ({
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

const mapToPolygon = ({
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

const mapRectangleToPolygon = ({
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

type CollisionType = 'point' | 'rectangle' | 'circle' | 'line'
export type CollisionDetectorNormalizer = (params: {
  transform1: Transform
  collider1Data: Collider['data'][0]
  transform2: Transform
  collider2Data: Collider['data'][0]
}) => Intersection | null
type CollisionsMatrix = Record<
  CollisionType,
  Record<CollisionType, CollisionDetectorNormalizer>
>

export const collisionsMatrix: CollisionsMatrix = {
  circle: {
    circle: ({ transform1, collider1Data, transform2, collider2Data }) =>
      getCircleCircleIntersection({
        circle1: mapToCircle({
          transform: transform1,
          colliderData: collider1Data as ColliderDataCircle,
        }),
        circle2: mapToCircle({
          transform: transform2,
          colliderData: collider2Data as ColliderDataCircle,
        }),
      }),
    line: ({ transform1, collider1Data, transform2, collider2Data }) =>
      getCircleLineIntersection({
        circle: mapToCircle({
          transform: transform1,
          colliderData: collider1Data as ColliderDataCircle,
        }),
        line: mapToLine({
          transform: transform2,
          colliderData: collider2Data as ColliderDataLine,
        }),
      }),
    point: ({ transform1, collider1Data, transform2, collider2Data }) =>
      getPointCircleIntersection({
        circle: mapToCircle({
          transform: transform1,
          colliderData: collider1Data as ColliderDataCircle,
        }),
        point: mapToPoint({
          transform: transform2,
          colliderData: collider2Data as ColliderDataPoint,
        }),
      }),
    rectangle: ({ transform1, collider1Data, transform2, collider2Data }) =>
      getPolygonCircleIntersection({
        circle: mapToCircle({
          transform: transform1,
          colliderData: collider1Data as ColliderDataCircle,
        }),
        polygon: mapRectangleToPolygon({
          transform: transform2,
          colliderData: collider2Data as ColliderDataRectangle,
        }),
      }),
  },
  line: {
    circle: ({ transform1, collider1Data, transform2, collider2Data }) =>
      getCircleLineIntersection({
        line: mapToLine({
          transform: transform1,
          colliderData: collider1Data as ColliderDataLine,
        }),
        circle: mapToCircle({
          transform: transform2,
          colliderData: collider2Data as ColliderDataCircle,
        }),
      }),
    line: ({ transform1, collider1Data, transform2, collider2Data }) =>
      getLineLineIntersection({
        line1: mapToLine({
          transform: transform1,
          colliderData: collider1Data as ColliderDataLine,
        }),
        line2: mapToLine({
          transform: transform2,
          colliderData: collider2Data as ColliderDataLine,
        }),
      }),
    point: ({ transform1, collider1Data, transform2, collider2Data }) =>
      getPointLineIntersection({
        line: mapToLine({
          transform: transform1,
          colliderData: collider1Data as ColliderDataLine,
        }),
        point: mapToPoint({
          transform: transform2,
          colliderData: collider2Data as ColliderDataPoint,
        }),
      }),
    rectangle: ({ transform1, collider1Data, transform2, collider2Data }) =>
      getPolygonLineIntersection({
        line: mapToLine({
          transform: transform1,
          colliderData: collider1Data as ColliderDataLine,
        }),
        polygon: mapRectangleToPolygon({
          transform: transform2,
          colliderData: collider2Data as ColliderDataRectangle,
        }),
      }),
  },
  point: {
    circle: ({ transform1, collider1Data, transform2, collider2Data }) =>
      getPointCircleIntersection({
        point: mapToPoint({
          transform: transform1,
          colliderData: collider1Data as ColliderDataPoint,
        }),
        circle: mapToCircle({
          transform: transform2,
          colliderData: collider2Data as ColliderDataCircle,
        }),
      }),
    line: ({ transform1, collider1Data, transform2, collider2Data }) =>
      getPointLineIntersection({
        point: mapToPoint({
          transform: transform1,
          colliderData: collider1Data as ColliderDataPoint,
        }),
        line: mapToLine({
          transform: transform2,
          colliderData: collider2Data as ColliderDataLine,
        }),
      }),
    point: ({ transform1, collider1Data, transform2, collider2Data }) =>
      getPointPointIntersection({
        point1: mapToPoint({
          transform: transform1,
          colliderData: collider1Data as ColliderDataPoint,
        }),
        point2: mapToPoint({
          transform: transform2,
          colliderData: collider2Data as ColliderDataPoint,
        }),
      }),
    rectangle: ({ transform1, collider1Data, transform2, collider2Data }) =>
      getPolygonPointIntersection({
        point: mapToPoint({
          transform: transform1,
          colliderData: collider1Data as ColliderDataPoint,
        }),
        polygon: mapRectangleToPolygon({
          transform: transform2,
          colliderData: collider2Data as ColliderDataRectangle,
        }),
      }),
  },
  rectangle: {
    circle: ({ transform1, collider1Data, transform2, collider2Data }) =>
      getPolygonCircleIntersection({
        polygon: mapRectangleToPolygon({
          transform: transform1,
          colliderData: collider1Data as ColliderDataRectangle,
        }),
        circle: mapToCircle({
          transform: transform2,
          colliderData: collider2Data as ColliderDataCircle,
        }),
      }),
    line: ({ transform1, collider1Data, transform2, collider2Data }) =>
      getPolygonLineIntersection({
        polygon: mapRectangleToPolygon({
          transform: transform1,
          colliderData: collider1Data as ColliderDataRectangle,
        }),
        line: mapToLine({
          transform: transform2,
          colliderData: collider2Data as ColliderDataLine,
        }),
      }),
    point: ({ transform1, collider1Data, transform2, collider2Data }) =>
      getPolygonPointIntersection({
        polygon: mapRectangleToPolygon({
          transform: transform1,
          colliderData: collider1Data as ColliderDataRectangle,
        }),
        point: mapToPoint({
          transform: transform2,
          colliderData: collider2Data as ColliderDataPoint,
        }),
      }),
    rectangle: ({ transform1, collider1Data, transform2, collider2Data }) =>
      getPolygonPolygonIntersection({
        polygon1: mapRectangleToPolygon({
          transform: transform1,
          colliderData: collider1Data as ColliderDataRectangle,
        }),
        polygon2: mapRectangleToPolygon({
          transform: transform2,
          colliderData: collider2Data as ColliderDataRectangle,
        }),
      }),
  },
}

type FindCollisionsWith = (pramams: {
  entity: Entity
  state: InternalInitialState
  component: Collider
}) => Array<Collider['_collisions'][0]>
const findCollisionsWith: FindCollisionsWith = ({
  state,
  component,
  entity,
}) => {
  const transform = getTransform({
    state,
    entity,
  })
  if (!transform) return []

  const collisionList: Array<Collider['_collisions'][0]> = []

  const allColliders = Object.entries(state.component.collider)

  component.data.forEach((colliderData) => {
    allColliders.forEach(([collider2Entity, collider2]) => {
      // Do not test collision with the same colliders
      if (entity === collider2Entity) {
        return
      }

      if (hasSameLayer(component.layers, collider2.layers) === false) {
        return
      }

      // TODO Do not test collision if collision already exist
      // if (
      //   collider2.collisions.find((collision) => collision.entity === entity)
      // ) {
      //   return setCollider2Collisions - how?
      // }

      const transform2 = getComponent<Transform>({
        state,
        entity: collider2Entity,
        name: componentName.transform,
      })

      if (!transform2) {
        return
      }

      collider2.data.forEach((collider2Data, index) => {
        const collisionDetector: CollisionDetectorNormalizer =
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          collisionsMatrix[colliderData.type][collider2Data.type]

        const intersection = collisionDetector({
          transform1: transform,
          collider1Data: colliderData,
          transform2,
          collider2Data: collider2Data,
        })

        if (intersection !== null) {
          collisionList.push({
            colliderIndex: index,
            colliderEntity: collider2Entity,
            intersection,
          })

          emitEvent<CollisionEvent>({
            type: 'collision',
            payload: {
              entity,
              colliderEntity: collider2Entity,
              intersection,
            },
          })
        }
      })
    })
  })

  return collisionList
}

export const colliderSystem = (state: InternalInitialState) =>
  createSystem<Collider, InternalInitialState>({
    state,
    name: componentName.collider,
    componentName: componentName.collider,
    priority: systemPriority.collider,
    tick: ({ state, component, entity }) => {
      const collisions = findCollisionsWith({
        entity,
        state,
        component,
      })

      return updateCollider({
        state,
        entity,
        update: () => ({
          _collisions: collisions,
        }),
      })
    },
  })
