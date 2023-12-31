import { getState } from '../util/state'
import { generateEntity } from '../entity/generateEntity'
import { createEntity } from '../entity/createEntity'
import { runOneFrame } from '../util/runOneFrame'
import { createComponent } from './createComponent'
import { removeComponent } from './removeComponent'
import { updateComponent } from './updateComponent'
import { getComponent } from './getComponent'

import { createSystem } from '../system/createSystem'
import { Dictionary } from '../type'
import { InternalInitialState } from '../index'
import { vi, describe, it, expect } from 'vitest'

describe('component', () => {
  it('should call system create, update and remove methods', () => {
    const entity1 = generateEntity()
    const entity2 = generateEntity()

    const create = vi.fn(({ state }) => state)
    const remove = vi.fn(({ state }) => state)
    const tick = vi.fn(({ state }) => state)

    let state = createEntity({
      entity: entity1,
      state: getState(),
    })

    state = createSystem({
      state,
      name: 'test',
      componentName: 'test',
      create,
      remove,
      tick,
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

    expect(create).toHaveBeenCalledTimes(3)

    // updating existing component
    state = updateComponent<null, InternalInitialState>({
      state,
      entity: entity1,
      name: 'test',
      update: () => null,
    })
    state = updateComponent<null, InternalInitialState>({
      state,
      entity: entity1,
      name: 'test',
      update: () => null,
      // callSystemUpdateMethod: false,
    })

    // Update should not trigger create
    expect(create).toHaveBeenCalledTimes(3)
  })

  it('updateComponent should set component and trigger update method', () => {
    const entity = generateEntity()

    const update = vi.fn(({ state }) => state)

    type SomeComponent = { value: 1 }
    const name = 'test'

    let state = createEntity({
      entity,
      state: getState(),
    })

    state = createSystem({
      state,
      name,
      componentName: name,
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

    expect(getComponent<SomeComponent>({ state, entity, name })?.value).toBe(1)

    state = updateComponent({
      state,
      entity,
      name,
      update: () => ({}),
    })

    expect(getComponent<SomeComponent>({ state, entity, name })?.value).toBe(1)

    state = updateComponent({
      state,
      entity,
      name,
      update: () => ({ value: 2 }),
    })

    expect(getComponent<SomeComponent>({ state, entity, name })?.value).toBe(2)
  })

  it.todo('getComponentsByName')
})
