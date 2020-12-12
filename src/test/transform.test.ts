import 'regenerator-runtime/runtime'
import { vector } from '@arekrado/vector-2d'
import { initialStateWithDisabledDraw } from '../util/state'
import { set as setEntity, generate } from '../util/entity'
import { runOneFrame } from '../util/runOneFrame'
import { defaultTransform } from '../util/defaultComponents'
import { getComponent, setComponent } from '../component'
import { Transform } from '../type'
import { componentName } from '../component'

describe('transform', () => {
  it('should set proper position using fromParentPosition and parent.position - simple example', () => {
    const entity1 = generate('e1')
    const entity2 = generate('e2')

    const v1 = setEntity({
      entity: entity1,
      state: initialStateWithDisabledDraw,
    })
    const v2 = setEntity({ entity: entity2, state: v1 })

    const v3 = setComponent(componentName.transform, {
      state: v2,
      data: defaultTransform({
        entity: entity1,
        position: vector(1, 1),
      }),
    })

    const v4 = setComponent(componentName.transform, {
      state: v3,
      data: defaultTransform({
        entity: entity2,
        fromParentPosition: vector(2, 2),
        parent: entity1,
      }),
    })

    const state = runOneFrame({ state: v4, timeNow: 0 })

    const e1 = getComponent<Transform>(componentName.transform, {
      state,
      entity: entity1,
    })

    const e2 = getComponent<Transform>(componentName.transform, {
      state,
      entity: entity2,
    })

    expect(e1?.position).toEqual(vector(1, 1))
    expect(e1?.fromParentPosition).toEqual(vector(0, 0))

    expect(e2?.position).toEqual(vector(3, 3))
    expect(e2?.fromParentPosition).toEqual(vector(2, 2))
  })

  it('should set proper position using fromParentPosition and parent.position', () => {
    const entity1 = generate('e1')
    const entity2 = generate('e2')
    const entity3 = generate('e3')
    const entity4 = generate('e4')

    const v1 = setEntity({
      entity: entity1,
      state: initialStateWithDisabledDraw,
    })
    const v2 = setEntity({ entity: entity2, state: v1 })
    const v3 = setEntity({ entity: entity3, state: v2 })
    const v4 = setEntity({ entity: entity4, state: v3 })

    const v5 = setComponent(componentName.transform, {
      state: v4,
      data: defaultTransform({
        entity: entity3,
        fromParentPosition: vector(-10, -10),
        parent: entity2,
      }),
    })

    const v6 = setComponent(componentName.transform, {
      state: v5,
      data: defaultTransform({
        entity: entity2,
        fromParentPosition: vector(1, 1),
        parent: entity1,
      }),
    })

    const v7 = setComponent(componentName.transform, {
      state: v6,
      data: defaultTransform({
        entity: entity4,
        fromParentPosition: vector(10, 10),
        parent: entity2,
      }),
    })

    const v8 = setComponent(componentName.transform, {
      state: v7,
      data: defaultTransform({
        entity: entity1,
        position: vector(1, 1),
      }),
    })

    const state = runOneFrame({ state: v8, timeNow: 0 })

    const e1 = getComponent<Transform>(componentName.transform, {
      state,
      entity: entity1,
    })

    expect(e1?.position).toEqual(vector(1, 1))
    // Should not change fromParentPosition when transform doesn't have parent
    expect(e1?.fromParentPosition).toEqual(vector(0, 0))

    const e2 = getComponent<Transform>(componentName.transform, {
      state,
      entity: entity2,
    })

    expect(e2?.position).toEqual(vector(2, 2))
    expect(e2?.fromParentPosition).toEqual(vector(1, 1))

    const e3 = getComponent<Transform>(componentName.transform, {
      state,
      entity: entity3,
    })

    expect(e3?.position).toEqual(vector(-8, -8))
    expect(e3?.fromParentPosition).toEqual(vector(-10, -10))

    const e4 = getComponent<Transform>(componentName.transform, {
      state,
      entity: entity4,
    })

    expect(e4?.position).toEqual(vector(12, 12))
    expect(e4?.fromParentPosition).toEqual(vector(10, 10))
  })
})
