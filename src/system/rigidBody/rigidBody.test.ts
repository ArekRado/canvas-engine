import { vector, Vector2D, vectorZero } from '@arekrado/vector-2d'
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
import { createCollider } from '../collider/colliderCrud'
import { createRigidBody, getRigidBody } from './rigidBodyCrud'
import { toFixedVector2D } from '../../util/toFixedVector2D'
import { degreesToRadians } from '../../util/radian'

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
    let state = getState({})

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
        data: [{ type: 'circle', position: [0, 0], radius: 0.1 }],
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
    let state = getState({})

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
        data: [{ type: 'circle', position: [0, 0], radius: 0.1 }],
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

    let state = getState({})

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
        data: [{ type: 'circle', position: [0, 0], radius: 0.1 }],
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
        data: [{ type: 'circle', position: [0, 0], radius: 0.1 }],
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

    let state = getState({})

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
        data: [{ type: 'circle', position: [0, 0], radius: 1 }],
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
        data: [{ type: 'circle', position: [0, 0], radius: 1 }],
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
    let state = getState({})

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
        data: [{ type: 'circle', position: [0, 0], radius: 1 }],
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
        data: [{ type: 'line', position: [0, 10], position2: [0, -10] }],
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
    let state = getState({})

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
        data: [{ type: 'circle', position: [0, 0], radius: 1 }],
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
        data: [{ type: 'line', position: [0, 10], position2: [0, -10] }],
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
    let state = getState({})

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
        data: [{ type: 'circle', position: [0, 0], radius: 1 }],
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
        data: [{ type: 'line', position: [0, 10], position2: [0, -10] }],
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
})
