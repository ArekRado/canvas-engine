import { Guid, State } from './type'
import { Component, Dictionary } from './type'

export enum componentName {
  sprite = 'sprite',
  animation = 'animation',
  collideBox = 'collideBox',
  collideCircle = 'collideCircle',
  blueprint = 'blueprint',
  mouseInteraction = 'mouseInteraction',
}

type SetComponentParams<Data> = {
  state: State
  data: Component<Data>
}
export const setComponent = <Data>(
  name: string,
  { state, data }: SetComponentParams<Data>,
): State => {
  const newState = {
    ...state,
    component: {
      ...state.component,
      [name]: {
        ...state.component[name],
        [data.entityId]: data,
      },
    },
  }

  if (
    state.system[name] !== undefined &&
    (state.component[name] === undefined ||
      state.component[name][data.entityId] === undefined)
  ) {
    return state.system[name].create({ state: newState, component: data })
  }

  return newState
}

type RemoveComponent = (
  name: string,
  params: {
    entityId: Guid
    state: State
  },
) => State
export const removeComponent: RemoveComponent = (name, { entityId, state }) => {
  const { [entityId]: _, ...dictionaryWithoutComponent } = state.component[
    name
  ] as Dictionary<Component<any>>

  const newState = {
    ...state,
    component: {
      ...state.component,
      [name]: dictionaryWithoutComponent,
    },
  }

  const component = getComponent(name, { state, entityId })

  if (newState.system[name]) {
    return newState.system[name].remove({ state: newState, component })
  }

  return newState
}

export const getComponent = <Data>(
  name: string,
  {
    entityId,
    state,
  }: {
    entityId: Guid
    state: State
  },
): Component<Data> | undefined => {
  const c: Dictionary<Component<Data>> = state.component[name]
  return c ? (c[entityId] as Component<Data> | undefined) : undefined
}
