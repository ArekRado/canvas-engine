import { add } from '@arekrado/vector-2d'
import { InternalInitialState, Transform, Collider, Guid } from '../../type'
import { createSystem } from '../createSystem'
import { getComponent } from '../../component/getComponent'
import { componentName } from '../../component/componentName'
import {
  detectCircleCircleCollision,
  detectCircleLineCollision,
  detectLineLineCollision,
  detectPointLineCollision,
  detectPointPointCollision,
  detectRectangleCircleCollision,
  detectRectangleLineCollision,
  detectRectangleRectangleCollision,
} from './detectCollision'
import { updateComponent } from '../../component/updateComponent'

type FindCollisionsWith = (pramams: {
  entity: Guid
  state: InternalInitialState
  component: Collider
}) => Array<Collider['collisions'][0]>
const findCollisionsWith: FindCollisionsWith = ({
  state,
  component,
  entity,
}) => {
  const transform = getComponent<Transform>({
    state,
    entity,
    name: componentName.transform,
  })
  if (!transform) return []

  const collisionList: Array<Collider['collisions'][0]> = []

  const allColliders = Object.entries(state.component.collider)

  component.data.forEach((colliderData) => {
    allColliders.forEach(([collider2Entity, collider2]) => {
      // Do not test collision with the same colliders
      if (entity === collider2Entity) {
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

      const position = add(
        [transform.position[0], transform.position[1]],
        colliderData.position,
      )

      collider2.data.forEach((collider2Data, index) => {
        const position2 = add(
          [transform2.position[0], transform2.position[1]],
          collider2Data.position,
        )

        let isColliding = false

        if (colliderData.type === 'rectangle') {
          if (collider2Data.type === 'rectangle') {
            isColliding = detectRectangleRectangleCollision({
              rectangle1: {
                position,
                size: colliderData.size,
              },
              rectangle2: {
                position: position2,
                size: collider2Data.size,
              },
            })
          } else if (collider2Data.type === 'circle') {
            isColliding = detectRectangleCircleCollision({
              rectangle: {
                position,
                size: colliderData.size,
              },
              circle: {
                position: position2,
                radius: collider2Data.radius,
              },
            })
          } else if (collider2Data.type === 'line') {
            isColliding = detectRectangleLineCollision({
              rectangle: {
                position,
                size: colliderData.size,
              },
              line: {
                position: position2,
                position2: add(
                  [transform2.position[0], transform2.position[1]],
                  collider2Data.position2,
                ),
              },
            })
          }
        } else if (colliderData.type === 'point') {
          if (collider2Data.type === 'point') {
            isColliding = detectPointPointCollision({
              point1: position,
              point2: position2,
            })
          } else if (collider2Data.type === 'line') {
            isColliding = detectPointLineCollision({
              point: position,
              line: {
                position: position2,
                position2: add(
                  [transform2.position[0], transform2.position[1]],
                  collider2Data.position2,
                ),
              },
            })
          }
        } else if (colliderData.type === 'circle') {
          if (collider2Data.type === 'circle') {
            isColliding = detectCircleCircleCollision({
              circle1: {
                position,
                radius: colliderData.radius,
              },
              circle2: {
                position: position2,
                radius: collider2Data.radius,
              },
            })
          } else if (collider2Data.type === 'rectangle') {
            isColliding = detectRectangleCircleCollision({
              circle: {
                position,
                radius: colliderData.radius,
              },
              rectangle: {
                position: position2,
                size: collider2Data.size,
              },
            })
          } else if (collider2Data.type === 'line') {
            isColliding = detectCircleLineCollision({
              circle: {
                position,
                radius: colliderData.radius,
              },
              line: {
                position: position2,
                position2: add(
                  [transform2.position[0], transform2.position[1]],
                  collider2Data.position2,
                ),
              },
            })
          }
        } else if (colliderData.type === 'line') {
          if (collider2Data.type === 'point') {
            isColliding = detectPointLineCollision({
              point: position2,
              line: {
                position,
                position2: add(
                  [transform.position[0], transform.position[1]],
                  colliderData.position2,
                ),
              },
            })
          } else if (collider2Data.type === 'circle') {
            isColliding = detectCircleLineCollision({
              circle: {
                position: position2,
                radius: collider2Data.radius,
              },
              line: {
                position: position,
                position2: add(
                  [transform.position[0], transform.position[1]],
                  colliderData.position2,
                ),
              },
            })
          } else if (collider2Data.type === 'line') {
            isColliding = detectLineLineCollision({
              line1: {
                position,
                position2: add(
                  [transform.position[0], transform.position[1]],
                  colliderData.position2,
                ),
              },
              line2: {
                position: position2,
                position2: add(
                  [transform2.position[0], transform2.position[1]],
                  collider2Data.position2,
                ),
              },
            })
          } else if (collider2Data.type === 'rectangle') {
            isColliding = detectRectangleLineCollision({
              line: {
                position,
                position2: add(
                  [transform.position[0], transform.position[1]],
                  colliderData.position2,
                ),
              },
              rectangle: {
                position: position2,
                size: collider2Data.size,
              },
            })
          }
        }

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
    tick: ({ state, component, entity }) => {
      const collisions = findCollisionsWith({
        entity,
        state,
        component,
      })

      return updateComponent<Collider, InternalInitialState>({
        state,
        entity,
        name: componentName.collider,
        update: () => ({
          collisions,
        }),
      })
    },
  })
