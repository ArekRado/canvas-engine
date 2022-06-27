import { add, Vector2D } from '@arekrado/vector-2d'
import {
  InternalInitialState,
  Transform,
  Collider,
  Guid,
  ColliderDataLine,
  ColliderDataCircle,
  ColliderDataRectangle,
  ColliderDataPoint,
} from '../../type'
import { createSystem, systemPriority } from '../createSystem'
import { getComponent } from '../../component/getComponent'
import { componentName } from '../../component/componentName'
import {
  Circle,
  detectCircleCircleCollision,
  detectCircleLineCollision,
  detectLineLineCollision,
  detectPointCircleCollision,
  detectPointLineCollision,
  detectPointPointCollision,
  detectPointRectangleCollision,
  detectRectangleCircleCollision,
  detectRectangleLineCollision,
  detectRectangleRectangleCollision,
  Line,
  Point,
  Rectangle,
} from './detectCollision'
import { updateCollider } from './colliderCrud'
import { getTransform } from '../transform/transformCrud'
import { applyMatrixToVector2D, rotate } from '../../util/matrix'

const hasSameLayer = (
  layers1: Collider['layers'],
  layers2: Collider['layers'],
) => layers1.some((l1) => layers2.find((l2) => l2 === l1))

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

const mapToRectangle = ({
  transform,
  colliderData,
}: MapToShapeParams<ColliderDataRectangle>): Rectangle => {
  return {
    position: applyTransformsToPosition({
      colliderPosition: colliderData.position,
      transform,
    }),
    size: colliderData.size,
  }
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
type CollisionDetectorNormalizer = (params: {
  transform1: Transform
  collider1Data: Collider['data'][0]
  transform2: Transform
  collider2Data: Collider['data'][0]
}) => boolean
type CollisionsMatrix = Record<
  CollisionType,
  Record<CollisionType, CollisionDetectorNormalizer>
>

const collisionsMatrix: CollisionsMatrix = {
  circle: {
    circle: ({ transform1, collider1Data, transform2, collider2Data }) =>
      detectCircleCircleCollision({
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
      detectCircleLineCollision({
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
      detectPointCircleCollision({
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
      detectRectangleCircleCollision({
        circle: mapToCircle({
          transform: transform1,
          colliderData: collider1Data as ColliderDataCircle,
        }),
        rectangle: mapToRectangle({
          transform: transform2,
          colliderData: collider2Data as ColliderDataRectangle,
        }),
      }),
  },
  line: {
    circle: ({ transform1, collider1Data, transform2, collider2Data }) =>
      detectCircleLineCollision({
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
      detectLineLineCollision({
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
      detectPointLineCollision({
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
      detectRectangleLineCollision({
        line: mapToLine({
          transform: transform1,
          colliderData: collider1Data as ColliderDataLine,
        }),
        rectangle: mapToRectangle({
          transform: transform2,
          colliderData: collider2Data as ColliderDataRectangle,
        }),
      }),
  },
  point: {
    circle: ({ transform1, collider1Data, transform2, collider2Data }) =>
      detectPointCircleCollision({
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
      detectPointLineCollision({
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
      detectPointPointCollision({
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
      detectPointRectangleCollision({
        point: mapToPoint({
          transform: transform1,
          colliderData: collider1Data as ColliderDataPoint,
        }),
        rectangle: mapToRectangle({
          transform: transform2,
          colliderData: collider2Data as ColliderDataRectangle,
        }),
      }),
  },
  rectangle: {
    circle: ({ transform1, collider1Data, transform2, collider2Data }) =>
      detectRectangleCircleCollision({
        rectangle: mapToRectangle({
          transform: transform1,
          colliderData: collider1Data as ColliderDataRectangle,
        }),
        circle: mapToCircle({
          transform: transform2,
          colliderData: collider2Data as ColliderDataCircle,
        }),
      }),
    line: ({ transform1, collider1Data, transform2, collider2Data }) =>
      detectRectangleLineCollision({
        rectangle: mapToRectangle({
          transform: transform1,
          colliderData: collider1Data as ColliderDataRectangle,
        }),
        line: mapToLine({
          transform: transform2,
          colliderData: collider2Data as ColliderDataLine,
        }),
      }),
    point: ({ transform1, collider1Data, transform2, collider2Data }) =>
      detectPointRectangleCollision({
        rectangle: mapToRectangle({
          transform: transform1,
          colliderData: collider1Data as ColliderDataRectangle,
        }),
        point: mapToPoint({
          transform: transform2,
          colliderData: collider2Data as ColliderDataPoint,
        }),
      }),
    rectangle: ({ transform1, collider1Data, transform2, collider2Data }) =>
      detectRectangleRectangleCollision({
        rectangle1: mapToRectangle({
          transform: transform1,
          colliderData: collider1Data as ColliderDataRectangle,
        }),
        rectangle2: mapToRectangle({
          transform: transform2,
          colliderData: collider2Data as ColliderDataRectangle,
        }),
      }),
  },
}

type FindCollisionsWith = (pramams: {
  entity: Guid
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
        const collisionDetector =
          collisionsMatrix[colliderData.type][collider2Data.type]

        const isColliding = collisionDetector({
          transform1: transform,
          collider1Data: colliderData,
          transform2,
          collider2Data: collider2Data,
        })

        isColliding &&
          collisionList.push({
            index,
            entity: collider2Entity,
          })
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
