import { add, Vector2D, vectorZero } from '@arekrado/vector-2d'
import { Transform } from '../component'
import { State } from '../main'
import { Dictionary } from '../type'

const getParentPosition = (
  transform: Dictionary<Transform>,
  parentEntity: string,
): Vector2D => {
  const parent = transform[parentEntity]

  if (parent) {
    if (parent.data.parent) {
      return add(
        getParentPosition(transform, parent.data.parent),
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
        getParentPosition(state.component.transform, transform.data.parent),
      )
    } else {
      transform.data.position = transform.data.localPosition
    }
  })

  return state
}
