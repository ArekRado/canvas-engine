import { State, Dictionary, Component, EventHandler } from '../type'

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

type SystemMethodParams<ComponentData> = {
  state: State
  component: Component<ComponentData>
}

export type CreateSystemParams<Component> = {
  state: State
  name: string
  initialize?: (params: { state: State }) => State
  create?: (params: SystemMethodParams<Component>) => State
  update?: (params: SystemMethodParams<Component>) => State
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
  /**
   * Called on each setComponent
   */
  update?: (params: SystemMethodParams<Component>) => State
  /**
   * Called on each runOneFrame
   */
  tick: (params: { state: State }) => State
  remove: (params: SystemMethodParams<Component>) => State
  priority: number
}

export const createSystem = <ComponentData>({
  state,
  tick,
  ...params
}: CreateSystemParams<ComponentData>): State => {
  const system: System<ComponentData> = {
    name: params.name,
    priority: params.priority || systemPriority.zero,
    initialize: params.initialize || doNothing,
    create: params.create || doNothing,
    tick: ({ state }) => {
      const component = state.component[params.name] as Dictionary<
        Component<ComponentData>
      >
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
    update: params.update,
    remove: params.remove || doNothing,
  }

  return {
    ...state,
    system: [...state.system, system],
  }
}

export type CreateGlobalSystemParams<Events> = {
  state: State
  name: string
  initialize?: (params: { state: State }) => State
  create?: (params: { state: State }) => State
  tick?: (params: { state: State }) => State
  priority?: number
  event?: EventHandler<Events>
}

export type GlobalSystem = {
  name: string
  // update: undefined
  tick: (params: { state: State }) => State
  /**
   * Called only once when engine is initializing
   */
  initialize: (params: { state: State }) => State
  create: (params: { state: State }) => State
  remove: (params: { state: State }) => State
  priority: number
  // event: Dictionary<EventHandler>;
}

export const createGlobalSystem = <Events>({
  state,
  initialize,
  tick,
  ...params
}: CreateGlobalSystemParams<Events>): State => {
  const system: GlobalSystem = {
    name: params.name,
    priority: params.priority || systemPriority.zero,
    // update: undefined,
    tick: tick || doNothing,
    initialize: initialize || doNothing,
    create: doNothing,
    remove: ({ state }) => state,
    // event: params.event || {},
  }

  return {
    ...state,
    system: [...state.system, system],
  }
}
