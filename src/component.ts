import { Entity, State } from './type'
import { Component, Dictionary } from './type'

export enum componentName {
  sprite = 'sprite',
  transform = 'transform',
  animation = 'animation',
  collideBox = 'collideBox',
  collideCircle = 'collideCircle',
  blueprint = 'blueprint',
}

type SetComponent = (params: {
  name: string
  state: State
  data: Component<Dictionary<any>>
}) => State
export const setComponent: SetComponent = ({ state, data, name }) => {
  const newState = {
    ...state,
    component: {
      ...state.component,
      [name]: {
        ...state.component[name],
        [data.entity.id]: data,
      },
    },
  }

  if (
    state.system[name] !== undefined &&
    (state.component[name] === undefined ||
      state.component[name][data.entity.id] === undefined)
  ) {
    return state.system[name].create({ state: newState })
  }

  return newState
}

type RemoveComponent = (params: {
  entity: Entity
  state: State
  name: string
}) => State
export const removeComponent: RemoveComponent = ({ entity, state, name }) => {
  const { [entity.id]: _, ...dictionaryWithoutComponent } = state.component[
    name
  ] as Dictionary<Component<any>>

  const newState = {
    ...state,
    component: {
      ...state.component,
      [name]: dictionaryWithoutComponent,
    },
  }

  if (newState.system[name]) {
    return newState.system[name].remove({ state: newState })
  }

  return newState
}

export const getComponent = <Data>({
  entity,
  state,
  name,
}: {
  entity: Entity
  state: State
  name: string
}): Component<Data> | undefined => {
  const c: Dictionary<Component<Data>> = state.component[name]
  return c ? (c[entity.id] as Component<Data> | undefined) : undefined
}
