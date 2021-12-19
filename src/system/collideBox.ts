import { add } from '@arekrado/vector-2d'
import { setComponent } from '../component'
import { State } from '../type'
import { CollideBox, CollideType } from '../type'
import { createSystem } from './createSystem'
import { componentName } from '../component'
import { detectAABBcollision } from '../util/detectCollision'
import { getComponent, Transform } from '..'

type FindCollisionsWith = (pramams: {
  state: State
  collideBox: CollideBox
}) => CollideType[]
const findCollisionsWith: FindCollisionsWith = ({ state, collideBox }) => {
  const transform = getComponent<Transform>({
    state,
    entity: collideBox.entity,
    name: componentName.transform,
  })
  if (!transform) return []
  const collisionList: CollideType[] = []

  Object.values(state.component.collideBox).forEach((collideBox2) => {
    if (collideBox.entity === collideBox2.entity) {
      return
    }

    const transform2 = getComponent<Transform>({
      state,
      entity: collideBox2.entity,
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
    tick: ({ state, component: collideBox }) => {
      const collisions = findCollisionsWith({
        state,
        collideBox,
      })

      return setComponent<CollideBox>({
        state,
        data: {
          ...collideBox,
          collisions,
        },
      })
    },
  })
