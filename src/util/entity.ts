import { v1 } from 'uuid'
import { Entity, State } from '../type'
import { removeComponentByEntity } from '../component'

export const generate = (name: string): Entity => ({
  name,
  id: v1(),
})

type Params = {
  entity: Entity
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

  const v1 = Object.keys(state.component).reduce(
    (state, name) =>
      removeComponentByEntity({
        state,
        entity,
        name,
      }),
    newState,
  )

  return v1
}
