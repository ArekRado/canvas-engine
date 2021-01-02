import 'regenerator-runtime/runtime'
import { vector } from '@arekrado/vector-2d'
import { initialStateWithDisabledDraw } from '../util/state'
import { set as setEntity, generate } from '../util/entity'
import { runOneFrame } from '../util/runOneFrame'
import { defaultCollideBox, defaultTransform } from '../util/defaultComponents'
import { getComponent, setComponent } from '../component'
import { CollideBox, Transform } from '../type'
import { componentName } from '../component'

describe('collide', () => {
  it('detect collisions box-box', () => {
    const entity1 = generate('e1', {
      fromParentPosition: vector(0, 0),
    })
    const entity2 = generate('e2', {
      fromParentPosition: vector(1, 1),
    })
    const entity3 = generate('e3', {
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
        entity: entity1,
        size: vector(1.5, 1.5),
        position: vector(1, 1),
      }),
    })

    const v5 = setComponent<CollideBox>(componentName.collideBox, {
      state: v4,
      data: defaultCollideBox({
        entity: entity2,
        size: vector(1, 1),
        position: vector(0, 0),
      }),
    })

    const v6 = setComponent<CollideBox>(componentName.collideBox, {
      state: v5,
      data: defaultCollideBox({
        entity: entity3,
        size: vector(1, 1),
        position: vector(-1, -1),
      }),
    })

    const state = runOneFrame({ state: v6, timeNow: 0 })

    const collisions1 =
      getComponent<CollideBox>(componentName.collideBox, {
        state,
        entity: entity1,
      })?.collisions || []

    const collisions2 =
      getComponent<CollideBox>(componentName.collideBox, {
        state,
        entity: entity2,
      })?.collisions || []

    const collisions3 =
      getComponent<CollideBox>(componentName.collideBox, {
        state,
        entity: entity3,
      })?.collisions || []

    expect(collisions1[0].entity).toEqual(entity2)
    expect(collisions1[1]).not.toBeDefined()

    expect(collisions2[0].entity).toEqual(entity1)
    expect(collisions2[1].entity).toEqual(entity3)

    expect(collisions3[0].entity).toEqual(entity2)
    expect(collisions3[1]).not.toBeDefined()
  })
})
