import { vector } from '@arekrado/vector-2d'
import { createEntity } from '../entity/createEntity'
import { generateEntity } from '../entity/generateEntity'
import { runOneFrame } from '../util/runOneFrame'
import { defaultCollider, defaultTransform } from '../util/defaultComponents'
import { setComponent } from '../component/setComponent'
import { getComponent } from '../component/getComponent'
import { componentName } from '../component/componentName'

import { Collider } from '../type'
import { InternalInitialState, Transform } from '../index'
import { getState } from '../util/state'

describe('collider', () => {
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

    state = setComponent<Transform, InternalInitialState>({
      state,
      name: componentName.transform,
      entity: entity1,
      data: defaultTransform({
        fromParentPosition: vector(0, 0),
      }),
    })
    state = setComponent<Transform, InternalInitialState>({
      state,
      name: componentName.transform,
      entity: entity2,
      data: defaultTransform({
        fromParentPosition: vector(1, 19),
      }),
    })
    state = setComponent<Transform, InternalInitialState>({
      state,
      name: componentName.transform,
      entity: entity3,

      data: defaultTransform({
        fromParentPosition: vector(3.5, 3.5),
      }),
    })

    state = setComponent<Collider, InternalInitialState>({
      state,
      entity: entity1,
      name: componentName.collider,
      data: defaultCollider({
        data: [
          { type: 'rectangle', size: vector(1.5, 1.5), position: vector(1, 1) },
        ],
      }),
    })
    state = setComponent<Collider, InternalInitialState>({
      state,
      entity: entity2,
      name: componentName.collider,
      data: defaultCollider({
        data: [
          { type: 'rectangle', size: vector(1, 1), position: vector(0, 0) },
        ],
      }),
    })
    state = setComponent<Collider, InternalInitialState>({
      state,
      entity: entity3,
      name: componentName.collider,

      data: defaultCollider({
        data: [
          { type: 'rectangle', size: vector(1, 1), position: vector(-1, -1) },
        ],
      }),
    })

    state = runOneFrame({ state })

    const collisions1 = getComponent<Collider>({
      name: componentName.collider,
      state,
      entity: entity1,
    })?.collisions
    const collisions2 = getComponent<Collider>({
      name: componentName.collider,
      state,
      entity: entity2,
    })?.collisions
    const collisions3 = getComponent<Collider>({
      name: componentName.collider,
      state,
      entity: entity3,
    })?.collisions

    expect(collisions1?.[0]?.entity).toEqual(entity2)
    expect(collisions1?.[1]?.entity).not.toBeDefined()

    expect(collisions2?.[0]?.entity).toEqual(entity1)
    expect(collisions2?.[1]?.entity).toEqual(entity3)

    expect(collisions3?.[0]?.entity).toEqual(entity2)
    expect(collisions3?.[1]?.entity).not.toBeDefined()
  })

  it('detect collisions point-point', () => {
    const entity1 = generateEntity()
    const entity2 = generateEntity()

    let state = createEntity({
      entity: entity1,
      state: getState({}),
    })
    state = createEntity({ entity: entity2, state })

    state = setComponent<Transform, InternalInitialState>({
      state,
      name: componentName.transform,
      entity: entity1,
      data: defaultTransform({
        position: vector(0, 0),
      }),
    })
    state = setComponent<Transform, InternalInitialState>({
      state,
      name: componentName.transform,
      entity: entity2,
      data: defaultTransform({
        position: vector(10, 7),
      }),
    })

    state = setComponent<Collider, InternalInitialState>({
      state,
      entity: entity1,
      name: componentName.collider,
      data: defaultCollider({
        data: [{ type: 'point', position: vector(1, 1) }],
      }),
    })
    state = setComponent<Collider, InternalInitialState>({
      state,
      entity: entity2,
      name: componentName.collider,
      data: defaultCollider({
        data: [{ type: 'point', position: vector(-9, -6) }],
      }),
    })

    state = runOneFrame({ state })

    const collisions1 = getComponent<Collider>({
      name: componentName.collider,
      state,
      entity: entity1,
    })?.collisions
    const collisions2 = getComponent<Collider>({
      name: componentName.collider,
      state,
      entity: entity2,
    })?.collisions

    expect(collisions1?.length).toBe(1)
    expect(collisions2?.length).toBe(1)

    expect(collisions1?.[0]?.entity).toEqual(entity2)
    expect(collisions2?.[0]?.entity).toEqual(entity1)
  })

  it('detect collisions circle-circle', () => {
    const entity1 = generateEntity()
    const entity2 = generateEntity()
    const entity3 = generateEntity()

    let state = createEntity({
      entity: entity1,
      state: getState({}),
    })
    state = createEntity({ entity: entity2, state })
    state = createEntity({ entity: entity3, state })

    state = setComponent<Transform, InternalInitialState>({
      state,
      name: componentName.transform,
      entity: entity1,
      data: defaultTransform({
        fromParentPosition: vector(0, 0),
      }),
    })
    state = setComponent<Transform, InternalInitialState>({
      state,
      name: componentName.transform,
      entity: entity2,
      data: defaultTransform({
        fromParentPosition: vector(1, 19),
      }),
    })
    state = setComponent<Transform, InternalInitialState>({
      state,
      name: componentName.transform,
      entity: entity3,

      data: defaultTransform({
        fromParentPosition: vector(3.5, 3.5),
      }),
    })

    state = setComponent<Collider, InternalInitialState>({
      state,
      entity: entity1,
      name: componentName.collider,
      data: defaultCollider({
        data: [{ type: 'circle', radius: 1.5, position: vector(1, 1) }],
      }),
    })
    state = setComponent<Collider, InternalInitialState>({
      state,
      entity: entity2,
      name: componentName.collider,
      data: defaultCollider({
        data: [{ type: 'circle', radius: 1, position: vector(0, 0) }],
      }),
    })
    state = setComponent<Collider, InternalInitialState>({
      state,
      entity: entity3,
      name: componentName.collider,

      data: defaultCollider({
        data: [{ type: 'circle', radius: 1, position: vector(-1, -1) }],
      }),
    })

    state = runOneFrame({ state })

    const collisions1 = getComponent<Collider>({
      name: componentName.collider,
      state,
      entity: entity1,
    })?.collisions
    const collisions2 = getComponent<Collider>({
      name: componentName.collider,
      state,
      entity: entity2,
    })?.collisions
    const collisions3 = getComponent<Collider>({
      name: componentName.collider,
      state,
      entity: entity3,
    })?.collisions

    expect(collisions1?.length).toEqual(1)
    expect(collisions1?.[0]?.entity).toEqual(entity2)
    expect(collisions1?.[1]?.entity).not.toBeDefined()

    expect(collisions2?.length).toEqual(2)
    expect(collisions2?.[0]?.entity).toEqual(entity1)
    expect(collisions2?.[1]?.entity).toEqual(entity3)

    expect(collisions3?.length).toEqual(1)
    expect(collisions3?.[0]?.entity).toEqual(entity2)
    expect(collisions3?.[1]?.entity).not.toBeDefined()
  })

  it('detect collisions circle-rectangle', () => {
    const entity1 = generateEntity()
    const entity2 = generateEntity()
    const entity3 = generateEntity()
    let state = getState({})

    state = createEntity({ entity: entity1, state })
    state = createEntity({ entity: entity2, state })
    state = createEntity({ entity: entity3, state })

    state = setComponent<Transform, InternalInitialState>({
      state,
      name: componentName.transform,
      entity: entity1,
      data: defaultTransform({
        position: vector(0, 0),
      }),
    })
    state = setComponent<Transform, InternalInitialState>({
      state,
      name: componentName.transform,
      entity: entity2,
      data: defaultTransform({
        position: vector(0, 0),
      }),
    })
    state = setComponent<Transform, InternalInitialState>({
      state,
      name: componentName.transform,
      entity: entity3,

      data: defaultTransform({
        position: vector(0, 0),
      }),
    })

    state = setComponent<Collider, InternalInitialState>({
      state,
      entity: entity1,
      name: componentName.collider,
      data: defaultCollider({
        data: [
          { type: 'rectangle', size: vector(5, 5), position: vector(0, 0) },
        ],
      }),
    })
    state = setComponent<Collider, InternalInitialState>({
      state,
      entity: entity2,
      name: componentName.collider,
      data: defaultCollider({
        data: [{ type: 'circle', radius: 5, position: vector(5, 5) }],
      }),
    })
    state = setComponent<Collider, InternalInitialState>({
      state,
      entity: entity3,
      name: componentName.collider,

      data: defaultCollider({
        data: [{ type: 'circle', radius: 7.2, position: vector(-5, -5) }],
      }),
    })

    state = runOneFrame({ state })

    const collisions1 = getComponent<Collider>({
      name: componentName.collider,
      state,
      entity: entity1,
    })?.collisions
    const collisions2 = getComponent<Collider>({
      name: componentName.collider,
      state,
      entity: entity2,
    })?.collisions
    const collisions3 = getComponent<Collider>({
      name: componentName.collider,
      state,
      entity: entity3,
    })?.collisions

    expect(collisions1?.length).toEqual(1)
    expect(collisions1?.[0]?.entity).toEqual(entity3)
    expect(collisions1?.[1]?.entity).not.toBeDefined()

    expect(collisions2?.length).toEqual(0)
    expect(collisions2?.[0]?.entity).not.toBeDefined()

    expect(collisions3?.length).toEqual(1)
    expect(collisions3?.[0]?.entity).toEqual(entity1)
    expect(collisions3?.[1]?.entity).not.toBeDefined()
  })

  it('detect collisions point-line', () => {
    const entity1 = generateEntity()
    const entity2 = generateEntity()
    const entity3 = generateEntity()

    let state = createEntity({ entity: entity1, state: getState({}) })
    state = createEntity({ entity: entity2, state })
    state = createEntity({ entity: entity3, state })

    state = setComponent<Transform, InternalInitialState>({
      state,
      name: componentName.transform,
      entity: entity1,
      data: defaultTransform({
        position: vector(0, 0),
      }),
    })
    state = setComponent<Transform, InternalInitialState>({
      state,
      name: componentName.transform,
      entity: entity2,
      data: defaultTransform({
        position: vector(10, 7),
      }),
    })
    state = setComponent<Transform, InternalInitialState>({
      state,
      name: componentName.transform,
      entity: entity3,
      data: defaultTransform({
        position: vector(0, 0),
      }),
    })

    state = setComponent<Collider, InternalInitialState>({
      state,
      entity: entity1,
      name: componentName.collider,
      data: defaultCollider({
        data: [{ type: 'point', position: vector(2, 2) }],
      }),
    })
    state = setComponent<Collider, InternalInitialState>({
      state,
      entity: entity2,
      name: componentName.collider,
      data: defaultCollider({
        data: [{ type: 'point', position: vector(-3, -6) }],
      }),
    })
    state = setComponent<Collider, InternalInitialState>({
      state,
      entity: entity3,
      name: componentName.collider,
      data: defaultCollider({
        data: [
          { type: 'line', position: vector(1, 1), position2: vector(3, 3) },
        ],
      }),
    })

    state = runOneFrame({ state })

    const collisions1 = getComponent<Collider>({
      name: componentName.collider,
      state,
      entity: entity1,
    })?.collisions
    const collisions2 = getComponent<Collider>({
      name: componentName.collider,
      state,
      entity: entity2,
    })?.collisions
    const collisions3 = getComponent<Collider>({
      name: componentName.collider,
      state,
      entity: entity3,
    })?.collisions

    expect(collisions1?.length).toEqual(1)
    expect(collisions1?.[0]?.entity).toEqual(entity3)
    expect(collisions1?.[1]?.entity).not.toBeDefined()

    expect(collisions2?.length).toEqual(0)
    expect(collisions2?.[0]?.entity).not.toBeDefined()

    expect(collisions3?.length).toEqual(1)
    expect(collisions3?.[0]?.entity).toEqual(entity1)
    expect(collisions3?.[1]?.entity).not.toBeDefined()
  })

  it.only('detect collisions line-line', () => {
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

    state = setComponent<Transform, InternalInitialState>({
      state,
      name: componentName.transform,
      entity: entity1,
      data: defaultTransform({
        position: vector(-10, -10),
      }),
    })
    state = setComponent<Transform, InternalInitialState>({
      state,
      name: componentName.transform,
      entity: entity2,
      data: defaultTransform({
        position: vector(0, 0),
      }),
    })
    state = setComponent<Transform, InternalInitialState>({
      state,
      name: componentName.transform,
      entity: entity3,
      data: defaultTransform({
        position: vector(0, 0),
      }),
    })
    state = setComponent<Transform, InternalInitialState>({
      state,
      name: componentName.transform,
      entity: entity4,
      data: defaultTransform({
        position: vector(0, 0),
      }),
    })
    state = setComponent<Transform, InternalInitialState>({
      state,
      name: componentName.transform,
      entity: entity5,
      data: defaultTransform({
        position: vector(0, 0),
      }),
    })

    state = setComponent<Collider, InternalInitialState>({
      state,
      entity: entity1,
      name: componentName.collider,
      data: defaultCollider({
        data: [{ type: 'line', position: [-9, -9], position2: [11, 11] }],
      }),
    })
    state = setComponent<Collider, InternalInitialState>({
      state,
      entity: entity2,
      name: componentName.collider,
      data: defaultCollider({
        data: [{ type: 'line', position: [-1, 1], position2: [1, -1] }],
      }),
    })
    state = setComponent<Collider, InternalInitialState>({
      state,
      entity: entity3,
      name: componentName.collider,
      data: defaultCollider({
        data: [{ type: 'line', position: [2, -2], position2: [-2, 2] }],
      }),
    })
    state = setComponent<Collider, InternalInitialState>({
      state,
      entity: entity4,
      name: componentName.collider,
      data: defaultCollider({
        data: [{ type: 'line', position: [1, 1], position2: [2, 2] }],
      }),
    })
    state = setComponent<Collider, InternalInitialState>({
      state,
      entity: entity5,
      name: componentName.collider,
      data: defaultCollider({
        data: [{ type: 'line', position: [100, 100], position2: [100, 100] }],
      }),
    })

    state = runOneFrame({ state })

    const collisions1 = getComponent<Collider>({
      name: componentName.collider,
      state,
      entity: entity1,
    })?.collisions
    const collisions2 = getComponent<Collider>({
      name: componentName.collider,
      state,
      entity: entity2,
    })?.collisions
    const collisions3 = getComponent<Collider>({
      name: componentName.collider,
      state,
      entity: entity3,
    })?.collisions
    const collisions4 = getComponent<Collider>({
      name: componentName.collider,
      state,
      entity: entity4,
    })?.collisions
    const collisions5 = getComponent<Collider>({
      name: componentName.collider,
      state,
      entity: entity5,
    })?.collisions

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

    state = setComponent<Transform, InternalInitialState>({
      state,
      name: componentName.transform,
      entity: entity1,
      data: defaultTransform({
        position: vector(-1, -1),
      }),
    })
    state = setComponent<Transform, InternalInitialState>({
      state,
      name: componentName.transform,
      entity: entity2,
      data: defaultTransform({
        position: vector(0, 0),
      }),
    })
    state = setComponent<Transform, InternalInitialState>({
      state,
      name: componentName.transform,
      entity: entity3,
      data: defaultTransform({
        position: vector(0, 0),
      }),
    })
    state = setComponent<Transform, InternalInitialState>({
      state,
      name: componentName.transform,
      entity: entity4,
      data: defaultTransform({
        position: vector(0, 0),
      }),
    })
    state = setComponent<Transform, InternalInitialState>({
      state,
      name: componentName.transform,
      entity: entity5,
      data: defaultTransform({
        position: vector(0, 0),
      }),
    })

    state = setComponent<Collider, InternalInitialState>({
      state,
      entity: entity1,
      name: componentName.collider,
      data: defaultCollider({
        data: [{ type: 'circle', position: vector(1, 1), radius: 1 }],
      }),
    })
    state = setComponent<Collider, InternalInitialState>({
      state,
      entity: entity2,
      name: componentName.collider,
      data: defaultCollider({
        data: [
          { type: 'line', position: vector(0.5, 0.5), position2: vector(3, 3) },
        ],
      }),
    })
    state = setComponent<Collider, InternalInitialState>({
      state,
      entity: entity3,
      name: componentName.collider,
      data: defaultCollider({
        data: [
          { type: 'line', position: vector(3, 3), position2: vector(0.5, 0.5) },
        ],
      }),
    })
    state = setComponent<Collider, InternalInitialState>({
      state,
      entity: entity4,
      name: componentName.collider,
      data: defaultCollider({
        data: [
          { type: 'line', position: vector(0, 0), position2: vector(1, 1) },
        ],
      }),
    })
    state = setComponent<Collider, InternalInitialState>({
      state,
      entity: entity5,
      name: componentName.collider,
      data: defaultCollider({
        data: [
          { type: 'line', position: vector(9, 9), position2: vector(10, 10) },
        ],
      }),
    })

    state = runOneFrame({ state })

    const collisions1 = getComponent<Collider>({
      name: componentName.collider,
      state,
      entity: entity1,
    })?.collisions
    const collisions2 = getComponent<Collider>({
      name: componentName.collider,
      state,
      entity: entity2,
    })?.collisions
    const collisions3 = getComponent<Collider>({
      name: componentName.collider,
      state,
      entity: entity3,
    })?.collisions
    const collisions4 = getComponent<Collider>({
      name: componentName.collider,
      state,
      entity: entity4,
    })?.collisions
    const collisions5 = getComponent<Collider>({
      name: componentName.collider,
      state,
      entity: entity5,
    })?.collisions

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
})
