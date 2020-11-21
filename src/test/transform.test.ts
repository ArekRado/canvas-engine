import 'regenerator-runtime/runtime'
import { vector } from '@arekrado/vector-2d'
import { transform } from '../component/transform'
import { initialState } from '../util/initialState'
import { set as setEntity, generate } from '../util/entity'
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
        localPosition: vector(-10, -10),
        parent: entity2,
      }),
    })

    const v6 = transform.set({
      state: v5,
      data: defaultTransform({
        entity: entity2,
        localPosition: vector(1, 1),
        parent: entity1,
      }),
    })

    const v7 = transform.set({
      state: v6,
      data: defaultTransform({
        entity: entity4,
        localPosition: vector(10, 10),
        parent: entity2,
      }),
    })

    const v8 = transform.set({
      state: v7,
      data: defaultTransform({
        entity: entity1,
        localPosition: vector(1, 1),
      }),
    })

    const state = runOneFrame({ state: v8, timeNow: 0 })

    const e1 = transform.get({ state, entity: entity1 })
    if (e1) {
      expect(e1.position).toEqual(vector(0, 0))
      // Should not change localPosition when transform doesn't have parent
      expect(e1.localPosition).toEqual(vector(1, 1))
    }
    const e2 = transform.get({ state, entity: entity2 })
    if (e2) {
      expect(e2.position).toEqual(vector(2, 2))
      expect(e2.localPosition).toEqual(vector(1, 1))
    }
    const e3 = transform.get({ state, entity: entity3 })
    if (e3) {
      expect(e3.position).toEqual(vector(-8, -8))
      expect(e3.localPosition).toEqual(vector(-10, -10))
    }
    const e4 = transform.get({ state, entity: entity4 })
    if (e4) {
      expect(e4.position).toEqual(vector(12, 12))
      expect(e4.localPosition).toEqual(vector(10, 10))
    }
  })
})
