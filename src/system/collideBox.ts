import { add } from '@arekrado/vector-2d'
import { getComponent, setComponent } from '../component'
import { State } from '../type'
import { CollideBox, CollideType, Transform } from '../type'
import { createSystem } from './createSystem'
import { componentName } from '../component'
import { detectAABBcollision } from '../util/detectCollision'

type FindCollisionsWith = (pramams: {
  state: State
  collideBox: CollideBox
  transform: Transform
}) => CollideType[]
const findCollisionsWith: FindCollisionsWith = ({
  state,
  collideBox,
  transform,
}) => {
  const collisionList: CollideType[] = []

  Object.values(state.component.collideBox).forEach((collideBox2) => {
    const transform2 = getComponent<Transform>(componentName.transform, {
      state,
      entity: collideBox2.entity,
    })

    if (transform2 && transform.entity !== transform2.entity) {
      const isColliding = detectAABBcollision({
        v1: add(transform.position, collideBox.position),
        size1: collideBox.size,
        v2: add(transform2.position, collideBox2.position),
        size2: collideBox2.size,
      })

      isColliding &&
        collisionList.push({
          type: 'box',
          entity: collideBox2.entity,
        })
    }
  })

  return collisionList
}

export const collideBoxSystem = (state: State) =>
  createSystem<CollideBox>({
    state,
    name: componentName.collideBox,
    create: ({ state }) => state,
    remove: ({ state }) => state,
    tick: ({ state, component: collideBox }) => {
      const transform = getComponent<Transform>(componentName.transform, {
        state,
        entity: collideBox.entity,
      })

      if (transform) {
        const collisions = findCollisionsWith({
          state,
          collideBox,
          transform,
        })

        return setComponent(componentName.collideBox, {
          state,
          data: {
            ...collideBox,
            collisions,
          },
        })
      }

      return state
    },
  })
