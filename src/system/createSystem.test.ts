import { getEmptyState } from '../util/state'
import { createGlobalSystem } from './createSystem'
import { runOneFrame } from '../util/runOneFrame'
import { describe, it, expect, vi } from 'vitest'
import { createStore } from '../store'
import { generateEntity } from '../entity/generateEntity'

describe('createGlobalSystem', () => {
  it('should not call create method when system is creating', () => {
    const remove = vi.fn(({ state }) => state)
    const tick = vi.fn(({ state }) => state)

    createGlobalSystem({
      state: getEmptyState(),
      name: 'test',
      tick,
    })

    expect(remove).not.toHaveBeenCalled()
    expect(tick).not.toHaveBeenCalled()
  })

  it('should trigger tick after runOneFrame', () => {
    const tick = vi.fn(({ state }) => state)

    const state = createGlobalSystem({
      state: getEmptyState(),
      name: 'test',
      tick,
    })

    runOneFrame({ state })

    expect(tick).toHaveBeenCalled()
  })
})

describe('createSystem', () => {
  it('should call lifecycle methods', () => {
    const create = vi.fn(({ state }) => state)
    const remove = vi.fn(({ state }) => state)
    const tick = vi.fn(({ state }) => state)

    const componentName = 'testComponent'

    const store = createStore({
      [componentName]: new Map(),
    })

    store.createSystem({
      componentName: componentName,
      name: componentName,
      create,
      tick,
      remove,
    })

    expect(create).toHaveBeenCalledTimes(0)
    expect(remove).toHaveBeenCalledTimes(0)
    expect(tick).toHaveBeenCalledTimes(0)

    const entity = generateEntity()
    store.createEntity(entity)

    store.createComponent(componentName, entity, { age: 1, name: 'yes' })

    expect(create).toHaveBeenCalledTimes(1)
    expect(remove).toHaveBeenCalledTimes(0)
    expect(tick).toHaveBeenCalledTimes(0)

    runOneFrame({ state: store.getState() })

    expect(create).toHaveBeenCalledTimes(1)
    expect(remove).toHaveBeenCalledTimes(0)
    expect(tick).toHaveBeenCalledTimes(1)

    store.removeComponent(componentName, entity)

    expect(create).toHaveBeenCalledTimes(1)
    expect(remove).toHaveBeenCalledTimes(1)
    expect(tick).toHaveBeenCalledTimes(1)
  })

  it.todo('test priority')
})
