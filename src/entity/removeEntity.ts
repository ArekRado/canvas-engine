import { removeComponent } from '../component/removeComponent'
import { Entity, AnyState } from '../type'

type RemoveEntity = <State extends AnyState>(params: {
  entity: Entity
  state: State
}) => State
export const removeEntity: RemoveEntity = ({ entity, state }) => {
  const { [entity]: _, ...stateWithoutEntity } = state.entity

  const newState = {
    ...state,
    entity: stateWithoutEntity,
  }

  const v1 = Object.keys(newState.component).reduce(
    (state, name) =>
      removeComponent({
        name,
        state,
        entity,
      }),
    newState,
  )

  return v1
}
