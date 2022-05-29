import { vector, vectorZero } from '@arekrado/vector-2d'
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

    state = tick(10, state)

    const transform = getComponent<Transform>({
      state,
      entity: entity1,
      name: componentName.transform,
    })

    expect(transform?.position).toEqual([1, 1])
  })

  it.skip('conservation of momentum - rigidBody should exchange momentum to another rigidBody', () => {
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
        parentId: entity1,
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
        force: [0.1, 0],
        mass: 1,
      }),
    })
    state = setComponent<RigidBody, InternalInitialState>({
      state,
      entity: entity2,
      name: componentName.rigidBody,
      data: defaultRigidBody(),
    })

    state = runOneFrame({ state })

    const t1 = getComponent<Transform>({
      state,
      entity: entity1,
      name: componentName.transform,
    })

    const t2 = getComponent<Transform>({
      state,
      entity: entity2,
      name: componentName.transform,
    })

    expect(t1?.position).toEqual(vector(1, 1))
    expect(t1?.fromParentPosition).toEqual(vector(0, 0))

    expect(t2?.position).toEqual(vector(3, 3))
    expect(t2?.fromParentPosition).toEqual(vector(2, 2))
  })
})
