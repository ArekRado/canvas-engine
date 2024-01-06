import { getInitialStateWithSystems } from '../util/state'
import { generateEntity } from '../entity/generateEntity'
import { createEntity } from '../entity/createEntity'
import { runOneFrame } from '../util/runOneFrame'
import { createComponent } from './createComponent'
import { removeComponent } from './removeComponent'
import { updateComponent } from './updateComponent'
import { getComponent } from './getComponent'

import { createSystem } from '../system/createSystem'
import { Dictionary, InitialState } from '../type'
import { vi, describe, it, expect } from 'vitest'

describe('component', () => {
  it('should call system create, update and remove methods', () => {
    const entity1 = generateEntity()
    const entity2 = generateEntity()
    const componentName = 'test'

    const create = vi.fn(({ state }) => state)
    const remove = vi.fn(({ state }) => state)
    const tick = vi.fn(({ state }) => state)

    let state = createEntity(getInitialStateWithSystems(), entity1)

    state = createSystem({
      state,
      name: componentName,
      componentName: componentName,
      create,
      remove,
      tick,
    })

    state = createComponent<Dictionary<null>, InitialState>(
      state,
      componentName,
      entity1,
      {},
    )
    state = createComponent<Dictionary<null>, InitialState>(
      state,
      componentName,
      entity2,
      {},
    )

    state = runOneFrame({ state })
    state = removeComponent(state, componentName, entity1)

    expect(create).toHaveBeenCalledTimes(2)
    expect(remove).toHaveBeenCalledTimes(1)
    expect(tick).toHaveBeenCalledTimes(2)

    // create new component after remove
    state = createComponent<null, InitialState>(
      state,
      componentName,
      entity1,
      null,
    )

    expect(create).toHaveBeenCalledTimes(3)

    // updating existing component
    state = updateComponent<null, InitialState>(
      state,
      'test',
      entity1,
      () => null,
    )
    state = updateComponent<null, InitialState>(
      state,
      'test',
      entity1,
      () => null,
      // callSystemUpdateMethod: false,
    )

    // Update should not trigger create
    expect(create).toHaveBeenCalledTimes(3)
  })

  it('updateComponent should set component and trigger update method', () => {
    const entity = generateEntity()

    const update = vi.fn(({ state }) => state)

    type SomeComponent = { value: 1 }
    const name = 'test'

    let state = createEntity(getInitialStateWithSystems(), entity)

    state = createSystem({
      state,
      name,
      componentName: name,
      create: ({ state }) => state,
    })

    state = createComponent<SomeComponent, InitialState>(state, name, entity, {
      value: 1,
    })

    expect(
      getComponent<SomeComponent, InitialState>(state, name, entity)?.value,
    ).toBe(1)

    state = updateComponent(state, name, entity, () => ({}))

    expect(
      getComponent<SomeComponent, InitialState>(state, name, entity)?.value,
    ).toBe(1)

    state = updateComponent(state, name, entity, () => ({ value: 2 }))

    expect(
      getComponent<SomeComponent, InitialState>(state, name, entity)?.value,
    ).toBe(2)
  })

  it('removing all components os specific name should keep empty Map in a component dictionary', () => {
    const entity = generateEntity()
    type SomeComponent = { value: 1 }
    const name = 'test'

    let state = createEntity(getInitialStateWithSystems(), entity)

    expect(state.component[name]).toEqual(undefined)

    state = createComponent<SomeComponent, InitialState>(state, name, entity, {
      value: 1,
    })

    expect(
      getComponent<SomeComponent, InitialState>(state, name, entity)?.value,
    ).toBe(1)

    state = removeComponent(state, name, entity)

    expect(state.component[name]).toEqual(new Map())
  })
})
