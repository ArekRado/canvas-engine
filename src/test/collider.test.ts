import { vector, Vector2D } from '@arekrado/vector-2d'
import { createEntity } from '../entity/createEntity'
import { generateEntity } from '../entity/generateEntity'
import { runOneFrame } from '../util/runOneFrame'
import { defaultCollider, defaultTransform } from '../util/defaultComponents'
import { getState } from '../util/state'
import { createTransform } from '../system/transform/transformCrud'
import { createCollider, getCollider } from '../system/collider/colliderCrud'

describe('collider', () => {
  describe('detect collisions', () => {
    const layers = ['default']
    it('detect collisions rectangle-rectangle', () => {
      const entity1 = generateEntity()
      const entity2 = generateEntity()
      const entity3 = generateEntity()

      let state = createEntity({
        entity: entity1,
        state: getState({}),
      })
      state = createEntity({ entity: entity2, state })
      state = createEntity({ entity: entity3, state })

      state = createTransform({
        state,
        entity: entity1,
        data: defaultTransform({
          position: vector(0, 0),
        }),
      })
      state = createTransform({
        state,
        entity: entity2,
        data: defaultTransform({
          position: vector(1, 1),
        }),
      })
      state = createTransform({
        state,
        entity: entity3,
        data: defaultTransform({
          position: vector(3.5, 3.5),
        }),
      })

      state = createCollider({
        state,
        entity: entity1,
        data: defaultCollider({
          layers,
          data: [
            {
              type: 'rectangle',
              size: vector(1.5, 1.5),
              position: vector(1, 1),
            },
          ],
        }),
      })
      state = createCollider({
        state,
        entity: entity2,
        data: defaultCollider({
          layers,
          data: [
            { type: 'rectangle', size: vector(1, 1), position: vector(0, 0) },
          ],
        }),
      })
      state = createCollider({
        state,
        entity: entity3,

        data: defaultCollider({
          layers,
          data: [
            { type: 'rectangle', size: vector(1, 1), position: vector(-1, -1) },
          ],
        }),
      })

      state = runOneFrame({ state })

      const collisions1 = getCollider({
        state,
        entity: entity1,
      })?._collisions
      const collisions2 = getCollider({
        state,
        entity: entity2,
      })?._collisions
      const collisions3 = getCollider({
        state,
        entity: entity3,
      })?._collisions

      expect(collisions1?.length).toEqual(2)
      expect(collisions1?.[0]?.entity).toEqual(entity2)
      expect(collisions1?.[1]?.entity).toEqual(entity3)

      expect(collisions2?.length).toEqual(1)
      expect(collisions2?.[0]?.entity).toEqual(entity1)

      expect(collisions3?.length).toEqual(1)
      expect(collisions3?.[0]?.entity).toEqual(entity1)
    })

    it('detect collisions point-point', () => {
      const entity1 = generateEntity()
      const entity2 = generateEntity()
      const entity3 = generateEntity()

      let state = createEntity({
        entity: entity1,
        state: getState({}),
      })
      state = createEntity({ entity: entity2, state })

      state = createTransform({
        state,
        entity: entity1,
        data: defaultTransform({
          position: vector(0, 0),
        }),
      })
      state = createTransform({
        state,
        entity: entity2,
        data: defaultTransform({
          position: vector(10, 7),
        }),
      })
      state = createTransform({
        state,
        entity: entity3,
        data: defaultTransform({
          position: vector(0, 0),
        }),
      })

      state = createCollider({
        state,
        entity: entity1,

        data: defaultCollider({
          layers,
          data: [{ type: 'point', position: vector(1, 1) }],
        }),
      })
      state = createCollider({
        state,
        entity: entity2,

        data: defaultCollider({
          layers,
          data: [{ type: 'point', position: vector(-9, -6) }],
        }),
      })
      state = createCollider({
        state,
        entity: entity3,

        data: defaultCollider({
          layers,
          data: [{ type: 'point', position: vector(99, 99) }],
        }),
      })

      state = runOneFrame({ state })

      const collisions1 = getCollider({
        state,
        entity: entity1,
      })?._collisions
      const collisions2 = getCollider({
        state,
        entity: entity2,
      })?._collisions
      const collisions3 = getCollider({
        state,
        entity: entity3,
      })?._collisions

      expect(collisions1?.length).toBe(1)
      expect(collisions1?.length).toBe(1)

      expect(collisions1?.[0]?.entity).toEqual(entity2)
      expect(collisions2?.[0]?.entity).toEqual(entity1)

      expect(collisions3?.length).toBe(0)
    })

    it('detect collisions circle-circle', () => {
      const entity1 = generateEntity()
      const entity2 = generateEntity()
      const entity3 = generateEntity()
      const entity4 = generateEntity()

      let state = createEntity({
        entity: entity1,
        state: getState({}),
      })
      state = createEntity({ entity: entity2, state })
      state = createEntity({ entity: entity3, state })
      state = createEntity({ entity: entity4, state })

      state = createTransform({
        state,
        entity: entity1,
        data: defaultTransform({
          position: vector(0, 0),
        }),
      })
      state = createTransform({
        state,
        entity: entity2,
        data: defaultTransform({
          position: vector(1, 1),
        }),
      })
      state = createTransform({
        state,
        entity: entity3,
        data: defaultTransform({
          position: vector(3.5, 3.5),
        }),
      })
      state = createTransform({
        state,
        entity: entity4,
        data: defaultTransform({
          position: vector(99, 99),
        }),
      })

      state = createCollider({
        state,
        entity: entity1,

        data: defaultCollider({
          layers,
          data: [{ type: 'circle', radius: 1.5, position: vector(1, 1) }],
        }),
      })
      state = createCollider({
        state,
        entity: entity2,

        data: defaultCollider({
          layers,
          data: [{ type: 'circle', radius: 1, position: vector(0, 0) }],
        }),
      })
      state = createCollider({
        state,
        entity: entity3,

        data: defaultCollider({
          layers,
          data: [{ type: 'circle', radius: 1, position: vector(-1, -1) }],
        }),
      })
      state = createCollider({
        state,
        entity: entity4,

        data: defaultCollider({
          layers,
          data: [{ type: 'circle', radius: 1, position: vector(-1, -1) }],
        }),
      })

      state = runOneFrame({ state })

      const collisions1 = getCollider({
        state,
        entity: entity1,
      })?._collisions
      const collisions2 = getCollider({
        state,
        entity: entity2,
      })?._collisions
      const collisions3 = getCollider({
        state,
        entity: entity3,
      })?._collisions
      const collisions4 = getCollider({
        state,
        entity: entity4,
      })?._collisions

      expect(collisions1?.length).toEqual(2)
      expect(collisions1?.[0]?.entity).toEqual(entity2)
      expect(collisions1?.[1]?.entity).toEqual(entity3)

      expect(collisions2?.length).toEqual(1)
      expect(collisions2?.[0]?.entity).toEqual(entity1)

      expect(collisions3?.length).toEqual(1)
      expect(collisions3?.[0]?.entity).toEqual(entity1)

      expect(collisions4?.length).toEqual(0)
    })

    it('detect collisions circle-rectangle', () => {
      const entity1 = generateEntity()
      const entity2 = generateEntity()
      const entity3 = generateEntity()
      const entity4 = generateEntity()
      let state = getState({})

      state = createEntity({ entity: entity1, state })
      state = createEntity({ entity: entity2, state })
      state = createEntity({ entity: entity3, state })
      state = createEntity({ entity: entity4, state })

      state = createTransform({
        state,
        entity: entity1,
        data: defaultTransform({
          position: vector(0, 0),
        }),
      })
      state = createTransform({
        state,
        entity: entity2,
        data: defaultTransform({
          position: vector(0, 0),
        }),
      })
      state = createTransform({
        state,
        entity: entity3,

        data: defaultTransform({
          position: vector(0, 0),
        }),
      })
      state = createTransform({
        state,
        entity: entity4,

        data: defaultTransform({
          position: vector(99, 99),
        }),
      })

      state = createCollider({
        state,
        entity: entity1,

        data: defaultCollider({
          layers,
          data: [
            { type: 'rectangle', size: vector(5, 5), position: vector(0, 0) },
          ],
        }),
      })
      state = createCollider({
        state,
        entity: entity2,

        data: defaultCollider({
          layers,
          data: [{ type: 'circle', radius: 5, position: vector(5, 5) }],
        }),
      })
      state = createCollider({
        state,
        entity: entity3,

        data: defaultCollider({
          layers,
          data: [{ type: 'circle', radius: 7.2, position: vector(-5, -5) }],
        }),
      })
      state = createCollider({
        state,
        entity: entity4,

        data: defaultCollider({
          layers,
          data: [{ type: 'circle', radius: 7.2, position: vector(-5, -5) }],
        }),
      })

      state = runOneFrame({ state })

      const collisions1 = getCollider({
        state,
        entity: entity1,
      })?._collisions
      const collisions2 = getCollider({
        state,
        entity: entity2,
      })?._collisions
      const collisions3 = getCollider({
        state,
        entity: entity3,
      })?._collisions
      const collisions4 = getCollider({
        state,
        entity: entity4,
      })?._collisions

      expect(collisions1?.length).toEqual(1)
      expect(collisions1?.[0]?.entity).toEqual(entity3)
      expect(collisions1?.[1]?.entity).not.toBeDefined()

      expect(collisions2?.length).toEqual(0)
      expect(collisions2?.[0]?.entity).not.toBeDefined()

      expect(collisions3?.length).toEqual(1)
      expect(collisions3?.[0]?.entity).toEqual(entity1)
      expect(collisions3?.[1]?.entity).not.toBeDefined()

      expect(collisions4?.length).toEqual(0)
    })

    it('detect collisions point-line', () => {
      const entity1 = generateEntity()
      const entity2 = generateEntity()
      const entity3 = generateEntity()
      const entity4 = generateEntity()

      let state = createEntity({ entity: entity1, state: getState({}) })
      state = createEntity({ entity: entity2, state })
      state = createEntity({ entity: entity3, state })
      state = createEntity({ entity: entity4, state })

      state = createTransform({
        state,
        entity: entity1,
        data: defaultTransform({
          position: vector(0, 0),
        }),
      })
      state = createTransform({
        state,
        entity: entity2,
        data: defaultTransform({
          position: vector(10, 7),
        }),
      })
      state = createTransform({
        state,
        entity: entity3,
        data: defaultTransform({
          position: vector(0, 0),
        }),
      })
      state = createTransform({
        state,
        entity: entity4,
        data: defaultTransform({
          position: vector(99, 99),
        }),
      })

      state = createCollider({
        state,
        entity: entity1,

        data: defaultCollider({
          layers,
          data: [{ type: 'point', position: vector(2, 2) }],
        }),
      })
      state = createCollider({
        state,
        entity: entity2,

        data: defaultCollider({
          layers,
          data: [{ type: 'point', position: vector(-3, -6) }],
        }),
      })
      state = createCollider({
        state,
        entity: entity3,

        data: defaultCollider({
          layers,
          data: [
            { type: 'line', position: vector(1, 1), position2: vector(3, 3) },
          ],
        }),
      })
      state = createCollider({
        state,
        entity: entity4,

        data: defaultCollider({
          layers,
          data: [
            { type: 'line', position: vector(1, 1), position2: vector(3, 3) },
          ],
        }),
      })

      state = runOneFrame({ state })

      const collisions1 = getCollider({
        state,
        entity: entity1,
      })?._collisions
      const collisions2 = getCollider({
        state,
        entity: entity2,
      })?._collisions
      const collisions3 = getCollider({
        state,
        entity: entity3,
      })?._collisions
      const collisions4 = getCollider({
        state,
        entity: entity4,
      })?._collisions

      expect(collisions1?.length).toEqual(1)
      expect(collisions1?.[0]?.entity).toEqual(entity3)
      expect(collisions1?.[1]?.entity).not.toBeDefined()

      expect(collisions2?.length).toEqual(0)
      expect(collisions2?.[0]?.entity).not.toBeDefined()

      expect(collisions3?.length).toEqual(1)
      expect(collisions3?.[0]?.entity).toEqual(entity1)
      expect(collisions3?.[1]?.entity).not.toBeDefined()

      expect(collisions4?.length).toEqual(0)
    })

    it('detect collisions line-line', () => {
      // line
      const entity1 = generateEntity()
      // crosses line1
      const entity2 = generateEntity()
      // crosses line1 and has negative position
      const entity3 = generateEntity()
      // touches line1 end
      const entity4 = generateEntity()
      // doesn't touch line1
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
        data: defaultTransform({
          position: vector(-10, -10),
        }),
      })
      state = createTransform({
        state,
        entity: entity2,
        data: defaultTransform({
          position: vector(0, 0),
        }),
      })
      state = createTransform({
        state,
        entity: entity3,
        data: defaultTransform({
          position: vector(0, 0),
        }),
      })
      state = createTransform({
        state,
        entity: entity4,
        data: defaultTransform({
          position: vector(0, 0),
        }),
      })
      state = createTransform({
        state,
        entity: entity5,
        data: defaultTransform({
          position: vector(99, 99),
        }),
      })

      state = createCollider({
        state,
        entity: entity1,

        data: defaultCollider({
          layers,
          data: [{ type: 'line', position: [-9, -9], position2: [11, 11] }],
        }),
      })
      state = createCollider({
        state,
        entity: entity2,

        data: defaultCollider({
          layers,
          data: [{ type: 'line', position: [-1, 1], position2: [1, -1] }],
        }),
      })
      state = createCollider({
        state,
        entity: entity3,

        data: defaultCollider({
          layers,
          data: [{ type: 'line', position: [2, -2], position2: [-2, 2] }],
        }),
      })
      state = createCollider({
        state,
        entity: entity4,

        data: defaultCollider({
          layers,
          data: [{ type: 'line', position: [1, 1], position2: [2, 2] }],
        }),
      })
      state = createCollider({
        state,
        entity: entity5,

        data: defaultCollider({
          layers,
          data: [{ type: 'line', position: [-1, 1], position2: [1, -1] }],
        }),
      })

      state = runOneFrame({ state })

      const collisions1 = getCollider({
        state,
        entity: entity1,
      })?._collisions
      const collisions2 = getCollider({
        state,
        entity: entity2,
      })?._collisions
      const collisions3 = getCollider({
        state,
        entity: entity3,
      })?._collisions
      const collisions4 = getCollider({
        state,
        entity: entity4,
      })?._collisions
      const collisions5 = getCollider({
        state,
        entity: entity5,
      })?._collisions

      expect(collisions1?.length).toEqual(2)
      expect(collisions1?.[0]?.entity).toEqual(entity2)
      expect(collisions1?.[1]?.entity).toEqual(entity3)

      expect(collisions2?.length).toEqual(1)
      expect(collisions2?.[0]?.entity).toEqual(entity1)

      expect(collisions3?.length).toEqual(1)
      expect(collisions3?.[0]?.entity).toEqual(entity1)

      expect(collisions4?.length).toEqual(0)

      expect(collisions5?.length).toEqual(0)
    })

    it('detect collisions circle-line', () => {
      // circle
      const entity1 = generateEntity()
      // line end inside circle
      const entity2 = generateEntity()
      // line second end inside circle
      const entity3 = generateEntity()
      // line crossing circle
      const entity4 = generateEntity()
      // line outside circle
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
        data: defaultTransform({
          position: vector(-1, -1),
        }),
      })
      state = createTransform({
        state,
        entity: entity2,
        data: defaultTransform({
          position: vector(0, 0),
        }),
      })
      state = createTransform({
        state,
        entity: entity3,
        data: defaultTransform({
          position: vector(0, 0),
        }),
      })
      state = createTransform({
        state,
        entity: entity4,
        data: defaultTransform({
          position: vector(0, 0),
        }),
      })
      state = createTransform({
        state,
        entity: entity5,
        data: defaultTransform({
          position: vector(0, 0),
        }),
      })

      state = createCollider({
        state,
        entity: entity1,

        data: defaultCollider({
          layers,
          data: [{ type: 'circle', position: vector(1, 1), radius: 1 }],
        }),
      })
      state = createCollider({
        state,
        entity: entity2,

        data: defaultCollider({
          layers,
          data: [
            {
              type: 'line',
              position: vector(0.5, 0.5),
              position2: vector(3, 3),
            },
          ],
        }),
      })
      state = createCollider({
        state,
        entity: entity3,

        data: defaultCollider({
          layers,
          data: [
            {
              type: 'line',
              position: vector(3, 3),
              position2: vector(0.5, 0.5),
            },
          ],
        }),
      })
      state = createCollider({
        state,
        entity: entity4,

        data: defaultCollider({
          layers,
          data: [
            { type: 'line', position: vector(0, 0), position2: vector(1, 1) },
          ],
        }),
      })
      state = createCollider({
        state,
        entity: entity5,

        data: defaultCollider({
          layers,
          data: [
            {
              type: 'line',
              position: vector(99, 9),
              position2: vector(10, 10),
            },
          ],
        }),
      })

      state = runOneFrame({ state })

      const collisions1 = getCollider({
        state,
        entity: entity1,
      })?._collisions
      const collisions2 = getCollider({
        state,
        entity: entity2,
      })?._collisions
      const collisions3 = getCollider({
        state,
        entity: entity3,
      })?._collisions
      const collisions4 = getCollider({
        state,
        entity: entity4,
      })?._collisions
      const collisions5 = getCollider({
        state,
        entity: entity5,
      })?._collisions

      expect(collisions1?.length).toEqual(3)
      expect(collisions1?.[0]?.entity).toEqual(entity2)
      expect(collisions1?.[1]?.entity).toEqual(entity3)
      expect(collisions1?.[2]?.entity).toEqual(entity4)
      expect(collisions1?.[3]?.entity).not.toBeDefined()

      expect(collisions2?.length).toEqual(1)
      expect(collisions2?.[0]?.entity).toEqual(entity1)
      expect(collisions2?.[1]?.entity).not.toBeDefined()

      expect(collisions3?.length).toEqual(1)
      expect(collisions3?.[0]?.entity).toEqual(entity1)
      expect(collisions3?.[1]?.entity).not.toBeDefined()

      expect(collisions4?.[0]?.entity).toEqual(entity1)
      expect(collisions4?.[1]?.entity).not.toBeDefined()

      expect(collisions5?.length).toEqual(0)
      expect(collisions5?.[0]?.entity).not.toBeDefined()
    })

    it('detect collisions rectangle-line', () => {
      // rectangle
      const entity1 = generateEntity()
      // left side collision
      const entity2 = generateEntity()
      // right side collision
      const entity3 = generateEntity()
      // top side collision
      const entity4 = generateEntity()
      // bottom side collision
      const entity5 = generateEntity()
      // left-top to right-bottom
      const entity6 = generateEntity()
      // line inside rectangle
      const entity7 = generateEntity()
      // line doesn't touch rectangle
      const entity8 = generateEntity()

      let state = getState({})
      state = createEntity({ entity: entity1, state })
      state = createEntity({ entity: entity2, state })
      state = createEntity({ entity: entity3, state })
      state = createEntity({ entity: entity4, state })
      state = createEntity({ entity: entity5, state })
      state = createEntity({ entity: entity6, state })
      state = createEntity({ entity: entity7, state })
      state = createEntity({ entity: entity8, state })
      ;[entity1, entity2, entity3, entity4, entity5, entity6, entity7].forEach(
        (entity) => {
          state = createTransform({
            state,
            entity,
            data: defaultTransform({
              position: [0, 0],
            }),
          })
        },
      )

      state = createTransform({
        state,
        entity: entity8,
        data: defaultTransform({
          position: [99, 99],
        }),
      })

      state = createCollider({
        state,
        entity: entity1,

        data: defaultCollider({
          layers,
          data: [{ type: 'rectangle', position: [0, 0], size: [1, 1] }],
        }),
      })
      type A = [string, { position: Vector2D; position2: Vector2D }]
      const data: A[] = [
        [entity2, { position: [-1.5, 0.5], position2: [0.5, 0.5] }],
        [entity3, { position: [1.5, 0.5], position2: [0.5, 0.5] }],
        [entity4, { position: [0.5, 1.5], position2: [0.5, 0.5] }],
        [entity5, { position: [0.5, -1.5], position2: [0.5, 0.5] }],
        [entity6, { position: [-1, 2], position2: [2, -1] }],
        [entity7, { position: [0.5, 0.5], position2: [0.5, 0.5] }],
        [entity8, { position: [1.5, 0.5], position2: [0.5, 0.5] }],
      ]

      data.forEach(([entity, { position, position2 }]) => {
        state = createCollider({
          state,
          entity,

          data: defaultCollider({
            layers,
            data: [
              {
                type: 'line',
                position,
                position2,
              },
            ],
          }),
        })
      })

      state = runOneFrame({ state })
      ;[
        {
          entity: entity1,
          collisions: [entity2, entity3, entity4, entity5, entity6],
        },
        {
          entity: entity2,
          collisions: [entity1, entity4, entity5, entity6],
        },
        {
          entity: entity3,
          collisions: [entity1, entity4, entity5, entity6],
        },
        {
          entity: entity4,
          collisions: [entity1, entity2, entity3, entity6],
        },
        {
          entity: entity5,
          collisions: [entity1, entity2, entity3, entity6],
        },
        {
          entity: entity6,
          collisions: [entity1, entity2, entity3, entity4, entity5],
        },
        {
          entity: entity7,
          collisions: [],
        },
        {
          entity: entity8,
          collisions: [],
        },
      ].forEach((data, i) => {
        const collisions = getCollider({
          state,
          entity: data.entity,
        })?._collisions

        expect([i, collisions?.map(({ entity }) => entity)]).toEqual([
          i,
          data.collisions,
        ])
      })
    })
  })

  it('should detect collisions only between the same layers', () => {
    let state = getState({})

    const entity1 = generateEntity()
    const entity2 = generateEntity()
    const entity3 = generateEntity()
    const entity4 = generateEntity()
    const entity5 = generateEntity()
    const entity6 = generateEntity()
    const entity7 = generateEntity()
    const entity8 = generateEntity()

    ;[
      { entity: entity1, layers: ['a', 'b', 'c', 'd'] },
      { entity: entity2, layers: [] },
      { entity: entity3, layers: ['a'] },
      { entity: entity4, layers: ['a', 'b'] },
      { entity: entity5, layers: ['b'] },
      { entity: entity6, layers: ['c'] },
      { entity: entity7, layers: ['d'] },
      { entity: entity8, layers: ['b', 'd'] },
    ].forEach(({ entity, layers }) => {
      state = createEntity({ entity, state })

      state = createTransform({
        state,
        entity,
        data: defaultTransform({ position: [0, 0] }),
      })

      state = createCollider({
        state,
        entity,

        data: defaultCollider({
          layers,
          data: [{ type: 'point', position: [0, 0] }],
        }),
      })
    })

    state = runOneFrame({ state })
    ;[
      {
        entity: entity1,
        collisions: [entity3, entity4, entity5, entity6, entity7, entity8],
      },
      { entity: entity2, collisions: [] },
      { entity: entity3, collisions: [entity1, entity4] },
      { entity: entity4, collisions: [entity1, entity3, entity5, entity8] },
      { entity: entity5, collisions: [entity1, entity4, entity8] },
      { entity: entity6, collisions: [entity1] },
      { entity: entity7, collisions: [entity1, entity8] },
      { entity: entity8, collisions: [entity1, entity4, entity5, entity7] },
    ].forEach(({ entity, collisions }) => {
      expect([
        entity,
        getCollider({
          state,
          entity,
        })?._collisions.map((collision) => collision.entity),
      ]).toEqual([entity, collisions])
    })
  })
})