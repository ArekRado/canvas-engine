import { distance, vector, Vector2D, vectorZero } from '@arekrado/vector-2d'
import { getState } from '../../util/state'
import { createEntity } from '../../entity/createEntity'
import { generateEntity } from '../../entity/generateEntity'
import {
  defaultCollider,
  defaultRigidBody,
  defaultTransform,
} from '../../util/defaultComponents'
import { tick } from '../../util/testUtils'
import {
  getElasticCollisionForces,
  getElasticCollisionForcesStatic,
} from './rigidBody'
import { createTransform, getTransform } from '../transform/transformCrud'
import { createCollider, getCollider } from '../collider/colliderCrud'
import { createRigidBody, getRigidBody } from './rigidBodyCrud'
import { toFixedVector2D } from '../../util/toFixedVector2D'
import { degreesToRadians } from '../../util/radian'
import {
  AnyState,
  Collider,
  ColliderDataCircle,
  ColliderDataLine,
  ColliderDataPoint,
  ColliderDataPolygon,
  ColliderDataRectangle,
} from '../../type'

describe('getElasticCollisionForces', () => {
  it('should return proper data', () => {
    expect(
      getElasticCollisionForces({
        m1: 1,
        m2: 1,
        v1: [0, 0],
        v2: [0, 0],
        position1: [0, 0],
        position2: [1, 0],
      }),
    ).toEqual({
      force1: [0, 0],
      force2: [0, 0],
    })

    expect(
      getElasticCollisionForces({
        m1: 1,
        m2: 1,
        v1: [1, 0],
        v2: [0, 0],
        position1: [0, 0],
        position2: [1, 0],
      }),
    ).toEqual({
      force1: [0, 0],
      force2: [1, 0],
    })

    expect(
      getElasticCollisionForces({
        m1: 1,
        m2: 1,
        v1: [1, 0],
        v2: [-1, 0],
        position1: [0, 0],
        position2: [1, 0],
      }),
    ).toEqual({
      force1: [-1, 0],
      force2: [1, 0],
    })

    expect(
      getElasticCollisionForces({
        m1: 3,
        m2: 5,
        v1: [4, 0],
        v2: [-6, 0],
        position1: [3, 0],
        position2: [0, 0],
      }),
    ).toEqual({
      force1: [-8.5, 0],
      force2: [1.5, 0],
    })

    expect(
      getElasticCollisionForces({
        m1: 1,
        m2: 1,
        v1: [1, 0],
        v2: [-1, 0],
        position1: [-0.16, 0.2],
        position2: [0.16, 0],
      }),
    ).toEqual({
      force1: [-0.4382022471910114, 0.8988764044943821],
      force2: [0.4382022471910114, -0.8988764044943821],
    })
  })
})

describe('getElasticCollisionForcesStatic', () => {
  it('should return proper data', () => {
    expect(
      getElasticCollisionForcesStatic({
        v1: [0, 0],
        v2: [0, 0],
        position1: [0, 0],
        position2: [1, 0],
      }),
    ).toEqual([0, 0])

    expect(
      getElasticCollisionForcesStatic({
        v1: [1, 0],
        v2: [0, 0],
        position1: [0, 0],
        position2: [1, 0],
      }),
    ).toEqual([-1, 0])

    expect(
      getElasticCollisionForcesStatic({
        v1: [0.2, 0],
        v2: [0, 0],
        position1: [1, 0],
        position2: [2, 0],
      }),
    ).toEqual([-0.2, 0])

    expect(
      getElasticCollisionForcesStatic({
        v1: [0.2, 0.2],
        v2: [0, 0],
        position1: [1, 0],
        position2: [2, 0],
      }),
    ).toEqual([-0.2, 0.2])
  })
})

describe('rigidBody', () => {
  it('should move rigidBody using force', () => {
    let state = getState({}) as AnyState

    const entity1 = generateEntity()

    state = createEntity({ entity: entity1, state })

    state = createTransform({
      state,
      entity: entity1,
      data: defaultTransform({
        position: [0, 0],
      }),
    })

    state = createCollider({
      state,
      entity: entity1,
      data: defaultCollider({
        layer: {
          belongs: ['a'],
          interacts: ['a'],
        },
        data: { type: 'circle', position: [0, 0], radius: 0.1 },
      }),
    })

    state = createRigidBody({
      state,
      entity: entity1,
      data: defaultRigidBody({
        force: [0.1, 0],
        mass: 1,
      }),
    })

    // todo: why it needs 3 ticks?
    state = tick(0, state)
    state = tick(10, state)
    state = tick(10, state)

    const transform = getTransform({
      state,
      entity: entity1,
    })

    expect(toFixedVector2D(transform?.position as Vector2D, 2)).toEqual([1, 0])
  })

  it('should use friction to reduce force', () => {
    let state = getState({}) as AnyState

    const entity1 = generateEntity()

    state = createEntity({ entity: entity1, state })

    state = createTransform({
      state,
      entity: entity1,
      data: defaultTransform({
        position: [0, 0],
      }),
    })

    state = createCollider({
      state,
      entity: entity1,
      data: defaultCollider({
        layer: {
          belongs: ['a'],
          interacts: ['a'],
        },
        data: { type: 'circle', position: [0, 0], radius: 0.1 },
      }),
    })

    state = createRigidBody({
      state,
      entity: entity1,
      data: defaultRigidBody({
        force: [10, 0],
        mass: 1,
        friction: 2,
      }),
    })

    state = tick(0, state)
    state = tick(10, state)
    state = tick(10, state)

    expect(
      toFixedVector2D(
        getTransform({
          state,
          entity: entity1,
        })?.position as Vector2D,
        3,
      ),
    ).toEqual([94.6, 0])

    state = tick(20, state)
    state = tick(20, state)

    expect(
      toFixedVector2D(
        getTransform({
          state,
          entity: entity1,
        })?.position as Vector2D,
        3,
      ),
    ).toEqual([177.2, 0])

    state = tick(40, state)
    state = tick(40, state)

    expect(
      toFixedVector2D(
        getTransform({
          state,
          entity: entity1,
        })?.position as Vector2D,
        3,
      ),
    ).toEqual([306.4, 0])
  })

  it('conservation of momentum in elastic collisions 1 - rigidbodies with the same mass', () => {
    const r1Force: Vector2D = [0.1, 0]
    const r2Force: Vector2D = [0, 0]

    let state = getState({}) as AnyState

    const entity1 = generateEntity()
    const entity2 = generateEntity()

    state = createEntity({ entity: entity1, state })
    state = createEntity({ entity: entity2, state })

    state = createTransform({
      state,
      entity: entity1,
      data: defaultTransform({
        position: [0, 0],
      }),
    })
    state = createTransform({
      state,
      entity: entity2,
      data: defaultTransform({
        position: [1, 0],
      }),
    })

    state = createCollider({
      state,
      entity: entity1,
      data: defaultCollider({
        layer: {
          belongs: ['a'],
          interacts: ['a'],
        },
        data: { type: 'circle', position: [0, 0], radius: 0.1 },
      }),
    })
    state = createCollider({
      state,
      entity: entity2,
      data: defaultCollider({
        layer: {
          belongs: ['a'],
          interacts: ['a'],
        },
        data: { type: 'circle', position: [0, 0], radius: 0.1 },
      }),
    })

    state = createRigidBody({
      state,
      entity: entity1,
      data: defaultRigidBody({
        force: r1Force,
        mass: 1,
      }),
    })
    state = createRigidBody({
      state,
      entity: entity2,
      data: defaultRigidBody({
        force: r2Force,
        mass: 1,
      }),
    })

    Array.from({ length: 12 }).forEach((_, i) => {
      state = tick(i, state)
    })

    expect(
      getRigidBody({
        state,
        entity: entity1,
      })?.force,
    ).toEqual(r2Force)

    expect(
      getRigidBody({
        state,
        entity: entity2,
      })?.force,
    ).toEqual(r1Force)
  })

  it('conservation of momentum in elastic collisions 2 - rigidbodies with the same mass', () => {
    const r1Force: Vector2D = [0.1, 0]
    const r2Force: Vector2D = [-0.2, 0]

    let state = getState({}) as AnyState

    const entity1 = generateEntity()
    const entity2 = generateEntity()

    state = createEntity({ entity: entity1, state })
    state = createEntity({ entity: entity2, state })

    state = createTransform({
      state,
      entity: entity1,
      data: defaultTransform({
        position: [0, 0],
      }),
    })
    state = createTransform({
      state,
      entity: entity2,
      data: defaultTransform({
        position: [3, 0],
      }),
    })

    state = createCollider({
      state,
      entity: entity1,
      data: defaultCollider({
        layer: {
          belongs: ['a'],
          interacts: ['a'],
        },
        data: { type: 'circle', position: [0, 0], radius: 1 },
      }),
    })
    state = createCollider({
      state,
      entity: entity2,
      data: defaultCollider({
        layer: {
          belongs: ['a'],
          interacts: ['a'],
        },
        data: { type: 'circle', position: [0, 0], radius: 1 },
      }),
    })

    state = createRigidBody({
      state,
      entity: entity1,
      data: defaultRigidBody({
        force: r1Force,
        mass: 1,
      }),
    })
    state = createRigidBody({
      state,
      entity: entity2,
      data: defaultRigidBody({
        force: r2Force,
        mass: 1,
      }),
    })

    Array.from({ length: 11 }).forEach((_, i) => {
      state = tick(i, state)
    })

    const force1 = getRigidBody({
      state,
      entity: entity1,
    })?.force as Vector2D
    const force2 = getRigidBody({
      state,
      entity: entity2,
    })?.force as Vector2D

    expect(toFixedVector2D(force1, 2)).toEqual(r2Force)
    expect(toFixedVector2D(force2, 2)).toEqual(r1Force)
  })

  it('conservation of momentum in elastic collisions 3 - static rigidBody should not be moved by force', () => {
    let state = getState({}) as AnyState

    const entity1 = generateEntity()
    const entity2 = generateEntity()

    state = createEntity({ entity: entity1, state })
    state = createEntity({ entity: entity2, state })

    state = createTransform({
      state,
      entity: entity1,
      data: defaultTransform({
        position: [0, 0],
      }),
    })
    state = createTransform({
      state,
      entity: entity2,
      data: defaultTransform({
        position: [2, 0],
      }),
    })

    state = createCollider({
      state,
      entity: entity1,
      data: defaultCollider({
        layer: {
          belongs: ['a'],
          interacts: ['a'],
        },
        data: { type: 'circle', position: [0, 0], radius: 1 },
      }),
    })
    state = createCollider({
      state,
      entity: entity2,
      data: defaultCollider({
        layer: {
          belongs: ['a'],
          interacts: ['a'],
        },
        data: { type: 'line', position: [0, 10], position2: [0, -10] },
      }),
    })

    state = createRigidBody({
      state,
      entity: entity1,
      data: defaultRigidBody({
        force: [0.2, 0],
        mass: 1,
      }),
    })
    state = createRigidBody({
      state,
      entity: entity2,
      data: defaultRigidBody({
        force: [0, 0],
        mass: 1,
        isStatic: true,
      }),
    })

    Array.from({ length: 11 }).forEach((_, i) => {
      state = tick(i, state)
    })

    // Static rigidBody should not be moved
    expect(
      getTransform({
        state,
        entity: entity2,
      })?.position,
    ).toEqual([2, 0])

    // After collision with kinematic rigidbody force should be reflected
    expect(
      getRigidBody({
        state,
        entity: entity1,
      })?.force,
    ).toEqual([-0.2, 0])

    // Static rigidBody should not have any force
    expect(
      getRigidBody({
        state,
        entity: entity2,
      })?.force,
    ).toEqual(vectorZero())
  })

  it('conservation of momentum in elastic collisions 4 - collision circle-line should correctly bounce circle. Position should not change bounce angle', () => {
    let state = getState({}) as AnyState

    const entity1 = generateEntity()
    const entity2 = generateEntity()

    state = createEntity({ entity: entity1, state })
    state = createEntity({ entity: entity2, state })

    state = createTransform({
      state,
      entity: entity1,
      data: defaultTransform({
        position: [0, 0],
      }),
    })
    state = createTransform({
      state,
      entity: entity2,
      data: defaultTransform({
        // Line has different Y axis but collision point is still the same
        position: [2, 1],
      }),
    })

    state = createCollider({
      state,
      entity: entity1,
      data: defaultCollider({
        layer: {
          belongs: ['a'],
          interacts: ['a'],
        },
        data: { type: 'circle', position: [0, 0], radius: 1 },
      }),
    })
    state = createCollider({
      state,
      entity: entity2,
      data: defaultCollider({
        layer: {
          belongs: ['a'],
          interacts: ['a'],
        },
        data: { type: 'line', position: [0, 10], position2: [0, -10] },
      }),
    })

    state = createRigidBody({
      state,
      entity: entity1,
      data: defaultRigidBody({
        force: [0.2, 0],
        mass: 1,
      }),
    })
    state = createRigidBody({
      state,
      entity: entity2,
      data: defaultRigidBody({
        force: [0, 0],
        mass: 1,
        isStatic: true,
      }),
    })

    Array.from({ length: 11 }).forEach((_, i) => {
      state = tick(i, state)
    })

    // Collider and transform positions doens't matter because bounce force is calculated depending on a intersection position
    expect(
      getRigidBody({
        state,
        entity: entity1,
      })?.force,
    ).toEqual([-0.2, 0])
  })

  it('conservation of momentum in elastic collisions 5 - collision circle-line should correctly bounce circle. Rotated line should change correctly circle force', () => {
    let state = getState({}) as AnyState

    const entity1 = generateEntity()
    const entity2 = generateEntity()

    state = createEntity({ entity: entity1, state })
    state = createEntity({ entity: entity2, state })

    state = createTransform({
      state,
      entity: entity1,
      data: defaultTransform({
        position: [0, 0],
      }),
    })
    state = createTransform({
      state,
      entity: entity2,
      data: defaultTransform({
        // Line has different Y axis but collision point is still the same
        position: [2, 1],
        rotation: degreesToRadians(45),
      }),
    })

    state = createCollider({
      state,
      entity: entity1,
      data: defaultCollider({
        layer: {
          belongs: ['a'],
          interacts: ['a'],
        },
        data: { type: 'circle', position: [0, 0], radius: 1 },
      }),
    })
    state = createCollider({
      state,
      entity: entity2,
      data: defaultCollider({
        layer: {
          belongs: ['a'],
          interacts: ['a'],
        },
        data: { type: 'line', position: [0, 10], position2: [0, -10] },
      }),
    })

    state = createRigidBody({
      state,
      entity: entity1,
      data: defaultRigidBody({
        force: [0.2, 0],
        mass: 1,
      }),
    })
    state = createRigidBody({
      state,
      entity: entity2,
      data: defaultRigidBody({
        force: [0, 0],
        mass: 1,
        isStatic: true,
      }),
    })

    Array.from({ length: 11 }).forEach((_, i) => {
      state = tick(i, state)
    })

    // After collision with line rotated by 45 degrees circle force should be reflected by 90 degrees - [0.2, 0] -> [0, 0.2]
    expect(
      toFixedVector2D(
        getRigidBody({
          state,
          entity: entity1,
        })?.force as Vector2D,
        5,
      ),
    ).toEqual([0, 0.2])
  })

  it('should apply additional force to rigidbodies when they collides with each other in two ticks in a row', () => {
    // if rigidbody stuck inside another rigidbody then phisic will push them to the center, we want to move them outside.

    let state = getState({}) as AnyState

    const entity1 = generateEntity()
    const entity2 = generateEntity()

    state = createEntity({ entity: entity1, state })
    state = createEntity({ entity: entity2, state })

    state = createTransform({
      state,
      entity: entity1,
      data: defaultTransform({
        position: [3.777196043997166, 2.5104600747657106],
      }),
    })
    state = createTransform({
      state,
      entity: entity2,
      data: defaultTransform({
        position: [2.7081851982875227, 2.1153390722823326],
      }),
    })

    state = createCollider({
      state,
      entity: entity1,
      data: defaultCollider({
        data: 
          {
            type: 'circle',
            radius: 0.6646845178296792,
            position: [0, 0],
          },
        
        layer: {
          belongs: ['knight'],
          interacts: ['knight', 'barrier'],
        },
      }),
    })
    state = createCollider({
      state,
      entity: entity2,
      data: defaultCollider({
        data: 
          {
            type: 'circle',
            radius: 0.6628101775793278,
            position: [0, 0],
          },
        
        layer: {
          belongs: ['knight'],
          interacts: ['knight', 'barrier'],
        },
      }),
    })

    state = createRigidBody({
      state,
      entity: entity1,
      data: defaultRigidBody({
        mass: 0.6646845178296792,
        force: [0.0006659534850252688, -0.00025463924853605054],
      }),
    })
    state = createRigidBody({
      state,
      entity: entity2,
      data: defaultRigidBody({
        mass: 0.6628101775793278,
        force: [-0.0006650088452932791, -0.0017474685339102045],
        isStatic: false,
      }),
    })

    state = tick(0, state)
    state = tick(275, state)
    state = tick(275, state)

    // Rigidbody logic should push out colliders

    expect(
      getCollider({
        state,
        entity: entity1,
      })?._collisions,
    ).toEqual([])

    expect(
      getCollider({
        state,
        entity: entity2,
      })?._collisions,
    ).toEqual([])
  })
})

describe('rigidBody + collider stress tests', () => {
  it.skip('stress test', () => {
    const amountOfColliders = 200
    let state = getState({}) as AnyState

    const getRandomPosition = () =>
      vector(Math.random() * 10 - 5, Math.random() * 10 - 5)

    const getRandomLayers = () =>
      ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'].filter(
        () => Math.random() > 0.5,
      )

    const colliderData = [
      (): ColliderDataPoint => ({
        type: 'point',
        position: getRandomPosition(),
      }),
      (): ColliderDataRectangle => ({
        type: 'rectangle',
        size: getRandomPosition(),
        /**
         * Left bottom corner
         */
        position: getRandomPosition(),
      }),
      (): ColliderDataCircle => ({
        type: 'circle',
        radius: Math.random() * 10,
        /**
         * Left bottom corner
         */
        position: getRandomPosition(),
      }),
      (): ColliderDataLine => ({
        type: 'line',
        position: getRandomPosition(),
        position2: getRandomPosition(),
      }),
      (): ColliderDataPolygon => ({
        type: 'polygon',
        verticles: [
          getRandomPosition(),
          getRandomPosition(),
          getRandomPosition(),
          getRandomPosition(),
          getRandomPosition(),
          getRandomPosition(),
          getRandomPosition(),
          getRandomPosition(),
          getRandomPosition(),
          getRandomPosition(),
        ],
      }),
    ]

    const getRandomColliderData = (): Collider['data'] =>
      colliderData[Math.floor(Math.random() * colliderData.length)]()

    Array.from({ length: amountOfColliders }).forEach(() => {
      const transformScale = vector(Math.random(), Math.random())

      const entity = generateEntity()
      state = createEntity({ entity, state })
      state = createTransform({
        state,
        entity,
        data: defaultTransform({
          position: getRandomPosition(),
          rotation: degreesToRadians(Math.random() * 360),
          scale: transformScale,
        }),
      })
      state = createCollider({
        state,
        entity,
        data: defaultCollider({
          data: getRandomColliderData(),
          layer: {
            belongs: getRandomLayers(),
            interacts: getRandomLayers(),
          },
        }),
      })
      state = createRigidBody({
        state,
        entity,
        data: defaultRigidBody({
          mass: Math.random(),
          force: [Math.random(), Math.random()],
        }),
      })
    })

    const timeBefore = performance.now()
    state = tick(0, state)
    state = tick(10, state)
    state = tick(10, state)

    const timeAfter = performance.now()
    const delta = timeAfter - timeBefore

    console.log('delta', delta)

    // 100 - 600-800ms
    // 200 - 5s
    // 1000 - 55s

    expect(delta).toBeLessThan(10000)
  })
})
