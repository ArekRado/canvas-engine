import { Entity, Guid, State } from './type'
import { Component, Dictionary } from './type'

export enum componentName {
  sprite = 'sprite',
  transform = 'transform',
  animation = 'animation',
  collideBox = 'collideBox',
  collideCircle = 'collideCircle',
}

type SetComponent = (params: {
  name: string
  state: State
  data: Component<object>
}) => State
export const setComponent: SetComponent = ({ state, data, name }) => ({
  ...state,
  component: {
    ...state.component,
    [name]: {
      ...state.component[name],
      [data.entity.id]: data,
    },
  },
})

type RemoveComponent = (params: {
  entity: Entity
  state: State
  name: string
}) => State
export const removeComponent: RemoveComponent = ({ entity, state, name }) => {
  const { [entity.id]: _, ...dictionaryWithoutComponent } = state.component[
    name
  ] as Dictionary<Component<any>>

  return {
    ...state,
    component: {
      ...state.component,
      [name]: dictionaryWithoutComponent,
    },
  }
}

type RemoveComponentByEntity = (params: {
  entity: Entity
  state: State
  name: string
}) => State
export const removeComponentByEntity: RemoveComponentByEntity = ({
  entity,
  state,
  name,
}) => {
  const entriesWithoutComponent = Object.entries(state.component[name]).filter(
    ([_, value]: [Guid, Component<any>]) => value.entity !== entity,
  )

  return {
    ...state,
    component: {
      ...state.component,
      [name]: Object.fromEntries(entriesWithoutComponent),
    },
  }
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
