import { removeComponent } from '../component/removeComponent'
import { Entity, AnyState } from '../type'

type RemoveEntity = <State extends AnyState>(params: {
  entity: Entity
  state: State
}) => State
export const removeEntity: RemoveEntity = ({ entity, state }) => {
  state.entity.delete(entity)

  const v1 = Object.keys(state.component).reduce(
    (state, name) =>
      removeComponent({
        name,
        state,
        entity,
      }),
    state,
  )

  return v1
}
