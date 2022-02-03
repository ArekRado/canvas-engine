import 'regenerator-runtime/runtime'
import { getState } from '../util/state'
import { setEntity, createEntity } from '../entity'
import { runOneFrame } from '../util/runOneFrame'
import {
  recreateAllComponents,
  removeComponent,
  setComponent,
  updateComponent,
} from '../component'
import { createSystem } from '../system/createSystem'
import { Component, Dictionary } from '../type'
import { getComponent, InternalInitialState } from '..'

describe('component', () => {
  it('should call system create, update and remove methods', () => {
    const entity1 = createEntity({ name: 'e1' })
    const entity2 = createEntity({ name: 'e2' })

    const create = jest.fn<
      InternalInitialState,
      [{ state: InternalInitialState }]
    >(({ state }) => state)
    const remove = jest.fn<
      InternalInitialState,
      [{ state: InternalInitialState }]
    >(({ state }) => state)
    const update = jest.fn<
      InternalInitialState,
      [{ state: InternalInitialState }]
    >(({ state }) => state)
    const tick = jest.fn<
      InternalInitialState,
      [{ state: InternalInitialState }]
    >(({ state }) => state)

    let state = setEntity({
      entity: entity1,
      state: getState({}),
    })

    state = createSystem({
      state,
      name: 'test',
      componentName: 'test',
      create,
      remove,
      tick,
      update,
    })

    state = setComponent<Dictionary<{}>, InternalInitialState>({
      state,
      data: {
        entity: entity1,
        name: 'test',
      },
    })
    state = setComponent<Dictionary<{}>, InternalInitialState>({
      state,
      data: {
        entity: entity2,
        name: 'test',
      },
    })

    state = runOneFrame({ state })
    state = removeComponent({ name: 'test', entity: entity1, state })

    expect(update).toHaveBeenCalledTimes(0)
    expect(create).toHaveBeenCalledTimes(2)
    expect(remove).toHaveBeenCalledTimes(1)
    expect(tick).toHaveBeenCalledTimes(2)

    // create new component after remove
    state = setComponent<Partial<{}>, InternalInitialState>({
      state,
      data: {
        entity: entity1,
        name: 'test',
      },
    })

    expect(update).toHaveBeenCalledTimes(0)
    expect(create).toHaveBeenCalledTimes(3)

    // updating existing component
    state = setComponent<Partial<{}>, InternalInitialState>({
      state,
      data: {
        entity: entity1,
        name: 'test',
      },
    })

    // Update should not trigger create
    expect(create).toHaveBeenCalledTimes(3)
    expect(update).toHaveBeenCalledTimes(1)
  })

  it('recreateAllComponents - should call create system method for all components', () => {
    const entity1 = createEntity({ name: 'e1' })

    const create = jest.fn<
      InternalInitialState,
      [{ state: InternalInitialState }]
    >(({ state }) => state)

    let state = setEntity({
      entity: entity1,
      state: getState({}),
    })

    state = createSystem({
      state,
      name: 'test',
      componentName: 'test',
      create,
    })

    state = setComponent<Dictionary<{}>, InternalInitialState>({
      state,
      data: {
        entity: entity1,
        name: 'test',
      },
    })

    expect(create).toHaveBeenCalledTimes(1)

    state = recreateAllComponents<InternalInitialState>({ state })

    expect(create).toHaveBeenCalledTimes(2)
  })

  it('updateComponent should set component and trigger update method', () => {
    const entity = createEntity({ name: 'e1' })

    const update = jest.fn<
      InternalInitialState,
      [{ state: InternalInitialState }]
    >(({ state }) => state)

    type SomeComponent = Component<{ value: 1 }>
    const name = 'test'

    let state = setEntity({
      entity,
      state: getState({}),
    })

    state = createSystem({
      state,
      name,
      componentName: name,
      update,
      create: ({ state }) => state,
    })

    state = setComponent<SomeComponent, InternalInitialState>({
      state,
      data: {
        entity,
        name,
        value: 1,
      },
    })

    expect(update).toHaveBeenCalledTimes(0)
    expect(getComponent<SomeComponent>({ state, entity, name })?.value).toBe(1)

    state = updateComponent({
      state,
      entity,
      name,
      update: () => ({}),
    })

    expect(getComponent<SomeComponent>({ state, entity, name })?.value).toBe(1)
    expect(update).toHaveBeenCalledTimes(1)

    state = updateComponent({
      state,
      entity,
      name,
      update: () => ({ value: 2 }),
    })

    expect(getComponent<SomeComponent>({ state, entity, name })?.value).toBe(2)
    expect(update).toHaveBeenCalledTimes(2)
  })

  it.todo('getComponentsByName')
})
