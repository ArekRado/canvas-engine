import { add, Vector2D, vectorZero } from '@arekrado/vector-2d'
import { Entity, State } from '../type'
import { createGlobalSystem } from './createSystem'
import { setEntity, getEntity } from '../util/entity'

const getParentPosition = (state: State, parentEntity: Entity): Vector2D => {
  if (parentEntity.parentId) {
    const parentParentEntity = getEntity({ entityId: parentEntity.parentId, state })

    if (parentParentEntity) {
      return add(
        getParentPosition(state, parentParentEntity),
        parentEntity.fromParentPosition,
      )
    } else {
      return vectorZero()
    }
  } else {
    return parentEntity.position
  }
}

export const transformSystem = (state: State) =>
  createGlobalSystem({
    state,
    name: 'transform',
    tick: (params) => {
      return params.state.entity.reduce((state, entity) => {
        if (entity.parentId) {
          const parentEntity = getEntity({ entityId: entity.parentId, state })

          if (parentEntity) {
            const newPosition = add(
              entity.fromParentPosition,
              getParentPosition(state, parentEntity),
            )

            return setEntity({
              entity: {
                ...entity,
                position: newPosition,
              },
              state,
            })
          }
        }

        return state
      }, params.state)
    },
  })
