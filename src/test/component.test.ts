import { getState } from '../util/state'
import { generateEntity } from '../entity/generateEntity'
import { createEntity } from '../entity/createEntity'
import { runOneFrame } from '../util/runOneFrame'
import { createComponent } from '../component/createComponent'
import { removeComponent } from '../component/removeComponent'
import { updateComponent } from '../component/updateComponent'
import { getComponent } from '../component/getComponent'
import { recreateAllComponents } from '../component/recreateAllComponents'

import { createSystem } from '../system/createSystem'
import { Dictionary } from '../type'
import { InternalInitialState } from '../index'

describe('component', () => {
  it('should call system create, update and remove methods', () => {
    const entity1 = generateEntity()
    const entity2 = generateEntity()

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

    let state = createEntity({
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

    state = createComponent<Dictionary<null>, InternalInitialState>({
      state,
      entity: entity1,
      name: 'test',
      data: {},
    })
    state = createComponent<Dictionary<null>, InternalInitialState>({
      state,
      entity: entity2,
      name: 'test',
      data: {},
    })

    state = runOneFrame({ state })
    state = removeComponent({ name: 'test', entity: entity1, state })

    expect(update).toHaveBeenCalledTimes(0)
    expect(create).toHaveBeenCalledTimes(2)
    expect(remove).toHaveBeenCalledTimes(1)
    expect(tick).toHaveBeenCalledTimes(2)

    // create new component after remove
    state = createComponent<null, InternalInitialState>({
      state,
      entity: entity1,
      name: 'test',
      data: null,
    })

    expect(update).toHaveBeenCalledTimes(0)
    expect(create).toHaveBeenCalledTimes(3)

    // updating existing component
    state = updateComponent<null, InternalInitialState>({
      state,
      entity: entity1,
      name: 'test',
      update: () => null,
    })

    // Update should not trigger create
    expect(create).toHaveBeenCalledTimes(3)
    expect(update).toHaveBeenCalledTimes(1)
  })

  it('recreateAllComponents - should call create system method for all components', () => {
    const entity1 = generateEntity()

    const create = jest.fn<
      InternalInitialState,
      [{ state: InternalInitialState }]
    >(({ state }) => state)

    let state = createEntity({
      entity: entity1,
      state: getState({}),
    })

    state = createSystem({
      state,
      name: 'test',
      componentName: 'test',
      create,
    })

    state = createComponent<Dictionary<null>, InternalInitialState>({
      state,
      entity: entity1,
      name: 'test',
      data: {},
    })

    expect(create).toHaveBeenCalledTimes(1)

    state = recreateAllComponents<InternalInitialState>({ state })

    expect(create).toHaveBeenCalledTimes(2)
  })

  it('updateComponent should set component and trigger update method', () => {
    const entity = generateEntity()

    const update = jest.fn<
      InternalInitialState,
      [{ state: InternalInitialState }]
    >(({ state }) => state)

    type SomeComponent = { value: 1 }
    const name = 'test'

    let state = createEntity({
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

    state = createComponent<SomeComponent, InternalInitialState>({
      state,
      entity,
      name,
      data: {
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
