import { v1 } from 'uuid'
import { Entity, State } from '../type'
import { removeComponent } from '../component'

type Generate = (
  name: string,
  params?: Partial<{ persistOnSceneChange: boolean }>,
) => Entity
export const generate: Generate = (name: string, options = {}): Entity => ({
  name,
  id: v1(),
  persistOnSceneChange: options.persistOnSceneChange || false,
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
      removeComponent(name, {
        state,
        entity,
      }),
    newState,
  )

  return v1
}
