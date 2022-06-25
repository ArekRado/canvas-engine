import { vector, Vector2D, vectorZero } from '@arekrado/vector-2d'
import { getState } from '../util/state'
import { createEntity } from '../entity/createEntity'
import { generateEntity } from '../entity/generateEntity'
import { runOneFrame } from '../util/runOneFrame'
import {
  defaultCollider,
  defaultRigidBody,
  defaultTransform,
} from '../util/defaultComponents'
import { getComponent } from '../component/getComponent'
import { InternalInitialState, RigidBody, Transform } from '../type'
import { componentName } from '../component/componentName'
import { setComponent } from '../component/setComponent'
import { Collider } from '..'
import { tick } from './utils'
import { getElasticCollisionForces } from '../system/rigidBody/rigidBody'

const toFixedVector2D = (v: Vector2D, fractionDigits: number) =>
  vector(
    parseFloat(v[0].toFixed(fractionDigits)),
    parseFloat(v[1].toFixed(fractionDigits)),
  )

describe('getElasticCollisionForces', () => {
  it('should return proper data', () => {
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
})

describe('rigidBody', () => {
  it('should move rigidBody using force', () => {
    let state = getState({})

    const entity1 = generateEntity()

    state = createEntity({ entity: entity1, state })

    state = setComponent<Transform, InternalInitialState>({
      state,
      entity: entity1,
      name: componentName.transform,
      data: defaultTransform({
        position: [0, 0],
      }),
    })

    state = setComponent<Collider, InternalInitialState>({
      state,
      entity: entity1,
      name: componentName.collider,
      data: defaultCollider({
        layers: ['a'],
        data: [{ type: 'circle', position: [0, 0], radius: 0.1 }],
      }),
    })

    state = setComponent<RigidBody, InternalInitialState>({
      state,
      entity: entity1,
      name: componentName.rigidBody,
      data: defaultRigidBody({
        force: [0.1, 0],
        mass: 1,
      }),
    })

    state = tick(0, state)
    state = tick(10, state)

    const transform = getComponent<Transform>({
      state,
      entity: entity1,
      name: componentName.transform,
    })

    expect(transform?.position).toEqual([1, 0])
  })

  it('should use friction to reduce force', () => {
    let state = getState({})

    const entity1 = generateEntity()

    state = createEntity({ entity: entity1, state })

    state = setComponent<Transform, InternalInitialState>({
      state,
      entity: entity1,
      name: componentName.transform,
      data: defaultTransform({
        position: [0, 0],
      }),
    })

    state = setComponent<Collider, InternalInitialState>({
      state,
      entity: entity1,
      name: componentName.collider,
      data: defaultCollider({
        layers: ['a'],
        data: [{ type: 'circle', position: [0, 0], radius: 0.1 }],
      }),
    })

    state = setComponent<RigidBody, InternalInitialState>({
      state,
      entity: entity1,
      name: componentName.rigidBody,
      data: defaultRigidBody({
        force: [10, 0],
        mass: 1,
        friction: 2,
      }),
    })

    state = tick(0, state)
    state = tick(10, state)

    expect(
      getComponent<Transform>({
        state,
        entity: entity1,
        name: componentName.transform,
      })?.position,
    ).toEqual([100, 0])

    state = tick(20, state)

    expect(
      getComponent<Transform>({
        state,
        entity: entity1,
        name: componentName.transform,
      })?.position,
    ).toEqual([188, 0])

    state = tick(40, state)

    expect(
      getComponent<Transform>({
        state,
        entity: entity1,
        name: componentName.transform,
      })?.position,
    ).toEqual([340, 0])
  })

  it('conservation of momentum in elastic collisions 1 - rigidbodies with the same mass', () => {
    const r1Force: Vector2D = [0.1, 0]
    const r2Force: Vector2D = [0, 0]

    let state = getState({})

    const entity1 = generateEntity()
    const entity2 = generateEntity()

    state = createEntity({ entity: entity1, state })
    state = createEntity({ entity: entity2, state })

    state = setComponent<Transform, InternalInitialState>({
      state,
      entity: entity1,
      name: componentName.transform,
      data: defaultTransform({
        position: [0, 0],
      }),
    })
    state = setComponent<Transform, InternalInitialState>({
      state,
      entity: entity2,
      name: componentName.transform,
      data: defaultTransform({
        position: [1, 0],
      }),
    })

    state = setComponent<Collider, InternalInitialState>({
      state,
      entity: entity1,
      name: componentName.collider,
      data: defaultCollider({
        layers: ['a'],
        data: [{ type: 'circle', position: [0, 0], radius: 0.1 }],
      }),
    })
    state = setComponent<Collider, InternalInitialState>({
      state,
      entity: entity2,
      name: componentName.collider,
      data: defaultCollider({
        layers: ['a'],
        data: [{ type: 'circle', position: [0, 0], radius: 0.1 }],
      }),
    })

    state = setComponent<RigidBody, InternalInitialState>({
      state,
      entity: entity1,
      name: componentName.rigidBody,
      data: defaultRigidBody({
        force: r1Force,
        mass: 1,
      }),
    })
    state = setComponent<RigidBody, InternalInitialState>({
      state,
      entity: entity2,
      name: componentName.rigidBody,
      data: defaultRigidBody({
        force: r2Force,
        mass: 0,
      }),
    })

    Array.from({ length: 11 }).forEach((_, i) => {
      state = tick(i, state)
    })

    expect(
      getComponent<RigidBody>({
        state,
        entity: entity1,
        name: componentName.rigidBody,
      })?.force,
    ).toEqual(r2Force)

    expect(
      getComponent<RigidBody>({
        state,
        entity: entity2,
        name: componentName.rigidBody,
      })?.force,
    ).toEqual(r1Force)
  })

  it.only('conservation of momentum in elastic collisions 2 - rigidbodies with the same mass', () => {
    const r1Force: Vector2D = [0.1, 0]
    const r2Force: Vector2D = [-0.2, 0]

    let state = getState({})

    const entity1 = generateEntity()
    const entity2 = generateEntity()

    state = createEntity({ entity: entity1, state })
    state = createEntity({ entity: entity2, state })

    state = setComponent<Transform, InternalInitialState>({
      state,
      entity: entity1,
      name: componentName.transform,
      data: defaultTransform({
        position: [0, 0],
      }),
    })
    state = setComponent<Transform, InternalInitialState>({
      state,
      entity: entity2,
      name: componentName.transform,
      data: defaultTransform({
        position: [3, 0],
      }),
    })

    state = setComponent<Collider, InternalInitialState>({
      state,
      entity: entity1,
      name: componentName.collider,
      data: defaultCollider({
        layers: ['a'],
        data: [{ type: 'circle', position: [0, 0], radius: 1 }],
      }),
    })
    state = setComponent<Collider, InternalInitialState>({
      state,
      entity: entity2,
      name: componentName.collider,
      data: defaultCollider({
        layers: ['a'],
        data: [{ type: 'circle', position: [0, 0], radius: 1 }],
      }),
    })

    state = setComponent<RigidBody, InternalInitialState>({
      state,
      entity: entity1,
      name: componentName.rigidBody,
      data: defaultRigidBody({
        force: r1Force,
        mass: 1,
      }),
    })
    state = setComponent<RigidBody, InternalInitialState>({
      state,
      entity: entity2,
      name: componentName.rigidBody,
      data: defaultRigidBody({
        force: r2Force,
        mass: 1,
      }),
    })

    Array.from({ length: 11 }).forEach((_, i) => {
      state = tick(i, state)
    })

    const force1 = getComponent<RigidBody>({
      state,
      entity: entity1,
      name: componentName.rigidBody,
    })?.force as Vector2D
    const force2 = getComponent<RigidBody>({
      state,
      entity: entity2,
      name: componentName.rigidBody,
    })?.force as Vector2D

    expect(toFixedVector2D(force1, 2)).toEqual(r2Force)
    expect(toFixedVector2D(force2, 2)).toEqual(r1Force)
  })
})
