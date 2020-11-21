import { add, Vector2D, vectorZero } from '@arekrado/vector-2d'
import { Transform } from '../type'
import { transform as transformComponent } from '../component/transform'
import { Entity, State } from '../type'
import { createSystem } from './createSystem'

const getParentPosition = (state: State, parentEntity: Entity): Vector2D => {
  const parent = transformComponent.get({ entity: parentEntity, state })

  if (parent) {
    if (parent.parent) {
      return add(
        getParentPosition(state, parent.parent),
        parent.localPosition,
      )
    } else {
      return parent.localPosition
    }
  } else {
    return vectorZero()
  }
}

export const transformSystem = (state: State) =>
  createSystem<Transform>({
    state,
    name: 'transform',
    create: ({ state }) => state,
    remove: ({ state }) => state,
    tick: ({ state, component }) => {
      if (component && component.parent) {
        component.position = add(
          component.localPosition,
          getParentPosition(state, component.parent),
        )
      }

      return state
    },
  })
