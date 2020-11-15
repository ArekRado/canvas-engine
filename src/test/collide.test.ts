import 'regenerator-runtime/runtime'
import { vector } from '@arekrado/vector-2d'
import { collideBox, transform } from 'component'
import { initialState } from 'main'
import { set as setEntity, generate } from 'util/entity'
import { runOneFrame } from 'util/runOneFrame'
import { defaultCollideBox, defaultTransform } from '../util/defaultComponents'
import { detectAABBcollision } from 'system/collide'

describe('collide', () => {
  it('detectAABBcollision', () => {
    expect(
      detectAABBcollision({
        v1: vector(0, 0),
        size1: vector(1, 1),
        v2: vector(0.5, 0.5),
        size2: vector(1, 1),
      }),
    ).toBeTruthy()

    expect(
      detectAABBcollision({
        v1: vector(0, 0),
        size1: vector(1, 1),
        v2: vector(1, 1),
        size2: vector(1, 1),
      }),
    ).toBeFalsy()

    expect(
      detectAABBcollision({
        v1: vector(0, 0),
        size1: vector(1, 1),
        v2: vector(-10, -10),
        size2: vector(20, 20),
      }),
    ).toBeTruthy()
  })

  it('detect collisions box-box', () => {
    const entity1 = generate('e1')
    const entity2 = generate('e2')
    const entity3 = generate('e3')

    const v1 = setEntity({ entity: entity1, state: initialState })
    const v2 = setEntity({ entity: entity2, state: v1 })
    const v3 = setEntity({ entity: entity3, state: v2 })

    const v4 = transform.set({
      state: v3,
      data: defaultTransform({
        entity: entity1,
        data: { localPosition: vector(0, 0) },
      }),
    })

    const v5 = transform.set({
      state: v4,
      data: defaultTransform({
        entity: entity2,
        data: { localPosition: vector(1, 1) },
      }),
    })

    const v6 = transform.set({
      state: v5,
      data: defaultTransform({
        entity: entity3,
        data: { localPosition: vector(3.5, 3.5) },
      }),
    })

    const v7 = collideBox.set({
      state: v6,
      data: defaultCollideBox({
        entity: entity1,
        data: {
          size: vector(1.5, 1.5),
          position: vector(0, 0),
        },
      }),
    })

    const v8 = collideBox.set({
      state: v7,
      data: defaultCollideBox({
        entity: entity2,
        data: {
          size: vector(1, 1),
          position: vector(0, 0),
        },
      }),
    })

    const v9 = collideBox.set({
      state: v8,
      data: defaultCollideBox({
        entity: entity3,
        data: {
          size: vector(1, 1),
          position: vector(-2, -2),
        },
      }),
    })

    const state = runOneFrame({ state: v9, enableDraw: false, timeNow: 0 })

    const collisions1 =
      collideBox.get({
        state,
        entity: entity1,
      })?.data.collisions || []

    const collisions2 =
      collideBox.get({
        state,
        entity: entity2,
      })?.data.collisions || []

    const collisions3 =
      collideBox.get({
        state,
        entity: entity3,
      })?.data.collisions || []

    expect(collisions1[0].entity).toEqual(entity2)
    expect(collisions1[1]).not.toBeDefined()

    expect(collisions2[0].entity).toEqual(entity1)
    expect(collisions2[1].entity).toEqual(entity3)

    expect(collisions3[0].entity).toEqual(entity2)
    expect(collisions3[1]).not.toBeDefined()
  })
})
