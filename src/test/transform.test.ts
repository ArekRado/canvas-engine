import 'regenerator-runtime/runtime'
import { vector } from '@arekrado/vector-2d'
import { initialStateWithDisabledDraw } from '../util/state'
import { setEntity, generateEntity, getEntity as getEntity } from '../util/entity'
import { runOneFrame } from '../util/runOneFrame'

describe('transform', () => {
  it('should set proper position using fromParentPosition and parent.position - simple example', () => {
    const entity1 = generateEntity('e1', {
      position: vector(1, 1),
    })
    const entity2 = generateEntity('e2', {
      fromParentPosition: vector(2, 2),
      parentId: entity1.id,
    })

    const v1 = setEntity({
      entity: entity1,
      state: initialStateWithDisabledDraw,
    })
    const v2 = setEntity({ entity: entity2, state: v1 })

    const state = runOneFrame({ state: v2, timeNow: 0 })

    const e1 = getEntity({
      state,
      entityId: entity1.id,
    })

    const e2 = getEntity({
      state,
      entityId: entity2.id,
    })

    expect(e1?.position).toEqual(vector(1, 1))
    expect(e1?.fromParentPosition).toEqual(vector(0, 0))

    expect(e2?.position).toEqual(vector(3, 3))
    expect(e2?.fromParentPosition).toEqual(vector(2, 2))
  })

  it('should set proper position using fromParentPosition and parent.position', () => {
    const entity1 = generateEntity('e1', {
      position: vector(1, 1),
    })
    const entity2 = generateEntity('e2', {
      fromParentPosition: vector(1, 1),
      parentId: entity1.id,
    })
    const entity3 = generateEntity('e3', {
      fromParentPosition: vector(-10, -10),
      parentId: entity2.id,
    })
    const entity4 = generateEntity('e4', {
      fromParentPosition: vector(10, 10),
      parentId: entity2.id,
    })

    const v1 = setEntity({
      entity: entity1,
      state: initialStateWithDisabledDraw,
    })
    const v2 = setEntity({ entity: entity2, state: v1 })
    const v3 = setEntity({ entity: entity3, state: v2 })
    const v4 = setEntity({ entity: entity4, state: v3 })

    const state = runOneFrame({ state: v4, timeNow: 0 })

    const e1 = getEntity({ state, entityId: entity1.id })

    expect(e1?.position).toEqual(vector(1, 1))
    // Should not change fromParentPosition when transform doesn't have parent
    expect(e1?.fromParentPosition).toEqual(vector(0, 0))

    const e2 = getEntity({ state, entityId: entity2.id })

    expect(e2?.position).toEqual(vector(2, 2))
    expect(e2?.fromParentPosition).toEqual(vector(1, 1))

    const e3 = getEntity({ state, entityId: entity3.id })

    expect(e3?.position).toEqual(vector(-8, -8))
    expect(e3?.fromParentPosition).toEqual(vector(-10, -10))

    const e4 = getEntity({ state, entityId: entity4.id })

    expect(e4?.position).toEqual(vector(12, 12))
    expect(e4?.fromParentPosition).toEqual(vector(10, 10))
  })
})
