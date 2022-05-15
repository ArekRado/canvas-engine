import { add } from '@arekrado/vector-2d'
import {
  InternalInitialState,
  Transform,
  CollideBox,
  CollideType,
  Guid,
} from '../../type'
import { createSystem } from '../createSystem'
import { setComponent } from '../../component/setComponent'
import { getComponent } from '../../component/getComponent'
import { componentName } from '../../component/componentName'
import { detectAABBcollision } from '../../util/detectCollision'

type FindCollisionsWith = (pramams: {
  entity: Guid
  state: InternalInitialState
  collideBox: CollideBox
}) => CollideType[]
const findCollisionsWith: FindCollisionsWith = ({
  state,
  collideBox,
  entity,
}) => {
  const transform = getComponent<Transform>({
    state,
    entity,
    name: componentName.transform,
  })
  if (!transform) return []
  const collisionList: CollideType[] = []

  Object.entries(state.component.collideBox).forEach(
    ([collideBox2Entity, collideBox2]) => {
      if (entity === collideBox2Entity) {
        return
      }

      const transform2 = getComponent<Transform>({
        state,
        entity: collideBox2Entity,
        name: componentName.transform,
      })

      if (transform2) {
        const isColliding = detectAABBcollision({
          v1: add(
            [transform.position[0], transform.position[1]],
            collideBox.position,
          ),
          size1: collideBox.size,
          v2: add(
            [transform2.position[0], transform2.position[1]],
            collideBox2.position,
          ),
          size2: collideBox2.size,
        })

        isColliding &&
          collisionList.push({
            type: 'box',
            entity: collideBox2Entity,
          })
      }
    },
  )

  return collisionList
}

export const collideBoxSystem = (state: InternalInitialState) =>
  createSystem<CollideBox, InternalInitialState>({
    state,
    name: componentName.collideBox,
    componentName: componentName.collideBox,
    tick: ({ state, component: collideBox, entity }) => {
      const collisions = findCollisionsWith({
        entity,
        state,
        collideBox,
      })

      return setComponent<CollideBox, InternalInitialState>({
        state,
        entity,
        name: componentName.collideBox,
        data: {
          ...collideBox,
          collisions,
        },
      })
    },
  })