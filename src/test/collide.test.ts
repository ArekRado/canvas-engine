import 'regenerator-runtime/runtime'
import { vector } from '@arekrado/vector-2d'
import { initialStateWithDisabledDraw } from '../util/state'
import { setEntity, createEntity } from '../entity'
import { runOneFrame } from '../util/runOneFrame'
import { collideBox as defaultCollideBox } from '../util/defaultComponents'
import { getComponent, setComponent } from '../component'
import { CollideBox } from '../type'
import { componentName } from '../component'

describe('collide', () => {
  it('detect collisions box-box', () => {
    const entity1 = createEntity('e1', {
      fromParentPosition: vector(0, 0),
    })
    const entity2 = createEntity('e2', {
      fromParentPosition: vector(1, 1),
    })
    const entity3 = createEntity('e3', {
      fromParentPosition: vector(3.5, 3.5),
    })

    const v1 = setEntity({
      entity: entity1,
      state: initialStateWithDisabledDraw,
    })
    const v2 = setEntity({ entity: entity2, state: v1 })
    const v3 = setEntity({ entity: entity3, state: v2 })

    const v4 = setComponent<CollideBox>(componentName.collideBox, {
      state: v3,
      data: defaultCollideBox({
        entityId: entity1.id,
        size: vector(1.5, 1.5),
        position: vector(1, 1),
      }),
    })

    const v5 = setComponent<CollideBox>(componentName.collideBox, {
      state: v4,
      data: defaultCollideBox({
        entityId: entity2.id,
        size: vector(1, 1),
        position: vector(0, 0),
      }),
    })

    const v6 = setComponent<CollideBox>(componentName.collideBox, {
      state: v5,
      data: defaultCollideBox({
        entityId: entity3.id,
        size: vector(1, 1),
        position: vector(-1, -1),
      }),
    })

    const state = runOneFrame({ state: v6, timeNow: 0 })

    const collisions1 =
      getComponent<CollideBox>(componentName.collideBox, {
        state,
        entityId: entity1.id,
      })?.collisions || []

    const collisions2 =
      getComponent<CollideBox>(componentName.collideBox, {
        state,
        entityId: entity2.id,
      })?.collisions || []

    const collisions3 =
      getComponent<CollideBox>(componentName.collideBox, {
        state,
        entityId: entity3.id,
      })?.collisions || []

    expect(collisions1[0].entityId).toEqual(entity2.id)
    expect(collisions1[1]).not.toBeDefined()

    expect(collisions2[0].entityId).toEqual(entity1.id)
    expect(collisions2[1].entityId).toEqual(entity3.id)

    expect(collisions3[0].entityId).toEqual(entity2.id)
    expect(collisions3[1]).not.toBeDefined()
  })
})
