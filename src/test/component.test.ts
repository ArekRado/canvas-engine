import 'regenerator-runtime/runtime'
import { getState } from '../util/state'
import { setEntity, createEntity } from '../entity'
import { runOneFrame } from '../util/runOneFrame'
import {
  recreateAllComponents,
  removeComponent,
  setComponent,
} from '../component'
import { createSystem } from '../system/createSystem'
import { Dictionary } from '../type'
import { InternalInitialState } from '..'

describe('component', () => {
  it('should call system create and remove methods', () => {
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

    expect(create).toHaveBeenCalledTimes(2)
    expect(remove).toHaveBeenCalled()
    expect(tick).toHaveBeenCalled()

    // create new component after remove
    state = setComponent<Partial<{}>, InternalInitialState>({
      state,
      data: {
        entity: entity1,
        name: 'test',
      },
    })

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

  it.todo('getComponentsByName')
})
