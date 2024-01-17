import {
  EmitEvent,
  Entity,
  GlobalSystem,
  EmptyState,
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  State extends EmptyState<any, any>,
>({
  state,
  componentName,
  tickCallback,
}: {
  state: State
  componentName: string
  tickCallback: (params: SystemMethodParams<ComponentData>) => void
}): void => {
  const components = state.component[componentName] as Map<
    Entity,
    ComponentData
  >

  if (components) {
    for (const [entity, component] of components) {
      tickCallback({
        component,
        name: componentName,
        entity,
      })
    }
  }
}

export const createSystem = <
  ComponentData,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  State extends EmptyState<any, any>,
>({
  state,
  tick,
  ...params
}: {
  state: State
  name: string
  componentName: string
  create?: (params: SystemMethodParams<ComponentData>) => void
  tick?: (params: SystemMethodParams<ComponentData>) => void
  remove?: (params: SystemMethodParams<ComponentData>) => void
  priority?: number
  emitEvent?: EmitEvent
}): void => {
  const system = {
    name: params.name,
    componentName: params.componentName,
    priority: params.priority || systemPriority.last,
    create: params.create,
    tick: tick
      ? () => {
          triggerTickForAllComponents({
            state,
            componentName: params.componentName,
            tickCallback: tick,
          })
        }
      : undefined,
    remove: params.remove,
  }

  state.system.push(system)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createGlobalSystem = <State extends EmptyState<any, any>>({
  state,
  tick,
  name,
  priority,
}: {
  state: State
  name: string
  tick?: () => void
  priority?: number
}) => {
  const globalSystem: GlobalSystem = {
    name,
    priority: priority || systemPriority.zero,
    tick,
    create: undefined,
    remove: () => {},
  }

  state.globalSystem.push(globalSystem)
}
