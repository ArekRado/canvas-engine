import 'regenerator-runtime/runtime'
import { vector } from '@arekrado/vector-2d'
import { getInitialState } from '../util/state'
import { setEntity, createEntity, getEntity } from '../entity'
import { runOneFrame } from '../util/runOneFrame'
import { componentName, getComponent, setComponent, Transform } from '..'
import { transform } from '../util/defaultComponents'

describe('transform', () => {
  it('should set proper position using fromParentPosition and parent.position - simple example', () => {
    const entity1 = createEntity({ name: 'e1' })
    const entity2 = createEntity({ name: 'e2' })

    let state = setComponent<Transform>({
      state: getInitialState({}),
      data: transform({
        entity: entity1,
        position: vector(1, 1),
      }),
    })

    state = setComponent<Transform>({
      state,
      data: transform({
        entity: entity2,
        fromParentPosition: vector(2, 2),
        parentId: entity1,
      }),
    })

    state = setEntity({ entity: entity1, state })
    state = setEntity({ entity: entity2, state })

    state = runOneFrame({ state, timeNow: 0 })

    const t1 = getComponent<Transform>({
      state,
      entity: entity1,
      name: componentName.transform,
    })

    const t2 = getComponent<Transform>({
      state,
      entity: entity2,
      name: componentName.transform,
    })

    expect(t1?.position).toEqual(vector(1, 1))
    expect(t1?.fromParentPosition).toEqual(vector(0, 0))

    expect(t2?.position).toEqual(vector(3, 3))
    expect(t2?.fromParentPosition).toEqual(vector(2, 2))
  })

  it('should set proper position using fromParentPosition and parent.position', () => {
    const entity1 = createEntity({ name: 'e1' })
    const entity2 = createEntity({ name: 'e2' })
    const entity3 = createEntity({ name: 'e3' })
    const entity4 = createEntity({ name: 'e4' })

    let state = setComponent<Transform>({
      state: getInitialState({}),
      data: transform({
        entity: entity1,
        position: vector(1, 1),
      }),
    })

    state = setComponent<Transform>({
      state,
      data: transform({
        entity: entity2,
        fromParentPosition: vector(1, 1),
        parentId: entity1,
      }),
    })

    state = setComponent<Transform>({
      state,
      data: transform({
        entity: entity3,
        fromParentPosition: vector(-10, -10),
        parentId: entity2,
      }),
    })
    state = setComponent<Transform>({
      state,
      data: transform({
        entity: entity4,
        fromParentPosition: vector(10, 10),
        parentId: entity2,
      }),
    })

    state = setEntity({ entity: entity1, state })
    state = setEntity({ entity: entity2, state })
    state = setEntity({ entity: entity3, state })
    state = setEntity({ entity: entity4, state })

    state = runOneFrame({ state, timeNow: 0 })

    const t1 = getComponent<Transform>({
      name: componentName.transform,
      state,
      entity: entity1,
    })

    expect(t1?.position).toEqual(vector(1, 1))
    // Should not change fromParentPosition when transform doesn't have parent
    expect(t1?.fromParentPosition).toEqual(vector(0, 0))

    const t2 = getComponent<Transform>({
      name: componentName.transform,
      state,
      entity: entity2,
    })

    expect(t2?.position).toEqual(vector(2, 2))
    expect(t2?.fromParentPosition).toEqual(vector(1, 1))

    const t3 = getComponent<Transform>({
      name: componentName.transform,
      state,
      entity: entity3,
    })

    expect(t3?.position).toEqual(vector(-8, -8))
    expect(t3?.fromParentPosition).toEqual(vector(-10, -10))

    const t4 = getComponent<Transform>({
      name: componentName.transform,
      state,
      entity: entity4,
    })

    expect(t4?.position).toEqual(vector(12, 12))
    expect(t4?.fromParentPosition).toEqual(vector(10, 10))
  })

  it('Nested entities should has equal position after one frame', () => {
    const entity1 = createEntity({ name: 'e1' })
    const entity2 = createEntity({ name: 'e2' })
    const entity3 = createEntity({ name: 'e3' })
    const entity4 = createEntity({ name: 'e4' })
    const entity5 = createEntity({ name: 'e5' })
    const entity6 = createEntity({ name: 'e6' })
    const entity7 = createEntity({ name: 'e7' })
    const entity8 = createEntity({ name: 'e8' })

    let state = setEntity({
      entity: entity1,
      state: getInitialState({}),
    })
    state = setEntity({ entity: entity2, state })
    state = setEntity({ entity: entity3, state })
    state = setEntity({ entity: entity4, state })
    state = setEntity({ entity: entity5, state })
    state = setEntity({ entity: entity6, state })
    state = setEntity({ entity: entity7, state })
    state = setEntity({ entity: entity8, state })

    state = setComponent<Transform>({
      state,
      data: transform({ entity: entity1, position: vector(1, 1) }),
    })
    state = setComponent<Transform>({
      state,
      data: transform({ entity: entity2, parentId: entity1 }),
    })
    state = setComponent<Transform>({
      state,
      data: transform({ entity: entity3, parentId: entity2 }),
    })
    state = setComponent<Transform>({
      state,
      data: transform({ entity: entity4, parentId: entity3 }),
    })
    state = setComponent<Transform>({
      state,
      data: transform({ entity: entity5, parentId: entity4 }),
    })
    state = setComponent<Transform>({
      state,
      data: transform({ entity: entity6, parentId: entity5 }),
    })
    state = setComponent<Transform>({
      state,
      data: transform({ entity: entity7, parentId: entity6 }),
    })
    state = setComponent<Transform>({
      state,
      data: transform({ entity: entity8, parentId: entity7 }),
    })

    state = runOneFrame({ state, timeNow: 0 })

    const e1 = getComponent<Transform>({
      state,
      entity: entity1,
      name: componentName.transform,
    })
    const e8 = getComponent<Transform>({
      state,
      entity: entity8,
      name: componentName.transform,
    })

    expect(e1?.position).toEqual(e8?.position)
  })
})
