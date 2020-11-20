import { Dictionary } from 'type'
import { Entity, State } from '../main'

type SystemMethodParams<Component> = {
  state: State
  component?: Component
  entity?: Entity
}

export type CreateSystemParams<Component> = {
  componentName: string
  init: (params: SystemMethodParams<Component>) => State
  tick: (params: SystemMethodParams<Component>) => State
  remove: (params: SystemMethodParams<Component>) => State
}

export type System = {
  componentName: string
  init: ({ state }: { state: State }) => State
  tick: ({ state }: { state: State }) => State
  remove: ({ state }: { state: State }) => State
}

export const createSystem = <Component>(
  params: CreateSystemParams<Component>,
): System => ({
  componentName: params.componentName,
  init: params.init,
  tick: ({ state }) => {
    const component = state.component[params.componentName] as Dictionary<
      Component
    >
    if (component) {
      return Object.values(component).reduce(
        (acc, component) => params.tick({ state: acc, component }),
        state,
      )
    } else {
      return state.entity.reduce(
        (acc, entity) => params.tick({ state: acc, entity }),
        state,
      )
    }
  },
  remove: params.remove,
})
