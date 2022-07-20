import { getComponent } from '../component/getComponent'
import {
  AnyStateForSystem,
  Dictionary,
  EmitEvent,
  Entity,
  GlobalSystem,
  SystemMethodParams,
} from '../type'

export enum systemPriority {
  last = 4,
  zero = 0,

  // IO uses mutated state so it should be called first
  mouse = -1,
  keyboard = -1,

  time = 1,
  collider = 2,
  rigidBody = 3,
  transform = 4,
  animation = 5,
  // draw = -2,
}

const triggerTickForAllComponents = <
  ComponentData,
  State extends AnyStateForSystem = AnyStateForSystem,
>({
  state,
  componentName,
  systemName,
  tickCallback,
}: {
  state: State
  componentName: string
  systemName: string
  tickCallback: (params: SystemMethodParams<ComponentData, State>) => State
}): State => {
  const component = state.component[componentName] as
    | Dictionary<ComponentData>
    | undefined

  if (component) {
    return Object.keys(component).reduce((acc, entity: Entity) => {
      const component = getComponent<ComponentData>({
        state: acc,
        name: systemName,
        entity,
      })

      if (!component) {
        return acc
      }

      return tickCallback({
        state: acc,
        component,
        name: componentName,
        entity,
      })
    }, state)
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
  update?: (
    params: SystemMethodParams<ComponentData, State> & {
      previousComponent: ComponentData
    },
  ) => State
  priority?: number
  emitEvent?: EmitEvent
}): State => {
  const system = {
    name: params.name,
    componentName: params.componentName,
    priority: params.priority || systemPriority.last,
    create: params.create,
    update: params.update,
    tick: ({ state }: { state: State }) => {
      if (!tick) {
        return state
      }

      return triggerTickForAllComponents({
        state,
        componentName: params.componentName,
        systemName: params.name,
        tickCallback: tick,
      })
    },
    fixedTick: ({ state }: { state: State }) => {
      if (!fixedTick) {
        return state
      }

      return triggerTickForAllComponents({
        state,
        componentName: params.componentName,
        systemName: params.name,
        tickCallback: fixedTick,
      })
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
