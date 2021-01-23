import { add } from '@arekrado/vector-2d'
import { setComponent } from '../component'
import { Entity, State } from '../type'
import { CollideBox, CollideType } from '../type'
import { createSystem } from './createSystem'
import { componentName } from '../component'
import { detectAABBcollision } from '../util/detectCollision'
import { getEntity } from '../util/entity'
import { createCollide, removeCollide, renderCollide } from '../util/pixiDraw'

type FindCollisionsWith = (pramams: {
  state: State
  collideBox: CollideBox
  entity: Entity
}) => CollideType[]
const findCollisionsWith: FindCollisionsWith = ({
  state,
  collideBox,
  entity,
}) => {
  const collisionList: CollideType[] = []

  Object.values(state.component.collideBox).forEach((collideBox2) => {
    const entity2 = getEntity({
      state,
      entityId: collideBox2.entityId,
    })

    if (entity2 && entity.id !== entity2.id) {
      const isColliding = detectAABBcollision({
        v1: add(entity.position, collideBox.position),
        size1: collideBox.size,
        v2: add(entity2.position, collideBox2.position),
        size2: collideBox2.size,
      })

      isColliding &&
        collisionList.push({
          type: 'box',
          entityId: collideBox2.entityId,
        })
    }
  })

  return collisionList
}

export const collideBoxSystem = (state: State) =>
  createSystem<CollideBox>({
    state,
    name: componentName.collideBox,
    create: ({ state, component }) => {
      if (state.isDrawEnabled) {
        createCollide(component)
      }

      return state
    },
    remove: ({ state, component }) => {
      if (state.isDrawEnabled) {
        removeCollide(component)
      }

      return state
    },
    tick: ({ state, component: collideBox }) => {
      const entity = getEntity({
        state,
        entityId: collideBox.entityId,
      })

      if (entity) {
        if (state.isDrawEnabled) {
          renderCollide(entity, collideBox)
        }

        const collisions = findCollisionsWith({
          state,
          collideBox,
          entity,
        })

        return setComponent<CollideBox>(componentName.collideBox, {
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
