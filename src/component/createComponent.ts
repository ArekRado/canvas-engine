import { Entity, State } from '../main'
import { AnimatedProperty, Component, Dictionary } from '../type'
import { GetDefaultComponent } from '../util/defaultComponents'

type RemoveByEntity = (params: {
  entity: Entity
  state: State
  componentName: keyof State['component']
}) => State

export const removeByEntity: RemoveByEntity = ({
  entity,
  state,
  componentName,
}) => {
  const entriesWithoutComponent = Object.entries(
    state.component[componentName],
  ).filter(([_, value]) => value.entity !== entity)

  return {
    ...state,
    component: {
      ...state.component,
      [componentName]: Object.fromEntries(entriesWithoutComponent),
    },
  }
}

export type CreateComponentOptions<Data> = {
  defaultData?: GetDefaultComponent<Component<Data>>
  animatedProperties?: Array<AnimatedProperty>
}

export type CreateComponent<Data> = {
  defaultData?: GetDefaultComponent<Component<Data>>
  animatedProperties?: Array<AnimatedProperty>
  set: (params: { state: State; data: Component<Data> }) => State
  // setData: (params: { state: State; data: Data }) => State
  get: (params: { entity: Entity; state: State }) => Component<Data> | undefined
  remove: (params: { entity: Entity; state: State }) => State
  removeByEntity: (params: { entity: Entity; state: State }) => State
}

export const createComponent = <Data>(
  componentName: keyof State['component'],
  { defaultData, animatedProperties }: CreateComponentOptions<Data>,
): CreateComponent<Data> => ({
  defaultData,
  animatedProperties: animatedProperties || [],
  set: ({ state, data }) => ({
    ...state,
    component: {
      ...state.component,
      [componentName]: {
        ...state.component[componentName],
        [data.entity.id]: data,
      },
    },
  }),

  remove: ({ entity, state }) => {
    const { [entity.id]: _, ...dictionaryWithoutComponent } = state.component[
      componentName
    ]

    return {
      ...state,
      component: {
        ...state.component,
        [componentName]: dictionaryWithoutComponent,
      },
    }
  },

  removeByEntity: ({ entity, state }) =>
    removeByEntity({ entity, state, componentName }),

  get: ({ entity, state }) => {
    const c: Dictionary<Component<any>> = state.component[componentName]
    return c[entity.id] as Component<Data> | undefined
  },
})
