import { removeComponent } from '../component/removeComponent'
import { Entity, InitialState } from '../type'

type RemoveEntity = <State extends InitialState>(
  state: State,
  entity: Entity,
) => State
export const removeEntity: RemoveEntity = (state, entity) => {
  state.entity.delete(entity)

  const v1 = Object.keys(state.component).reduce(
    (state, name) => removeComponent(state, name, entity),
    state,
  )

  return v1
}
