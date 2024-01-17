import { getEmptyState } from '../util/state'
import { generateEntity } from '../entity/generateEntity'
import { createEntity } from '../entity/createEntity'
import { runOneFrame } from '../util/runOneFrame'
import { createComponent } from './createComponent'
import { removeComponent } from './removeComponent'
import { updateComponent } from './updateComponent'
import { getComponent } from './getComponent'

import { createSystem } from '../system/createSystem'
import { Dictionary, EmptyState } from '../type'
import { vi, describe, it, expect } from 'vitest'

describe('component', () => {
  it('should call system create, update and remove methods', () => {
    const entity1 = generateEntity()
    const entity2 = generateEntity()
    const componentName = 'test'

    const create = vi.fn(({ state }) => state)
    const remove = vi.fn(({ state }) => state)
    const tick = vi.fn(({ state }) => state)

    const state = getEmptyState()

    createEntity(state, entity1)

    createSystem({
      state,
      name: componentName,
      componentName: componentName,
      create,
      remove,
      tick,
    })

    createComponent<Dictionary<null>, EmptyState>(
      state,
      componentName,
      entity1,
      {},
    )
    createComponent<Dictionary<null>, EmptyState>(
      state,
      componentName,
      entity2,
      {},
    )

    runOneFrame(state)
    removeComponent(state, componentName, entity1)

    expect(create).toHaveBeenCalledTimes(2)
    expect(remove).toHaveBeenCalledTimes(1)
    expect(tick).toHaveBeenCalledTimes(2)

    // create new component after remove
    createComponent<null, EmptyState>(
      state,
      componentName,
      entity1,
      null,
    )

    expect(create).toHaveBeenCalledTimes(3)

    // updating existing component
     updateComponent<null, EmptyState>(
      state,
      'test',
      entity1,
      () => null,
    )
    updateComponent<null, EmptyState>(
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
    const state = getEmptyState()

    type SomeComponent = { value: 1 }
    const name = 'test'

    createEntity(getEmptyState(), entity)

    createSystem({
      state,
      name,
      componentName: name,
      create: () => {},
    })

    createComponent<SomeComponent, EmptyState>(state, name, entity, {
      value: 1,
    })

    expect(
      getComponent<SomeComponent, EmptyState>(state, name, entity)?.value,
    ).toBe(1)

    updateComponent(state, name, entity, () => ({}))

    expect(
      getComponent<SomeComponent, EmptyState>(state, name, entity)?.value,
    ).toBe(1)

    updateComponent(state, name, entity, () => ({ value: 2 }))

    expect(
      getComponent<SomeComponent, EmptyState>(state, name, entity)?.value,
    ).toBe(2)
  })

  it('removing all components os specific name should keep empty Map in a component dictionary', () => {
    const state = getEmptyState()
    const entity = generateEntity()
    type SomeComponent = { value: 1 }
    const name = 'test'

    createEntity(getEmptyState(), entity)

    expect(state.component[name]).toEqual(undefined)

    createComponent<SomeComponent, EmptyState>(state, name, entity, {
      value: 1,
    })

    expect(
      getComponent<SomeComponent, EmptyState>(state, name, entity)?.value,
    ).toBe(1)

    removeComponent(state, name, entity)

    expect(state.component[name]).toEqual(new Map())
  })
})
