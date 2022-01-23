import { AnyState, Entity, Guid, System } from './type'
import { Component, Dictionary } from './type'

export enum componentName {
  time = 'time',
  transform = 'transform',
  mouse = 'mouse',
  keyboard = 'keyboard',
  animation = 'animation',
  collideBox = 'collideBox',
  collideCircle = 'collideCircle',
  mouseInteraction = 'mouseInteraction',
  camera = 'camera',
}

export const getComponent = <Data, State extends AnyState = AnyState>({
  name, // TODO - Data should be connected with componentName
  entity,
  state,
}: {
  name: string

  entity: Guid
  state: State
}): Component<Data> | undefined =>
  state.component[name]?.[entity] as Component<Data> | undefined

const getSystemByName = (name: string, system: Array<System<unknown>>) =>
  system.find((x) => x.componentName === name)

// todo data should be function which returns current component
// setComponent({state, data: (component) => component })
export const setComponent = <Data, State extends AnyState = AnyState>({
  state,
  data,
}: {
  state: State
  data: Component<Data>
}): State => {
  const newState = {
    ...state,
    component: {
      ...state.component,
      [data.name]: {
        ...state.component[data.name],
        [data.entity]: data,
      },
    },
  }

  const system = getSystemByName(data.name, state.system)

  if (system !== undefined && system.create !== undefined) {
    if (
      state.component[data.name] === undefined ||
      state.component[data.name][data.entity] === undefined
    ) {
      return system.create({
        state: newState,
        component: data,
      }) as State
    }
  }

  return newState
}

export const removeComponent = <State extends AnyState = AnyState>({
  name,
  entity,
  state,
}: {
  name: string
  entity: Guid
  state: State
}): State => {
  const { [entity]: _, ...dictionaryWithoutComponent } = state.component[name]

  const newState = {
    ...state,
    component: {
      ...state.component,
      [name]: dictionaryWithoutComponent,
    },
  }

  const component = getComponent({ name, state, entity })
  const system = getSystemByName(name, newState.system)

  if (system && component && system.remove) {
    return system.remove({ state: newState, component }) as State
  }

  return newState
}

export const removeComponentsByName = <
  Data,
  State extends AnyState = AnyState,
>({
  state,
  name,
}: {
  name: string
  state: State
}): State => {
  const components = getComponentsByName<Data>({ state, name })

  if (components) {
    return Object.keys(components).reduce((acc, entity) => {
      return removeComponent({ name, entity, state: acc })
    }, state)
  }

  return state
}

export const getComponentsByName = <Data, State extends AnyState = AnyState>({
  name,
  state,
}: {
  name: string
  state: State
}) => {
  return state.component[name] as Dictionary<Component<Data>> | undefined
}

/**
 * Calls create system method for all components. Useful when newly loaded components have to call side effects
 */
export const recreateAllComponents = <State extends AnyState = AnyState>({
  state,
}: {
  state: State
}): State => {
  state = Object.entries(state.component).reduce((acc, [key, value]) => {
    const system = getSystemByName(key, acc.system)

    if (!system) {
      return acc
    }

    return Object.values(value).reduce((acc2, component) => {
      if (system === undefined || system.create === undefined) {
        return acc2
      } else {
        const newState = system.create({
          state: acc2,
          component,
        })
        return newState as State
      }
    }, acc)
  }, state)

  return state
}

/**
 * Creates get and set component functions for unique entity. Useful when you have always one component eg game settings or camera
 */
export const createGetSetForUniqComponent = <
  ComponentData,
  State extends AnyState = AnyState,
>({
  entity,
  name,
}: {
  entity: Entity
  name: string
}) => {
  type Getter = (params: { state: State }) => ComponentData | undefined
  const getter: Getter = ({ state }) =>
    getComponent<Component<ComponentData>>({
      state,
      entity,
      name,
    })

  type Setter = (params: {
    state: State
    data: Partial<ComponentData>
  }) => State
  const setter: Setter = ({ state, data: dataPartial }) => {
    const data = getter({ state })

    if (!data) {
      return state
    }

    state = setComponent<Component<ComponentData>, State>({
      state,
      data: {
        entity,
        name,
        ...data,
        ...dataPartial,
      },
    })

    return state
  }

  return {
    getComponent: getter,
    setComponent: setter,
  }
}
