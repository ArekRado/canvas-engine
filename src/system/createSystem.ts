import { Dictionary } from '../type'
import { State } from '../type'

export enum systemPriority {
  last = 3,
  time = 3,
  io = 2,
  transform = 1,
  zero = 0,
  sprite = -1,
  draw = -2,
}

const doNothing = (params: { state: State }) => params.state

type SystemMethodParams<Component> = {
  state: State
  component: Component
}

export type CreateSystemParams<Component> = {
  state: State
  name: string
  initialize?: (params: { state: State }) => State
  create?: (params: SystemMethodParams<Component>) => State
  tick?: (params: SystemMethodParams<Component>) => State
  remove?: (params: SystemMethodParams<Component>) => State
  priority?: number
}

export type System<Component> = {
  name: string
  /**
   * Called only once when engine is initializing
   */
  initialize: (params: { state: State }) => State
  /**
   * Called on each component create if state.component[name] and system name are the same
   */
  create: (params: SystemMethodParams<Component>) => State
  tick: (params: { state: State }) => State
  remove: (params: SystemMethodParams<Component>) => State
  priority: number
}

export const createSystem = <Component>({
  state,
  tick,
  ...params
}: CreateSystemParams<Component>): State => {
  const system: System<Component> = {
    name: params.name,
    priority: params.priority || systemPriority.zero,
    initialize: params.initialize || doNothing,
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
    system: [...state.system, system],
  }
}

export type CreateGlobalSystemParams = {
  state: State
  name: string
  initialize?: (params: { state: State }) => State
  create?: (params: { state: State }) => State
  tick?: (params: { state: State }) => State
  priority?: number
}

export type GlobalSystem = {
  name: string
  tick: (params: { state: State }) => State
  /**
   * Called only once when engine is initializing
   */
  initialize: (params: { state: State }) => State
  create: (params: { state: State }) => State
  remove: (params: { state: State }) => State
  priority: number
}

export const createGlobalSystem = ({
  state,
  initialize,
  tick,
  ...params
}: CreateGlobalSystemParams): State => {
  const system: GlobalSystem = {
    name: params.name,
    priority: params.priority || systemPriority.zero,
    tick: tick || doNothing,
    initialize: initialize || doNothing,
    create: doNothing,
    remove: ({ state }) => state,
  }

  return {
    ...state,
    system: [...state.system, system],
  }
}
