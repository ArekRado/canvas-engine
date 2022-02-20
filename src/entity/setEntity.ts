import { Entity, AnyState } from '../type'

type SetEntity = <State extends AnyState>(params: {
  entity: Entity
  state: State
}) => State

export const setEntity: SetEntity = ({ entity, state }) => ({
  ...state,
  entity: {
    ...state.entity,
    [entity]: entity,
  },
})
