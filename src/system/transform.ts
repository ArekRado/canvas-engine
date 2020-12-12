import { add, Vector2D, vectorZero } from '@arekrado/vector-2d'
import { getComponent, setComponent } from '../component'
import { Transform } from '../type'
import { Entity, State } from '../type'
import { createSystem } from './createSystem'
import { componentName } from '../component'

const getParentPosition = (state: State, parentEntity: Entity): Vector2D => {
  const parent = getComponent<Transform>(componentName.transform, {
    entity: parentEntity,
    state,
  })

  if (parent) {
    if (parent.parent) {
      return add(
        getParentPosition(state, parent.parent),
        parent.fromParentPosition,
      )
    } else {
      return parent.position
    }
  } else {
    return vectorZero()
  }
}

export const transformSystem = (state: State) =>
  createSystem<Transform>({
    state,
    name: componentName.transform,
    create: ({ state }) => state,
    remove: ({ state }) => state,
    tick: ({ state, component }) => {
      if (component.parent) {
        const newPosition = add(
          component.fromParentPosition,
          getParentPosition(state, component.parent),
        )

        return setComponent(componentName.transform, {
          data: {
            ...component,
            position: newPosition,
          },
          state,
        })
      }

      return state
    },
  })
