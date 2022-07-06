import { getState } from '../../util/state'
import { createEntity } from '../../entity/createEntity'
import { generateEntity } from '../../entity/generateEntity'
import { runOneFrame } from '../../util/runOneFrame'
import { defaultTransform } from '../../util/defaultComponents'
import { createTransform } from './transformCrud'
import {
  getDeepTransformChildren,
  getShallowTransformChildren,
} from './getTransformChildren'

describe('getShallowTransformChildren', () => {
  it('should return all transform children', () => {
    const entity1 = generateEntity()
    const entity2 = generateEntity()
    const entity3 = generateEntity()
    const entity4 = generateEntity()
    const entity5 = generateEntity()

    let state = getState({})
    state = createEntity({ entity: entity1, state })
    state = createEntity({ entity: entity2, state })
    state = createEntity({ entity: entity3, state })
    state = createEntity({ entity: entity4, state })
    state = createEntity({ entity: entity5, state })

    state = createTransform({
      state,
      entity: entity1,
      data: defaultTransform({}),
    })
    state = createTransform({
      state,
      entity: entity2,
      data: defaultTransform({ parentId: entity1 }),
    })
    state = createTransform({
      state,
      entity: entity3,
      data: defaultTransform({ parentId: entity2 }),
    })
    state = createTransform({
      state,
      entity: entity4,
      data: defaultTransform({ parentId: entity3 }),
    })
    state = createTransform({
      state,
      entity: entity5,
      data: defaultTransform({ parentId: entity2 }),
    })

    state = runOneFrame({ state })

    expect(getShallowTransformChildren({ state, entity: entity1 })).toEqual([
      { entity: entity2, transform: defaultTransform({ parentId: entity1 }) },
    ])
    expect(getShallowTransformChildren({ state, entity: entity2 })).toEqual([
      { entity: entity3, transform: defaultTransform({ parentId: entity2 }) },
      { entity: entity5, transform: defaultTransform({ parentId: entity2 }) },
    ])

    expect(
      getShallowTransformChildren({ state: getState({}), entity: entity1 }),
    ).toEqual([])
  })
})

describe('getDeepTransformChildren', () => {
  it('should return all transform children and their chilren', () => {
    const entity1 = generateEntity()
    const entity2 = generateEntity()
    const entity3 = generateEntity()
    const entity4 = generateEntity()
    const entity5 = generateEntity()

    let state = getState({})
    state = createEntity({ entity: entity1, state })
    state = createEntity({ entity: entity2, state })
    state = createEntity({ entity: entity3, state })
    state = createEntity({ entity: entity4, state })
    state = createEntity({ entity: entity5, state })

    state = createTransform({
      state,
      entity: entity1,
      data: defaultTransform({}),
    })
    state = createTransform({
      state,
      entity: entity2,
      data: defaultTransform({ parentId: entity1 }),
    })
    state = createTransform({
      state,
      entity: entity3,
      data: defaultTransform({ parentId: entity2 }),
    })
    state = createTransform({
      state,
      entity: entity4,
      data: defaultTransform({ parentId: entity3 }),
    })
    state = createTransform({
      state,
      entity: entity5,
      data: defaultTransform({ parentId: entity2 }),
    })

    expect(getDeepTransformChildren({ state, entity: entity1 })).toEqual([
      { entity: entity2, transform: defaultTransform({ parentId: entity1 }) },
      { entity: entity3, transform: defaultTransform({ parentId: entity2 }) },
      { entity: entity4, transform: defaultTransform({ parentId: entity3 }) },
      { entity: entity5, transform: defaultTransform({ parentId: entity2 }) },
    ])
    expect(getDeepTransformChildren({ state, entity: entity2 })).toEqual([
      { entity: entity3, transform: defaultTransform({ parentId: entity2 }) },
      { entity: entity4, transform: defaultTransform({ parentId: entity3 }) },
      { entity: entity5, transform: defaultTransform({ parentId: entity2 }) },
    ])

    expect(
      getDeepTransformChildren({ state: getState({}), entity: entity1 }),
    ).toEqual([])
  })
})
