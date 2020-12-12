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

type SetComponent = (
  name: string,
  params: {
    state: State
    data: Component<Dictionary<any>>
  },
) => State
export const setComponent: SetComponent = (name, { state, data }) => {
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
    return state.system[name].create({ state: newState, component: data })
  }

  return newState
}

type RemoveComponent = (
  name: string,
  params: {
    entity: Entity
    state: State
  },
) => State
export const removeComponent: RemoveComponent = (name, { entity, state }) => {
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

  const component = getComponent(name, { state, entity })

  if (newState.system[name]) {
    return newState.system[name].remove({ state: newState, component })
  }

  return newState
}

export const getComponent = <Data>(
  name: string,
  {
    entity,
    state,
  }: {
    entity: Entity
    state: State
  },
): Component<Data> | undefined => {
  const c: Dictionary<Component<Data>> = state.component[name]
  return c ? (c[entity.id] as Component<Data> | undefined) : undefined
}
