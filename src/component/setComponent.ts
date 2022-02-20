import { AnyState, Component } from '../type'
import { getComponent } from './getComponent'
import { getSystemByName } from '../system/getSystemByName'

export const setComponent = <Data, State extends AnyState = AnyState>({
  state,
  data,
}: {
  state: State
  data: Component<Data>
}): State => {
  const newState = {
    ...state,
    component: {
      ...state.component,
      [data.name]: {
        ...state.component[data.name],
        [data.entity]: data,
      },
    },
  }

  const system = getSystemByName(data.name, state.system)

  if (system !== undefined) {
    if (
      system.create !== undefined &&
      (state.component[data.name] === undefined ||
        state.component[data.name][data.entity] === undefined)
    ) {
      return system.create({
        state: newState,
        component: data,
      }) as State
    } else if (system.update !== undefined) {
      // "else if" - do not run update just after create

      const previousComponent = getComponent({
        state,
        name: data.name,
        entity: data.entity,
      })

      return system.update({
        state: newState,
        component: data,
        previousComponent,
      }) as State
    }
  }

  return newState
}
