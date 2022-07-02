import { vector } from '@arekrado/vector-2d'
import { getState } from '../../util/state'
import { createEntity } from '../../entity/createEntity'
import { generateEntity } from '../../entity/generateEntity'
import { runOneFrame } from '../../util/runOneFrame'
import { defaultTransform } from '../../util/defaultComponents'
import { createTransform, getTransform } from './transformCrud'

describe('transform', () => {
  it('should set proper position using fromParentPosition and parent.position - simple example', () => {
    const entity1 = generateEntity()
    const entity2 = generateEntity()

    let state = createTransform({
      state: getState({}),
      entity: entity1,
      data: defaultTransform({
        position: vector(1, 1),
      }),
    })

    state = createTransform({
      state,
      entity: entity2,
      data: defaultTransform({
        fromParentPosition: vector(2, 2),
        parentId: entity1,
      }),
    })

    state = createEntity({ entity: entity1, state })
    state = createEntity({ entity: entity2, state })

    state = runOneFrame({ state })

    const t1 = getTransform({
      state,
      entity: entity1,
    })

    const t2 = getTransform({
      state,
      entity: entity2,
    })

    expect(t1?.position).toEqual(vector(1, 1))
    expect(t1?.fromParentPosition).toEqual(vector(0, 0))

    expect(t2?.position).toEqual(vector(3, 3))
    expect(t2?.fromParentPosition).toEqual(vector(2, 2))
  })

  it('should set proper position using fromParentPosition and parent.position', () => {
    const entity1 = generateEntity()
    const entity2 = generateEntity()
    const entity3 = generateEntity()
    const entity4 = generateEntity()

    let state = createTransform({
      state: getState({}),
      entity: entity1,
      data: defaultTransform({
        position: vector(1, 1),
      }),
    })

    state = createTransform({
      state,
      entity: entity2,
      data: defaultTransform({
        fromParentPosition: vector(1, 1),
        parentId: entity1,
      }),
    })

    state = createTransform({
      state,
      entity: entity3,
      data: defaultTransform({
        fromParentPosition: vector(-10, -10),
        parentId: entity2,
      }),
    })
    state = createTransform({
      state,
      entity: entity4,
      data: defaultTransform({
        fromParentPosition: vector(10, 10),
        parentId: entity2,
      }),
    })

    state = createEntity({ entity: entity1, state })
    state = createEntity({ entity: entity2, state })
    state = createEntity({ entity: entity3, state })
    state = createEntity({ entity: entity4, state })

    state = runOneFrame({ state })

    const t1 = getTransform({
      state,
      entity: entity1,
    })

    expect(t1?.position).toEqual(vector(1, 1))
    // Should not change fromParentPosition when transform doesn't have parent
    expect(t1?.fromParentPosition).toEqual(vector(0, 0))

    const t2 = getTransform({
      state,
      entity: entity2,
    })

    expect(t2?.position).toEqual(vector(2, 2))
    expect(t2?.fromParentPosition).toEqual(vector(1, 1))

    const t3 = getTransform({
      state,
      entity: entity3,
    })

    expect(t3?.position).toEqual(vector(-8, -8))
    expect(t3?.fromParentPosition).toEqual(vector(-10, -10))

    const t4 = getTransform({
      state,
      entity: entity4,
    })

    expect(t4?.position).toEqual(vector(12, 12))
    expect(t4?.fromParentPosition).toEqual(vector(10, 10))
  })

  it('Nested entities should has equal position after one frame', () => {
    const entity1 = generateEntity()
    const entity2 = generateEntity()
    const entity3 = generateEntity()
    const entity4 = generateEntity()
    const entity5 = generateEntity()
    const entity6 = generateEntity()
    const entity7 = generateEntity()
    const entity8 = generateEntity()

    let state = createEntity({
      entity: entity1,
      state: getState({}),
    })
    state = createEntity({ entity: entity2, state })
    state = createEntity({ entity: entity3, state })
    state = createEntity({ entity: entity4, state })
    state = createEntity({ entity: entity5, state })
    state = createEntity({ entity: entity6, state })
    state = createEntity({ entity: entity7, state })
    state = createEntity({ entity: entity8, state })

    state = createTransform({
      state,
      entity: entity1,
      data: defaultTransform({ position: vector(1, 1) }),
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
      data: defaultTransform({ parentId: entity4 }),
    })
    state = createTransform({
      state,
      entity: entity6,
      data: defaultTransform({ parentId: entity5 }),
    })
    state = createTransform({
      state,
      entity: entity7,
      data: defaultTransform({ parentId: entity6 }),
    })
    state = createTransform({
      state,
      entity: entity8,
      data: defaultTransform({ parentId: entity7 }),
    })

    state = runOneFrame({ state })

    const e1 = getTransform({
      state,
      entity: entity1,
    })
    const e8 = getTransform({
      state,
      entity: entity8,
    })

    expect(e1?.position).toEqual(e8?.position)
  })
})
