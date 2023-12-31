import {
  AnyStateForSystem,
  EmitEvent,
  GlobalSystem,
  SystemMethodParams,
} from '../type'

export enum systemPriority {
  last = 4,
  zero = 0,

  // IO uses mutated state so it should be called first
  mouse = -1,
  keyboard = -1,
}

const triggerTickForAllComponents = <
  ComponentData,
  State extends AnyStateForSystem = AnyStateForSystem,
>({
  state,
  componentName,
  tickCallback,
}: {
  state: State
  componentName: string
  tickCallback: (params: SystemMethodParams<ComponentData, State>) => State
}): State => {
  const components = state.component[componentName]

  if (components) {
    for (const [entity, component] of components) {
      state = tickCallback({
        state: state,
        component,
        name: componentName,
        entity,
      })
    }
  }

  return state
}

export const createSystem = <
  ComponentData,
  State extends AnyStateForSystem = AnyStateForSystem,
>({
  state,
  tick,
  fixedTick,
  ...params
}: {
  state: State
  name: string
  componentName: string
  initialize?: (params: { state: State }) => State
  create?: (params: SystemMethodParams<ComponentData, State>) => State
  tick?: (params: SystemMethodParams<ComponentData, State>) => State
  fixedTick?: (params: SystemMethodParams<ComponentData, State>) => State
  remove?: (params: SystemMethodParams<ComponentData, State>) => State
  priority?: number
  emitEvent?: EmitEvent
}): State => {
  const system = {
    name: params.name,
    componentName: params.componentName,
    priority: params.priority || systemPriority.last,
    create: params.create,
    tick: tick
      ? ({ state }: { state: State }) => {
          return triggerTickForAllComponents({
            state,
            componentName: params.componentName,
            tickCallback: tick,
          })
        }
      : undefined,
    fixedTick: fixedTick
      ? ({ state }: { state: State }) => {
          return triggerTickForAllComponents({
            state,
            componentName: params.componentName,
            tickCallback: fixedTick,
          })
        }
      : undefined,
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
  fixedTick,
  name,
  priority,
}: {
  state: State
  name: string
  tick?: (params: { state: State }) => State
  fixedTick?: (params: { state: State }) => State
  priority?: number
}): State => {
  const globalSystem: GlobalSystem<State> = {
    name,
    priority: priority || systemPriority.zero,
    tick,
    fixedTick,
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
