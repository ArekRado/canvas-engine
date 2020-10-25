import v5 from 'uuid'
import { State } from '../main'
import { Guid } from './uuid'

export const generate = (debugName: string) => `${debugName}###${v5()}`

type Params = {
  entity: Guid
  state: State
}

export const create = ({ entity, state }: Params): State => ({
  ...state,
  entity: [...state.entity, entity],
})

export const remove = ({ entity, state }: Params): State => {
  const newState = {
    ...state,
    entity: state.entity.filter((item) => item !== entity),
  }

  const v1 = Transform_Component.remove({ entity, state: newState })
  const v2 = Sprite_Component.remove({ entity, state: v1 })
  const v3 = Animation_Component.removeByEntity({ entity, state: v2 })
  const v4 = CollideBox_Component.removeByEntity({ entity, state: v3 })
  const v5 = CollideCircle_Component.removeByEntity({ entity, state: v4 })

  return v5
}
