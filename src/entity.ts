import { v4 } from 'uuid'
import { Entity, Guid, AnyState } from './type'

export const createEntity = ({ name }: { name: string }): Entity =>
  name ? `${name}---${v4()}` : v4()

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

type GetEntity = <State extends AnyState>(params: {
  entity: Guid
  state: State
}) => Entity | undefined
export const getEntity: GetEntity = ({ entity, state }) => state.entity[entity]

type RemoveEntity = <State extends AnyState>(params: {
  entity: Guid
  state: State
  removeComponent: ({
    name,
    entity,
    state,
  }: {
    name: string
    entity: string
    state: State
  }) => State
}) => State
export const removeEntity: RemoveEntity = ({
  entity,
  state,
  removeComponent,
}) => {
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
