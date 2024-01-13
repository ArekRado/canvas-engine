import { Entity, EmptyState, UnknownComponent } from './type'
import { createEntity } from './entity/createEntity'
import { createComponent } from './component/createComponent'
import { updateComponent } from './component/updateComponent'
import { removeComponent } from './component/removeComponent'
import { getComponent } from './component/getComponent'
import { getEmptyState } from './util/state'
import { removeEntity } from './entity/removeEntity'
import { getEntity } from './entity/getEntity'
import { createGlobalSystem, createSystem } from './system/createSystem'
import { createEventContainer } from './event'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createStore = <State extends EmptyState<any, any>>(
  components?: UnknownComponent,
) => {
  let state = getEmptyState() as State

  state.component = {
    ...state.component,
    ...components,
  }

  const { emitEvent, eventSystem, addEventHandler, removeEventHandler } =
    createEventContainer()

  state = eventSystem(state)

  return {
    // State
    getState: () => state,
    setState: (newState: State) => (state = newState),

    // Event
    addEventHandler,
    removeEventHandler,
    emitEvent,

    // Entity
    getEntity: (entity: Entity) => getEntity<State>(state, entity),
    createEntity: (entity: Entity) => {
      state = createEntity<State>(state, entity)
    },
    removeEntity: (entity: Entity) => {
      state = removeEntity<State>(state, entity)
    },

    // Component
    getComponent: <ComponentData>(name: string, entity: Entity) =>
      getComponent<ComponentData, State>(state, name, entity),
    createComponent: <ComponentData>(
      name: string,
      entity: Entity,
      data: ComponentData,
    ) => {
      state = createComponent<ComponentData, State>(state, name, entity, data)
    },
    updateComponent: <ComponentData>(
      name: string,
      entity: Entity,
      update: Parameters<typeof updateComponent<ComponentData, State>>[3],
    ) => {
      state = updateComponent<ComponentData, State>(state, name, entity, update)
    },
    removeComponent: (name: string, entity: Entity) => {
      state = removeComponent<State>(state, name, entity)
    },

    // System
    createSystem: <Component>(
      parameters: Omit<
        Parameters<typeof createSystem<Component, State>>[0],
        'state'
      >,
    ) => {
      state = createSystem<Component, State>({
        state,
        ...parameters,
      })
    },

    createGlobalSystem: (
      parameters: Omit<
        Parameters<typeof createGlobalSystem<State>>[0],
        'state'
      >,
    ) => {
      state = createGlobalSystem<State>({
        state,
        ...parameters,
      })
    },
  }
}
