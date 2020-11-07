import {
  animation,
  collideBox,
  collideCircle,
  fieldNumber,
  fieldString,
  fieldVector,
  sprite,
  transform,
} from '../component'
import { v1 } from 'uuid'
import { State } from '../main'
import { Guid } from './uuid'

export const generate = (debugName: string) => `${debugName}###${v1()}`

type Params = {
  entity: Guid
  state: State
}

export const set = ({ entity, state }: Params): State => ({
  ...state,
  entity: [...state.entity, entity],
})

export const remove = ({ entity, state }: Params): State => {
  const newState = {
    ...state,
    entity: state.entity.filter((item) => item !== entity),
  }

  const v1 = sprite.removeByEntity({ entity, state: newState })
  const v2 = transform.removeByEntity({ entity, state: v1 })
  const v3 = animation.removeByEntity({ entity, state: v2 })
  const v4 = collideBox.removeByEntity({ entity, state: v3 })
  const v5 = collideCircle.removeByEntity({ entity, state: v4 })
  const v6 = fieldNumber.removeByEntity({ entity, state: v5 })
  const v7 = fieldVector.removeByEntity({ entity, state: v6 })
  const v8 = fieldString.removeByEntity({ entity, state: v7 })

  return v8
}
