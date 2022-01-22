import {
  Dictionary,
  Component,
  SystemMethodParams,
  AnyStateForSystem,
  GlobalSystem,
} from '../type'

export enum systemPriority {
  last = 4,
  zero = 0,

  // IO uses mutated state so it should be called first
  mouse = -1, 
  keyboard = -1,
  
  animation = 3,
  time = 2,
  transform = 1,
  // draw = -2,
}

export const createSystem = <
  ComponentData,
  State extends AnyStateForSystem = AnyStateForSystem,
>({
  state,
  tick,
  ...params
}: {
  state: State
  name: string
  componentName: string
  initialize?: (params: { state: State }) => State
  create?: (params: SystemMethodParams<ComponentData, State>) => State
  tick?: (params: SystemMethodParams<ComponentData, State>) => State
  remove?: (params: SystemMethodParams<ComponentData, State>) => State
  priority?: number
}): State => {
  const system = {
    name: params.name,
    componentName: params.componentName,
    priority: params.priority || systemPriority.last,
    create: params.create,
    tick: ({ state }: { state: State }) => {
      const component = state.component[params.componentName] as Dictionary<
        Component<ComponentData>
      > | undefined

      if (component) {
        return Object.values(component).reduce(
          (acc, component: Component<ComponentData>) => {
            return tick ? tick({ state: acc, component }) : acc
          },
          state,
        )
      }

      return state
    },
    remove: params.remove,
  }

  return {
    ...state,
    system: [...state.system, system],
  }
}

export const createGlobalSystem = <State extends AnyStateForSystem>({
  state,
  tick,
  name,
  priority,
}: {
  state: State
  name: string
  tick?: (params: { state: State }) => State
  priority?: number
}): State => {
  const globalSystem: GlobalSystem<State> = {
    name,
    priority: priority || systemPriority.zero,
    tick,
    create: undefined,
    remove: ({ state }) => state,
  }

  return {
    ...state,
    globalSystem: [
      ...(state.globalSystem as State['globalSystem']),
      globalSystem,
    ],
  }
}
