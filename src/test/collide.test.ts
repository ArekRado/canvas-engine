import { vector } from '@arekrado/vector-2d'
import { createEntity } from '../entity/createEntity'
import { generateEntity } from '../entity/generateEntity'
import { runOneFrame } from '../util/runOneFrame'
import { defaultCollideBox, defaultTransform } from '../util/defaultComponents'
import { setComponent } from '../component/setComponent'
import { getComponent } from '../component/getComponent'
import { componentName } from '../component/componentName'

import { CollideBox } from '../type'
import { InternalInitialState, Transform } from '../index'
import { getState } from '../util/state'

describe('collide', () => {
  it('detect collisions box-box', () => {
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

    state = setComponent<CollideBox, InternalInitialState>({
      state,
      entity: entity1,
      name: componentName.collideBox,
      data: defaultCollideBox({
        size: vector(1.5, 1.5),
        position: vector(1, 1),
      }),
    })
    state = setComponent<CollideBox, InternalInitialState>({
      state,
      entity: entity2,
      name: componentName.collideBox,
      data: defaultCollideBox({
        size: vector(1, 1),
        position: vector(0, 0),
      }),
    })
    state = setComponent<CollideBox, InternalInitialState>({
      state,
      entity: entity3,
      name: componentName.collideBox,
      data: defaultCollideBox({
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
