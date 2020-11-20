import { add, Vector2D, vectorZero } from '@arekrado/vector-2d'
import { Transform } from 'type'
import { transform as transformComponent } from '../component/transform'
import { Entity, State } from '../main'
import { createSystem } from './createSystem'

const getParentPosition = (state: State, parentEntity: Entity): Vector2D => {
  const parent = transformComponent.get({ entity: parentEntity, state })

  if (parent) {
    if (parent.data.parent) {
      return add(
        getParentPosition(state, parent.data.parent),
        parent.data.localPosition,
      )
    } else {
      return parent.data.localPosition
    }
  } else {
    return vectorZero()
  }
}

export const transformSystem = createSystem<Transform>({
  componentName: 'transform',
  init: ({ state }) => state,
  remove: ({ state }) => state,
  tick: ({ state, component }) => {
    if (component && component.data.parent) {
      component.data.position = add(
        component.data.localPosition,
        getParentPosition(state, component.data.parent),
      )
    }

    return state
  },
})
