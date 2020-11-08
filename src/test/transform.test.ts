import 'regenerator-runtime/runtime'
import { vector } from '@arekrado/vector-2d'
import { transform } from 'component'
import { initialState } from 'main'
import { set as setEntity, generate } from 'util/entity'
import { runOneFrame } from '../util/runOneFrame'
import { defaultTransform } from '../util/defaultComponents'

describe('transform', () => {
  it('should set proper position using localPosition and parent.position', () => {
    const entity1 = generate('e1')
    const entity2 = generate('e2')
    const entity3 = generate('e3')
    const entity4 = generate('e4')

    const v1 = setEntity({ entity: entity1, state: initialState })
    const v2 = setEntity({ entity: entity2, state: v1 })
    const v3 = setEntity({ entity: entity3, state: v2 })
    const v4 = setEntity({ entity: entity4, state: v3 })

    const v5 = transform.set({
      state: v4,
      data: defaultTransform({
        entity: entity3,
        name: 'entity3',
        data: {
          localPosition: vector(-10, -10),
          parent: entity2,
        },
      }),
    })

    const v6 = transform.set({
      state: v5,
      data: defaultTransform({
        entity: entity2,
        name: 'entity2',
        data: {
          localPosition: vector(1, 1),
          parent: entity1,
        },
      }),
    })

    const v7 = transform.set({
      state: v6,
      data: defaultTransform({
        entity: entity4,
        name: 'entity4',
        data: {
          localPosition: vector(10, 10),
          parent: entity2,
        },
      }),
    })

    const v8 = transform.set({
      state: v7,
      data: defaultTransform({
        entity: entity1,
        name: 'entity1',
        data: {
          localPosition: vector(1, 1),
        },
      }),
    })

    const state = runOneFrame({ state: v8, enableDraw: false, timeNow: 0 })

    expect(
      transform.get({ state, entity: entity1, name: 'entity1' })?.data.position,
    ).toEqual(vector(1, 1))

    expect(
      transform.get({ state, entity: entity2, name: 'entity2' })?.data.position,
    ).toEqual(vector(2, 2))

    expect(
      transform.get({ state, entity: entity3, name: 'entity3' })?.data.position,
    ).toEqual(vector(-8, -8))

    expect(
      transform.get({ state, entity: entity4, name: 'entity4' })?.data.position,
    ).toEqual(vector(12, 12))
  })
})
