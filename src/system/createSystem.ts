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
      const component = state.component[params.componentName] as
        | Dictionary<ComponentData>
        | undefined

      if (component) {
        return Object.keys(component).reduce((acc, entity: Entity) => {
          if (tick) {
            const component = getComponent<ComponentData>({
              state: acc,
              name: params.name,
              entity,
            })

            if (!component) {
              return acc
            }

            return tick({
              state: acc,
              component,
              name: params.componentName,
              entity,
            })
          } else {
            return acc
          }
        }, state)
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
