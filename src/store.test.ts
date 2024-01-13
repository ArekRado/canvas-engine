import { describe, it, expect } from 'vitest'
import { createStore } from './store'
import { generateEntity } from './entity/generateEntity'

describe('store', () => {
  it('getState should return proper state', () => {
    const store = createStore({
      testComponent: new Map(),
    })

    expect(store.getState().component.testComponent).toEqual(new Map())

    const entity = generateEntity()
    store.createEntity(entity)
    store.createComponent('testComponent', entity, {})

    expect(store.getState().component.testComponent).toEqual(
      new Map([[entity, {}]]),
    )

    store.removeComponent('testComponent', entity)
    expect(store.getState().component.testComponent).toEqual(new Map())

    const entity2 = generateEntity()
    store.createEntity(entity2)
    store.createComponent('testComponent', entity2, {})

    expect(store.getState().component.testComponent).toEqual(
      new Map([[entity2, {}]]),
    )

    store.removeEntity(entity2)
    expect(store.getState().component.testComponent).toEqual(new Map())
  })
})
