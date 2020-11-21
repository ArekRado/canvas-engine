import { v1 } from 'uuid'
import { Entity, State } from '../main'
import { removeByEntity } from '../component/createComponent'

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
    (state, componentName) =>
      removeByEntity({
        state,
        entity,
        componentName: componentName as keyof State['component'],
      }),
    newState,
  )

  return v1
}
