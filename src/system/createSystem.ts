import { Dictionary } from '../type'
import { State } from '../type'

const doNothing = <Component>(params: SystemMethodParams<Component>) =>
  params.state

type SystemMethodParams<Component> = {
  state: State
  component: Component
}

export type CreateSystemParams<Component> = {
  state: State
  name: string
  create?: (params: SystemMethodParams<Component>) => State
  tick?: (params: SystemMethodParams<Component>) => State
  remove?: (params: SystemMethodParams<Component>) => State
}

export type System<Component> = {
  name: string
  create: (params: SystemMethodParams<Component>) => State
  tick: (params: { state: State }) => State
  remove: (params: SystemMethodParams<Component>) => State
}

export const createSystem = <Component>({
  state,
  tick,
  ...params
}: CreateSystemParams<Component>): State => {
  const system: System<Component> = {
    name: params.name,
    create: params.create || doNothing,
    tick: ({ state }) => {
      if (tick) {
        const component = state.component[params.name] as Dictionary<Component>
        if (component) {
          return Object.values(component).reduce(
            (acc, component) => tick({ state: acc, component }),
            state,
          )
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

export type CreateGlobalSystemParams = {
  state: State
  name: string
  tick: (params: { state: State }) => State
}

export type GlobalSystem = {
  name: string
  tick: (params: { state: State }) => State
  create: (params: { state: State }) => State
  remove: (params: { state: State }) => State
}

export const createGlobalSystem = ({
  state,
  tick,
  ...params
}: CreateGlobalSystemParams): State => {
  const system: GlobalSystem = {
    name: params.name,
    tick,
    create: ({ state }) => state,
    remove: ({ state }) => state,
  }

  return {
    ...state,
    system: {
      ...state.system,
      [params.name]: system,
    },
  }
}
