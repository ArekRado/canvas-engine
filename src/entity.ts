import { v4 } from 'uuid'
import { Entity, Guid, State } from './type'
import { removeComponent } from './component'

export const createEntity = ({ name }: { name: string }): Entity =>
  name ? `${name}---${v4()}` : v4()

type SetEntity = (params: { entity: Entity; state: State }) => State

export const setEntity: SetEntity = ({ entity, state }) => ({
  ...state,
  entity: {
    ...state.entity,
    [entity]: entity,
  },
})

type GetEntity = (params: { entity: Guid; state: State }) => Entity | undefined
export const getEntity: GetEntity = ({ entity, state }) => state.entity[entity]

type RemoveEntity = (params: { entity: Guid; state: State }) => State
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
