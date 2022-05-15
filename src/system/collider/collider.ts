import { add } from '@arekrado/vector-2d'
import { InternalInitialState, Transform, Collider, Guid } from '../../type'
import { createSystem } from '../createSystem'
import { getComponent } from '../../component/getComponent'
import { componentName } from '../../component/componentName'
import {
  detectPointPointCollision,
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
      if (entity === collider2Entity) {
        return
      }

      const transform2 = getComponent<Transform>({
        state,
        entity: collider2Entity,
        name: componentName.transform,
      })

      if (!transform2) {
        return
      }

      collider2.data.forEach((collider2Data, index) => {
        let isColliding = false
        // Box box collision
        if (colliderData.type === 'rectangle') {
          if (collider2Data.type === 'rectangle') {
            isColliding = detectRectangleRectangleCollision({
              v1: add(
                [transform.position[0], transform.position[1]],
                colliderData.position,
              ),
              size1: colliderData.size,
              v2: add(
                [transform2.position[0], transform2.position[1]],
                collider2Data.position,
              ),
              size2: collider2Data.size,
            })
          } else if (collider2Data.type === 'point') {
            //
          }
        }

        if (colliderData.type === 'point') {
          if (collider2Data.type === 'point') {
            isColliding = detectPointPointCollision({
              point1: add(
                [transform.position[0], transform.position[1]],
                colliderData.position,
              ),
              point2: add(
                [transform2.position[0], transform2.position[1]],
                collider2Data.position,
              ),
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
