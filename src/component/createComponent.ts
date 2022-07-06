import { getSystemByName } from '../system/getSystemByName'
import { AnyState, Entity } from '../type'

export const createComponent = <Data, State extends AnyState = AnyState>({
  state,
  data,
  entity,
  name,
}: {
  state: State
  data: Data
  entity: Entity
  name: string
}): State => {
  const newState = {
    ...state,
    component: {
      ...state.component,
      [name]: {
        ...state.component[name],
        [entity]: data,
      },
    },
  }

  const system = getSystemByName(name, state.system)

  if (system !== undefined) {
    if (
      system.create !== undefined &&
      (state.component[name] === undefined ||
        state.component[name][entity] === undefined)
    ) {
      return system.create({
        state: newState,
        component: data,
        entity,
        name,
      }) as State
    }
  }

  return newState
}
