import 'regenerator-runtime/runtime'
import { vector } from '@arekrado/vector-2d'
import { setEntity, createEntity } from '../entity'
import { runOneFrame } from '../util/runOneFrame'
import {
  collideBox as defaultCollideBox,
  transform as defaultTransform,
} from '../util/defaultComponents'
import { getComponent, setComponent } from '../component'
import { CollideBox } from '../type'
import { componentName } from '../component'
import { InternalInitialState, Transform } from '..'
import { getState } from '../util/state'

describe('collide', () => {
  it('detect collisions box-box', () => {
    const entity1 = createEntity({ name: 'e1' })
    const entity2 = createEntity({ name: 'e2' })
    const entity3 = createEntity({ name: 'e3' })

    let state = setEntity({
      entity: entity1,
      state: getState({}),
    })
    state = setEntity({ entity: entity2, state })
    state = setEntity({ entity: entity3, state })

    state = setComponent<Transform, InternalInitialState>({
      state,
      data: defaultTransform({
        fromParentPosition: vector(0, 0),
        entity: entity1,
      }),
    })
    state = setComponent<Transform, InternalInitialState>({
      state,
      data: defaultTransform({
        fromParentPosition: vector(1, 19),
        entity: entity2,
      }),
    })
    state = setComponent<Transform, InternalInitialState>({
      state,
      data: defaultTransform({
        fromParentPosition: vector(3.5, 3.5),
        entity: entity3,
      }),
    })

    state = setComponent<CollideBox, InternalInitialState>({
      state,
      data: defaultCollideBox({
        entity: entity1,
        size: vector(1.5, 1.5),
        position: vector(1, 1),
      }),
    })
    state = setComponent<CollideBox, InternalInitialState>({
      state,
      data: defaultCollideBox({
        entity: entity2,
        size: vector(1, 1),
        position: vector(0, 0),
      }),
    })
    state = setComponent<CollideBox, InternalInitialState>({
      state,
      data: defaultCollideBox({
        entity: entity3,
        size: vector(1, 1),
        position: vector(-1, -1),
      }),
    })

    state = runOneFrame({ state })

    const collisions1 = getComponent<CollideBox>({
      name: componentName.collideBox,
      state,
      entity: entity1,
    })?.collisions
    const collisions2 = getComponent<CollideBox>({
      name: componentName.collideBox,
      state,
      entity: entity2,
    })?.collisions
    const collisions3 = getComponent<CollideBox>({
      name: componentName.collideBox,
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
})
