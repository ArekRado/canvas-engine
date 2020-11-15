import { add, Vector2D, vectorZero } from '@arekrado/vector-2d'
import { transform as transformComponent } from '../component'
import { Entity, State } from '../main'

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

type Update = (params: { state: State }) => State
export const update: Update = ({ state }) => {
  Object.values(state.component.transform).forEach((transform) => {
    if (transform.data.parent) {
      transform.data.position = add(
        transform.data.localPosition,
        getParentPosition(state, transform.data.parent),
      )
    }
  })

  return state
}
