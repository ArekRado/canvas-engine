import { vector, Vector2D } from '@arekrado/vector-2d'
import { createEntity } from '../../entity/createEntity'
import { generateEntity } from '../../entity/generateEntity'
import { defaultCollider, defaultTransform } from '../../util/defaultComponents'
import { getState } from '../../util/state'
import { createTransform } from '../transform/transformCrud'
import { createCollider, getCollider } from './colliderCrud'
import { degreesToRadians } from '../../util/radian'
import { addEventHandler, removeEventHandler } from '../../event'
import {
  AnyState,
  CanvasEngineEvent,
  Collider,
  CollisionEvent,
  Entity,
  EventHandler,
} from '../../type'
import { tick } from '../../util/testUtils'

const findCollision = ({
  allCollisions,
  e1,
  e2,
}: {
  allCollisions: Array<CollisionEvent['payload']>
  e1: Entity
  e2: Entity
}) =>
  allCollisions.find(
    ({ colliderEntity1, colliderEntity2 }) =>
      colliderEntity1 === e1 && colliderEntity2 === e2,
  )

const runOneFrameWithFixedTime = (state: AnyState): AnyState => {
  // to trigger fixedTick delta has to be changed by 1ms
  state = tick(1, state)
  state = tick(2, state)
  state = tick(2, state)

  return state
}

describe('collider', () => {
  let allCollisions: CollisionEvent['payload'][] = []
  const handleCollision: EventHandler<CollisionEvent, AnyState> = ({
    state,
    event,
  }) => {
    if (event.type === CanvasEngineEvent.colliderCollision) {
      allCollisions.push(event.payload)
    }

    return state
  }

  beforeEach(() => {
    addEventHandler(handleCollision)
  })

  afterEach(() => {
    allCollisions = []
    removeEventHandler(handleCollision)
  })

  describe('detect collisions', () => {
    const layer: Collider['layer'] = {
      belongs: ['default'],
      interacts: ['default'],
    }

    it('detect collisions rectangle-rectangle', () => {
      const entity1 = generateEntity()
      const entity2 = generateEntity()
      const entity3 = generateEntity()

      let state = createEntity({
        entity: entity1,
        state: getState({}) as AnyState,
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
          emitEventCollision: true,
          layer,
          data: {
            type: 'rectangle',
            size: vector(1.5, 1.5),
            position: vector(1, 1),
          },
        }),
      })
      state = createCollider({
        state,
        entity: entity2,
        data: defaultCollider({
          emitEventCollision: true,
          layer,
          data: {
            type: 'rectangle',
            size: vector(1, 1),
            position: vector(0, 0),
          },
        }),
      })
      state = createCollider({
        state,
        entity: entity3,
        data: defaultCollider({
          emitEventCollision: true,
          layer,
          data: {
            type: 'rectangle',
            size: vector(1, 1),
            position: vector(-1, -1),
          },
        }),
      })

      state = runOneFrameWithFixedTime(state)

      expect(
        findCollision({ e1: entity1, e2: entity2, allCollisions }),
      ).toBeDefined()
      expect(
        findCollision({ e1: entity1, e2: entity3, allCollisions }),
      ).toBeDefined()

      expect(
        findCollision({ e1: entity2, e2: entity1, allCollisions }),
      ).toBeDefined()
      expect(
        findCollision({ e1: entity2, e2: entity3, allCollisions }),
      ).not.toBeDefined()

      expect(
        findCollision({ e1: entity3, e2: entity1, allCollisions }),
      ).toBeDefined()
      expect(
        findCollision({ e1: entity3, e2: entity2, allCollisions }),
      ).not.toBeDefined()
    })

    it('detect collisions point-point', () => {
      const entity1 = generateEntity()
      const entity2 = generateEntity()
      const entity3 = generateEntity()

      let state = createEntity({
        entity: entity1,
        state: getState({}) as AnyState,
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
          emitEventCollision: true,
          layer,
          data: { type: 'point', position: vector(1, 1) },
        }),
      })
      state = createCollider({
        state,
        entity: entity2,

        data: defaultCollider({
          emitEventCollision: true,
          layer,
          data: { type: 'point', position: vector(-9, -6) },
        }),
      })
      state = createCollider({
        state,
        entity: entity3,

        data: defaultCollider({
          emitEventCollision: true,
          layer,
          data: { type: 'point', position: vector(99, 99) },
        }),
      })

      state = runOneFrameWithFixedTime(state)

      expect(
        findCollision({ e1: entity1, e2: entity2, allCollisions }),
      ).toBeDefined()
      expect(
        findCollision({ e1: entity1, e2: entity3, allCollisions }),
      ).not.toBeDefined()

      expect(
        findCollision({ e1: entity2, e2: entity1, allCollisions }),
      ).toBeDefined()
      expect(
        findCollision({ e1: entity2, e2: entity3, allCollisions }),
      ).not.toBeDefined()

      expect(
        findCollision({ e1: entity3, e2: entity1, allCollisions }),
      ).not.toBeDefined()
      expect(
        findCollision({ e1: entity3, e2: entity2, allCollisions }),
      ).not.toBeDefined()
    })

    it('detect collisions circle-circle', () => {
      const entity1 = generateEntity()
      const entity2 = generateEntity()
      const entity3 = generateEntity()
      const entity4 = generateEntity()

      let state = createEntity({
        entity: entity1,
        state: getState({}) as AnyState,
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
          emitEventCollision: true,
          layer,
          data: { type: 'circle', radius: 1.5, position: vector(1, 1) },
        }),
      })
      state = createCollider({
        state,
        entity: entity2,

        data: defaultCollider({
          emitEventCollision: true,
          layer,
          data: { type: 'circle', radius: 1, position: vector(0, 0) },
        }),
      })
      state = createCollider({
        state,
        entity: entity3,

        data: defaultCollider({
          emitEventCollision: true,
          layer,
          data: { type: 'circle', radius: 1, position: vector(-1, -1) },
        }),
      })
      state = createCollider({
        state,
        entity: entity4,

        data: defaultCollider({
          emitEventCollision: true,
          layer,
          data: { type: 'circle', radius: 1, position: vector(-1, -1) },
        }),
      })

      state = runOneFrameWithFixedTime(state)

      expect(
        findCollision({ e1: entity1, e2: entity1, allCollisions }),
      ).not.toBeDefined()
      expect(
        findCollision({ e1: entity1, e2: entity2, allCollisions }),
      ).toBeDefined()
      expect(
        findCollision({ e1: entity1, e2: entity3, allCollisions }),
      ).toBeDefined()
      expect(
        findCollision({ e1: entity1, e2: entity4, allCollisions }),
      ).not.toBeDefined()

      expect(
        findCollision({ e1: entity2, e2: entity1, allCollisions }),
      ).toBeDefined()
      expect(
        findCollision({ e1: entity2, e2: entity2, allCollisions }),
      ).not.toBeDefined()
      expect(
        findCollision({ e1: entity2, e2: entity3, allCollisions }),
      ).not.toBeDefined()
      expect(
        findCollision({ e1: entity2, e2: entity4, allCollisions }),
      ).not.toBeDefined()

      expect(
        findCollision({ e1: entity3, e2: entity1, allCollisions }),
      ).toBeDefined()
      expect(
        findCollision({ e1: entity3, e2: entity2, allCollisions }),
      ).not.toBeDefined()
      expect(
        findCollision({ e1: entity3, e2: entity3, allCollisions }),
      ).not.toBeDefined()
      expect(
        findCollision({ e1: entity3, e2: entity4, allCollisions }),
      ).not.toBeDefined()

      expect(
        findCollision({ e1: entity4, e2: entity1, allCollisions }),
      ).not.toBeDefined()
      expect(
        findCollision({ e1: entity4, e2: entity2, allCollisions }),
      ).not.toBeDefined()
      expect(
        findCollision({ e1: entity4, e2: entity4, allCollisions }),
      ).not.toBeDefined()
      expect(
        findCollision({ e1: entity4, e2: entity4, allCollisions }),
      ).not.toBeDefined()
    })

    it('detect collisions circle-rectangle', () => {
      const entity1 = generateEntity()
      const entity2 = generateEntity()
      const entity3 = generateEntity()
      const entity4 = generateEntity()
      let state = getState({}) as AnyState

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
          emitEventCollision: true,
          layer,
          data: {
            type: 'rectangle',
            size: vector(5, 5),
            position: vector(0, 0),
          },
        }),
      })
      state = createCollider({
        state,
        entity: entity2,
        data: defaultCollider({
          emitEventCollision: true,
          layer,
          data: { type: 'circle', radius: 5, position: vector(5, 5) },
        }),
      })
      state = createCollider({
        state,
        entity: entity3,
        data: defaultCollider({
          emitEventCollision: true,
          layer,
          data: { type: 'circle', radius: 7.2, position: vector(-5, -5) },
        }),
      })
      state = createCollider({
        state,
        entity: entity4,
        data: defaultCollider({
          emitEventCollision: true,
          layer,
          data: { type: 'circle', radius: 7.2, position: vector(-5, -5) },
        }),
      })

      state = runOneFrameWithFixedTime(state)

      expect(
        findCollision({ e1: entity1, e2: entity1, allCollisions }),
      ).not.toBeDefined()
      expect(
        findCollision({ e1: entity1, e2: entity2, allCollisions }),
      ).toBeDefined()
      expect(
        findCollision({ e1: entity1, e2: entity3, allCollisions }),
      ).toBeDefined()
      expect(
        findCollision({ e1: entity1, e2: entity4, allCollisions }),
      ).not.toBeDefined()

      expect(
        findCollision({ e1: entity2, e2: entity1, allCollisions }),
      ).toBeDefined()
      expect(
        findCollision({ e1: entity2, e2: entity2, allCollisions }),
      ).not.toBeDefined()
      expect(
        findCollision({ e1: entity2, e2: entity3, allCollisions }),
      ).not.toBeDefined()
      expect(
        findCollision({ e1: entity2, e2: entity4, allCollisions }),
      ).not.toBeDefined()

      expect(
        findCollision({ e1: entity3, e2: entity1, allCollisions }),
      ).toBeDefined()
      expect(
        findCollision({ e1: entity3, e2: entity2, allCollisions }),
      ).not.toBeDefined()
      expect(
        findCollision({ e1: entity3, e2: entity3, allCollisions }),
      ).not.toBeDefined()
      expect(
        findCollision({ e1: entity3, e2: entity4, allCollisions }),
      ).not.toBeDefined()

      expect(
        findCollision({ e1: entity4, e2: entity1, allCollisions }),
      ).not.toBeDefined()
      expect(
        findCollision({ e1: entity4, e2: entity2, allCollisions }),
      ).not.toBeDefined()
      expect(
        findCollision({ e1: entity4, e2: entity4, allCollisions }),
      ).not.toBeDefined()
      expect(
        findCollision({ e1: entity4, e2: entity4, allCollisions }),
      ).not.toBeDefined()
    })

    it('detect collisions point-line', () => {
      const entity1 = generateEntity()
      const entity2 = generateEntity()
      const entity3 = generateEntity()
      const entity4 = generateEntity()

      let state = createEntity({
        entity: entity1,
        state: getState({}) as AnyState,
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
          emitEventCollision: true,
          layer,
          data: { type: 'point', position: vector(2, 2) },
        }),
      })
      state = createCollider({
        state,
        entity: entity2,

        data: defaultCollider({
          emitEventCollision: true,
          layer,
          data: { type: 'point', position: vector(-3, -6) },
        }),
      })
      state = createCollider({
        state,
        entity: entity3,

        data: defaultCollider({
          emitEventCollision: true,
          layer,
          data: {
            type: 'line',
            position: vector(1, 1),
            position2: vector(3, 3),
          },
        }),
      })
      state = createCollider({
        state,
        entity: entity4,

        data: defaultCollider({
          emitEventCollision: true,
          layer,
          data: {
            type: 'line',
            position: vector(1, 1),
            position2: vector(3, 3),
          },
        }),
      })

      state = runOneFrameWithFixedTime(state)

      expect(
        findCollision({ e1: entity1, e2: entity2, allCollisions }),
      ).not.toBeDefined()
      expect(
        findCollision({ e1: entity1, e2: entity3, allCollisions }),
      ).toBeDefined()
      expect(
        findCollision({ e1: entity1, e2: entity4, allCollisions }),
      ).not.toBeDefined()

      expect(
        findCollision({ e1: entity2, e2: entity1, allCollisions }),
      ).not.toBeDefined()
      expect(
        findCollision({ e1: entity2, e2: entity3, allCollisions }),
      ).not.toBeDefined()
      expect(
        findCollision({ e1: entity2, e2: entity4, allCollisions }),
      ).not.toBeDefined()

      expect(
        findCollision({ e1: entity3, e2: entity1, allCollisions }),
      ).toBeDefined()
      expect(
        findCollision({ e1: entity3, e2: entity2, allCollisions }),
      ).not.toBeDefined()
      expect(
        findCollision({ e1: entity3, e2: entity4, allCollisions }),
      ).not.toBeDefined()

      expect(
        findCollision({ e1: entity4, e2: entity1, allCollisions }),
      ).not.toBeDefined()
      expect(
        findCollision({ e1: entity4, e2: entity2, allCollisions }),
      ).not.toBeDefined()
      expect(
        findCollision({ e1: entity4, e2: entity3, allCollisions }),
      ).not.toBeDefined()
    })

    it('detect collisions line-line', () => {
      const allCollisions: CollisionEvent['payload'][] = []
      addEventHandler(({ state, event }) => {
        if (event.type === CanvasEngineEvent.colliderCollision) {
          allCollisions.push(event.payload)
        }

        return state
      })

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

      let state = getState({}) as AnyState
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
          emitEventCollision: true,
          layer,
          data: { type: 'line', position: [-9, -9], position2: [11, 11] },
        }),
      })
      state = createCollider({
        state,
        entity: entity2,

        data: defaultCollider({
          emitEventCollision: true,
          layer,
          data: { type: 'line', position: [-1, 1], position2: [1, -1] },
        }),
      })
      state = createCollider({
        state,
        entity: entity3,

        data: defaultCollider({
          emitEventCollision: true,
          layer,
          data: { type: 'line', position: [2, -2], position2: [-2, 2] },
        }),
      })
      state = createCollider({
        state,
        entity: entity4,

        data: defaultCollider({
          emitEventCollision: true,
          layer,
          data: { type: 'line', position: [1, 1], position2: [2, 2] },
        }),
      })
      state = createCollider({
        state,
        entity: entity5,

        data: defaultCollider({
          emitEventCollision: true,
          layer,
          data: { type: 'line', position: [-1, 1], position2: [1, -1] },
        }),
      })

      state = runOneFrameWithFixedTime(state)

      expect(
        findCollision({ e1: entity1, e2: entity1, allCollisions }),
      ).not.toBeDefined()
      expect(
        findCollision({ e1: entity1, e2: entity2, allCollisions }),
      ).toBeDefined()
      expect(
        findCollision({ e1: entity1, e2: entity3, allCollisions }),
      ).toBeDefined()
      expect(
        findCollision({ e1: entity1, e2: entity4, allCollisions }),
      ).not.toBeDefined()

      expect(
        findCollision({ e1: entity2, e2: entity1, allCollisions }),
      ).toBeDefined()
      expect(
        findCollision({ e1: entity2, e2: entity2, allCollisions }),
      ).not.toBeDefined()
      expect(
        findCollision({ e1: entity2, e2: entity3, allCollisions }),
      ).not.toBeDefined()
      expect(
        findCollision({ e1: entity2, e2: entity4, allCollisions }),
      ).not.toBeDefined()

      expect(
        findCollision({ e1: entity3, e2: entity1, allCollisions }),
      ).toBeDefined()
      expect(
        findCollision({ e1: entity3, e2: entity2, allCollisions }),
      ).not.toBeDefined()
      expect(
        findCollision({ e1: entity3, e2: entity3, allCollisions }),
      ).not.toBeDefined()
      expect(
        findCollision({ e1: entity3, e2: entity4, allCollisions }),
      ).not.toBeDefined()

      expect(
        findCollision({ e1: entity4, e2: entity1, allCollisions }),
      ).not.toBeDefined()
      expect(
        findCollision({ e1: entity4, e2: entity2, allCollisions }),
      ).not.toBeDefined()
      expect(
        findCollision({ e1: entity4, e2: entity3, allCollisions }),
      ).not.toBeDefined()
      expect(
        findCollision({ e1: entity4, e2: entity4, allCollisions }),
      ).not.toBeDefined()

      expect(
        findCollision({ e1: entity5, e2: entity1, allCollisions }),
      ).not.toBeDefined()
      expect(
        findCollision({ e1: entity5, e2: entity2, allCollisions }),
      ).not.toBeDefined()
      expect(
        findCollision({ e1: entity5, e2: entity3, allCollisions }),
      ).not.toBeDefined()
      expect(
        findCollision({ e1: entity5, e2: entity4, allCollisions }),
      ).not.toBeDefined()
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

      const allCollisions: CollisionEvent['payload'][] = []
      addEventHandler(({ state, event }) => {
        if (event.type === CanvasEngineEvent.colliderCollision) {
          allCollisions.push(event.payload)
        }

        return state
      })

      let state = getState({}) as AnyState
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
          emitEventCollision: true,
          layer,
          data: { type: 'circle', position: vector(1, 1), radius: 1 },
        }),
      })
      state = createCollider({
        state,
        entity: entity2,

        data: defaultCollider({
          emitEventCollision: true,
          layer,
          data: {
            type: 'line',
            position: vector(0.5, 0.5),
            position2: vector(3, 3),
          },
        }),
      })
      state = createCollider({
        state,
        entity: entity3,

        data: defaultCollider({
          emitEventCollision: true,
          layer,
          data: {
            type: 'line',
            position: vector(3, 3),
            position2: vector(0.5, 0.5),
          },
        }),
      })
      state = createCollider({
        state,
        entity: entity4,

        data: defaultCollider({
          emitEventCollision: true,
          layer,
          data: {
            type: 'line',
            position: vector(0, 0),
            position2: vector(1, 1),
          },
        }),
      })
      state = createCollider({
        state,
        entity: entity5,

        data: defaultCollider({
          emitEventCollision: true,
          layer,
          data: {
            type: 'line',
            position: vector(99, 9),
            position2: vector(10, 10),
          },
        }),
      })

      state = runOneFrameWithFixedTime(state)

      expect(
        findCollision({ e1: entity1, e2: entity1, allCollisions }),
      ).not.toBeDefined()
      expect(
        findCollision({ e1: entity1, e2: entity2, allCollisions }),
      ).toBeDefined()
      expect(
        findCollision({ e1: entity1, e2: entity3, allCollisions }),
      ).toBeDefined()
      expect(
        findCollision({ e1: entity1, e2: entity4, allCollisions }),
      ).toBeDefined()

      expect(
        findCollision({ e1: entity2, e2: entity1, allCollisions }),
      ).toBeDefined()
      expect(
        findCollision({ e1: entity2, e2: entity2, allCollisions }),
      ).not.toBeDefined()
      expect(
        findCollision({ e1: entity2, e2: entity3, allCollisions }),
      ).not.toBeDefined()
      expect(
        findCollision({ e1: entity2, e2: entity4, allCollisions }),
      ).not.toBeDefined()

      expect(
        findCollision({ e1: entity3, e2: entity1, allCollisions }),
      ).toBeDefined()
      expect(
        findCollision({ e1: entity3, e2: entity2, allCollisions }),
      ).not.toBeDefined()
      expect(
        findCollision({ e1: entity3, e2: entity3, allCollisions }),
      ).not.toBeDefined()
      expect(
        findCollision({ e1: entity3, e2: entity4, allCollisions }),
      ).not.toBeDefined()

      expect(
        findCollision({ e1: entity4, e2: entity1, allCollisions }),
      ).toBeDefined()
      expect(
        findCollision({ e1: entity4, e2: entity2, allCollisions }),
      ).not.toBeDefined()
      expect(
        findCollision({ e1: entity4, e2: entity3, allCollisions }),
      ).not.toBeDefined()
      expect(
        findCollision({ e1: entity4, e2: entity4, allCollisions }),
      ).not.toBeDefined()

      expect(
        findCollision({ e1: entity5, e2: entity1, allCollisions }),
      ).not.toBeDefined()
      expect(
        findCollision({ e1: entity5, e2: entity2, allCollisions }),
      ).not.toBeDefined()
      expect(
        findCollision({ e1: entity5, e2: entity3, allCollisions }),
      ).not.toBeDefined()
      expect(
        findCollision({ e1: entity5, e2: entity4, allCollisions }),
      ).not.toBeDefined()
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

      const allCollisions: CollisionEvent['payload'][] = []
      addEventHandler(({ state, event }) => {
        if (event.type === CanvasEngineEvent.colliderCollision) {
          allCollisions.push(event.payload)
        }

        return state
      })

      let state = getState({}) as AnyState
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
          emitEventCollision: true,
          layer,
          data: { type: 'rectangle', position: [0, 0], size: [1, 1] },
        }),
      })
      type A = [string, { position: Vector2D; position2: Vector2D }]
      const lines: A[] = [
        [entity2, { position: [-1.5, 0.5], position2: [0.5, 0.5] }],
        [entity3, { position: [1.5, 0.5], position2: [0.5, 0.5] }],
        [entity4, { position: [0.5, 1.5], position2: [0.5, 0.5] }],
        [entity5, { position: [0.5, -1.5], position2: [0.5, 0.5] }],
        [entity6, { position: [-1, 2], position2: [2, -1] }],
        [entity7, { position: [0.5, 0.5], position2: [0.5, 0.5] }],
        [entity8, { position: [1.5, 0.5], position2: [0.5, 0.5] }],
      ]

      lines.forEach(([entity, { position, position2 }]) => {
        state = createCollider({
          state,
          entity,
          data: defaultCollider({
            emitEventCollision: true,
            layer,
            data: {
              type: 'line',
              position,
              position2,
            },
          }),
        })
      })

      state = runOneFrameWithFixedTime(state)
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
      ].forEach(({ entity, collisions }) => {
        collisions.forEach((entity2) => {
          const collision = allCollisions.find(
            (collision) =>
              collision.colliderEntity1 === entity &&
              collision.colliderEntity2 === entity2,
          )

          expect(collision).toBeDefined()
        })
      })
    })
  })

  it('should detect collisions only between the same layer', () => {
    let state = getState({}) as AnyState

    const allCollisions: CollisionEvent['payload'][] = []
    addEventHandler(({ state, event }) => {
      if (event.type === CanvasEngineEvent.colliderCollision) {
        allCollisions.push(event.payload)
      }

      return state
    })

    const entity1 = generateEntity()
    const entity2 = generateEntity()
    const entity3 = generateEntity()
    const entity4 = generateEntity()
    const entity5 = generateEntity()
    const entity6 = generateEntity()
    const entity7 = generateEntity()
    const entity11 = generateEntity()
    const entity12 = generateEntity()
    const entity13 = generateEntity()

    ;[
      {
        entity: entity1,
        layer: {
          belongs: ['a', 'b', 'c', 'd'],
          interacts: ['a', 'b', 'c', 'd'],
        },
      },
      { entity: entity2, layer: { belongs: [], interacts: [] } },
      { entity: entity3, layer: { belongs: ['a'], interacts: ['a'] } },
      {
        entity: entity4,
        layer: { belongs: ['a', 'b'], interacts: ['a', 'b'] },
      },
      { entity: entity5, layer: { belongs: ['b'], interacts: ['b'] } },
      { entity: entity6, layer: { belongs: ['c'], interacts: ['c'] } },
      { entity: entity7, layer: { belongs: ['d'], interacts: ['d'] } },
      {
        entity: entity11,
        layer: { belongs: [], interacts: ['a', 'b'] },
      },
      {
        entity: entity12,
        layer: { belongs: ['w'], interacts: [] },
      },
      {
        entity: entity13,
        layer: { belongs: [], interacts: ['w'] },
      },
    ].forEach(({ entity, layer }) => {
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
          emitEventCollision: true,
          layer,
          data: { type: 'point', position: [0, 0] },
        }),
      })
    })

    state = runOneFrameWithFixedTime(state)
    ;[
      {
        entity: entity1,
        collisions: [entity3, entity4, entity5, entity6, entity7],
      },
      { entity: entity2, collisions: [] },
      { entity: entity3, collisions: [entity1, entity4] },
      { entity: entity4, collisions: [entity1, entity3, entity5] },
      { entity: entity5, collisions: [entity1, entity4] },
      { entity: entity6, collisions: [entity1] },
      { entity: entity7, collisions: [entity1] },
      {
        entity: entity11,
        collisions: [entity1, entity3, entity4, entity5],
      },
      { entity: entity12, collisions: [] },
      { entity: entity13, collisions: [entity12] },
    ].forEach(({ entity, collisions }) => {
      collisions.forEach((entity2) => {
        const collision = allCollisions.find(
          (collision) =>
            collision.colliderEntity1 === entity &&
            collision.colliderEntity2 === entity2,
        )

        expect(collision).toBeDefined()
      })
    })
  })

  it('detect collisions between rotated colliders', () => {
    const entity1 = generateEntity()
    const entity2 = generateEntity()
    const entity3 = generateEntity()

    let state = getState({}) as AnyState
    state = createEntity({ entity: entity1, state })
    state = createEntity({ entity: entity2, state })
    state = createEntity({ entity: entity3, state })

    state = createTransform({
      state,
      entity: entity1,
      data: defaultTransform({
        position: vector(2, 0),
      }),
    })
    state = createTransform({
      state,
      entity: entity2,
      data: defaultTransform({
        position: vector(1, 0),
      }),
    })
    // Rotated rectangle should be wide enough to touch line
    state = createTransform({
      state,
      entity: entity3,
      data: defaultTransform({
        position: vector(-0.1, 0),
        rotation: degreesToRadians(45),
      }),
    })

    state = createCollider({
      state,
      entity: entity1,
      data: defaultCollider({
        emitEventCollision: true,
        layer: {
          belongs: ['a'],
          interacts: ['a'],
        },
        data: { type: 'circle', position: vector(0, 0), radius: 1 },
      }),
    })
    state = createCollider({
      state,
      entity: entity2,
      data: defaultCollider({
        emitEventCollision: true,
        layer: {
          belongs: ['a'],
          interacts: ['a'],
        },
        data: {
          type: 'line',
          position: vector(0, 0),
          position2: vector(0, 3),
        },
      }),
    })
    state = createCollider({
      state,
      entity: entity3,
      data: defaultCollider({
        emitEventCollision: true,
        layer: {
          belongs: ['a'],
          interacts: ['a'],
        },
        data: {
          type: 'rectangle',
          position: vector(0, 0),
          size: vector(1, 1),
        },
      }),
    })

    state = runOneFrameWithFixedTime(state)

    expect(
      findCollision({ e1: entity1, e2: entity2, allCollisions }),
    ).not.toBeDefined()
    expect(
      findCollision({ e1: entity1, e2: entity3, allCollisions }),
    ).not.toBeDefined()

    expect(
      findCollision({ e1: entity2, e2: entity1, allCollisions }),
    ).not.toBeDefined()
    expect(
      findCollision({ e1: entity2, e2: entity3, allCollisions }),
    ).toBeDefined()

    expect(
      findCollision({ e1: entity3, e2: entity1, allCollisions }),
    ).not.toBeDefined()
    expect(
      findCollision({ e1: entity3, e2: entity2, allCollisions }),
    ).toBeDefined()
  })

  it('should emit collision event with correct data', () => {
    const entity1 = generateEntity()
    const entity2 = generateEntity()

    let state = getState({}) as AnyState
    state = runOneFrameWithFixedTime(state)

    const eventHandler = jest.fn(({ state }) => state)
    addEventHandler(eventHandler)

    state = createEntity({ entity: entity1, state })
    state = createEntity({ entity: entity2, state })

    state = createTransform({
      state,
      entity: entity1,
      data: defaultTransform({}),
    })
    state = createTransform({
      state,
      entity: entity2,
      data: defaultTransform({}),
    })

    state = createCollider({
      state,
      entity: entity1,
      data: defaultCollider({
        emitEventCollision: true,
        layer: {
          belongs: ['a'],
          interacts: ['a'],
        },
        data: { type: 'circle', position: vector(0, 0), radius: 1 },
      }),
    })
    state = createCollider({
      state,
      entity: entity2,
      data: defaultCollider({
        emitEventCollision: true,
        layer: {
          belongs: ['a'],
          interacts: ['a'],
        },
        data: { type: 'circle', position: vector(0, 0), radius: 1 },
      }),
    })

    state = runOneFrameWithFixedTime(state)

    expect(eventHandler.mock.calls[0][0].event).toEqual({
      payload: {
        colliderEntity1: entity2,
        colliderEntity2: entity1,
        collisionLayer: 'a',
        intersection: {
          figure: {
            data: {
              position: [0, 0],
              radius: 1,
            },
            type: 'circle',
          },
          position: [0, 0],
        },
      },
      type: CanvasEngineEvent.colliderCollision,
    })

    expect(eventHandler.mock.calls[1][0].event).toEqual({
      payload: {
        colliderEntity1: entity1,
        colliderEntity2: entity2,
        collisionLayer: 'a',
        intersection: {
          figure: {
            data: {
              position: [0, 0],
              radius: 1,
            },
            type: 'circle',
          },
          position: [0, 0],
        },
      },
      type: CanvasEngineEvent.colliderCollision,
    })

    expect(getCollider({ state, entity: entity1 })?.collision).toEqual({
      figure: {
        data: {
          position: [0, 0],
          radius: 1,
        },
        type: 'circle',
      },
      position: [0, 0],
    })
    expect(getCollider({ state, entity: entity2 })?.collision).toEqual({
      figure: {
        data: {
          position: [0, 0],
          radius: 1,
        },
        type: 'circle',
      },
      position: [0, 0],
    })

    removeEventHandler(eventHandler)
  })

  it('should generate proper rectangle contour depending on collider', () => {
    const entity1 = generateEntity()
    const entity2 = generateEntity()

    let state = getState({}) as AnyState
    state = runOneFrameWithFixedTime(state)

    const eventHandler = jest.fn(({ state }) => state)
    addEventHandler(eventHandler)

    state = createEntity({ entity: entity1, state })
    state = createEntity({ entity: entity2, state })

    state = createTransform({
      state,
      entity: entity1,
      data: defaultTransform({}),
    })
    state = createTransform({
      state,
      entity: entity2,
      data: defaultTransform({}),
    })

    state = createCollider({
      state,
      entity: entity1,
      data: defaultCollider({
        emitEventCollision: true,
        layer: {
          belongs: ['a'],
          interacts: ['a'],
        },
        data: { type: 'circle', position: vector(0, 0), radius: 1 },
      }),
    })
    state = createCollider({
      state,
      entity: entity2,
      data: defaultCollider({
        emitEventCollision: true,
        layer: {
          belongs: ['a'],
          interacts: ['a'],
        },
        data: { type: 'circle', position: vector(0, 0), radius: 1 },
      }),
    })

    state = runOneFrameWithFixedTime(state)

    expect(eventHandler.mock.calls[0][0].event).toEqual({
      payload: {
        colliderEntity1: entity2,
        colliderEntity2: entity1,
        collisionLayer: 'a',
        intersection: {
          figure: {
            data: {
              position: [0, 0],
              radius: 1,
            },
            type: 'circle',
          },
          position: [0, 0],
        },
      },
      type: CanvasEngineEvent.colliderCollision,
    })

    expect(eventHandler.mock.calls[1][0].event).toEqual({
      payload: {
        colliderEntity1: entity1,
        colliderEntity2: entity2,
        collisionLayer: 'a',
        intersection: {
          figure: {
            data: {
              position: [0, 0],
              radius: 1,
            },
            type: 'circle',
          },
          position: [0, 0],
        },
      },
      type: CanvasEngineEvent.colliderCollision,
    })

    removeEventHandler(eventHandler)
  })
})
