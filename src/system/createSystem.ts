import { Dictionary } from '../type'
import { State } from '../type'

const doNothing = <Component>(params: SystemMethodParams<Component>) =>
  params.state

type SystemMethodParams<Component> = {
  state: State
  component?: Component
}

export type CreateSystemParams<Component> = {
  state: State
  name: string
  create?: (params: SystemMethodParams<Component>) => State
  tick?: (params: SystemMethodParams<Component>) => State
  remove?: (params: SystemMethodParams<Component>) => State
}

export type System = {
  name: string
  create: ({ state }: { state: State }) => State
  tick: ({ state }: { state: State }) => State
  remove: ({ state }: { state: State }) => State
}

export const createSystem = <Component>({
  state,
  tick,
  ...params
}: CreateSystemParams<Component>): State => {
  const system: System = {
    name: params.name,
    create: params.create || doNothing,
    tick: ({ state }) => {
      if (tick) {
        const component = state.component[params.name] as Dictionary<Component>
        if (component && tick) {
          return Object.values(component).reduce(
            (acc, component) => tick({ state: acc, component }),
            state,
          )
        } else {
          return tick({ state })
        }
      }

      return state
    },
    remove: params.remove || doNothing,
  }

  return {
    ...state,
    system: {
      ...state.system,
      [params.name]: system,
    },
  }
}
