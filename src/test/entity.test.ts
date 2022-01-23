import 'regenerator-runtime/runtime'
import { getState } from '../util/state'

import { setEntity, removeEntity, createEntity } from '../entity'
import {
  collideCircle as defaultCollideCircle,
  collideBox as defaultCollideBox,
  animation,
} from '../util/defaultComponents'
import { setComponent } from '../component'
import { CollideBox, CollideCircle, Animation } from '../type'
import { InternalInitialState } from '..'

describe('entity', () => {
  it('remove - should remove components by entity', () => {
    const entity = createEntity({ name: 'test' })
    let state = setEntity({ state: getState({}), entity })

    state = setComponent<Animation.AnimationComponent, InternalInitialState>({
      state,
      data: animation({ entity }),
    })
    state = setComponent<CollideBox, InternalInitialState>({
      state,
      data: defaultCollideBox({ entity }),
    })
    state = setComponent<CollideCircle, InternalInitialState>({
      state,
      data: defaultCollideCircle({ entity }),
    })

    expect(state.entity[entity]).toEqual(entity)
    expect(state.component.animation[entity]).toBeDefined()
    expect(state.component.collideBox[entity]).toBeDefined()
    expect(state.component.collideCircle[entity]).toBeDefined()

    const stateWithoutEntity = removeEntity<InternalInitialState>({
      state,
      entity,
    })

    expect(stateWithoutEntity.entity[entity]).not.toBeDefined()
    expect(stateWithoutEntity.component.animation[entity]).not.toBeDefined()
    expect(stateWithoutEntity.component.collideBox[entity]).not.toBeDefined()
    expect(stateWithoutEntity.component.collideCircle[entity]).not.toBeDefined()
  })

  // TODO - why do we want to update entity?
  // it('set - should set and update entity', () => {
  //   const entity = createEntity('test', { rotation: 1 })
  //   const v1 = setEntity({ state: getState({}), entity })

  //   expect(v1.entity[entity]).toEqual(entity)
  //   expect(v1.entity[entity].rotation).toBe(1)

  //   const v2 = setEntity({
  //     state: v1,
  //     entity: { ...entity, rotation: 2 },
  //   })

  //   expect(v2.entity[entity].rotation).toBe(2)
  // })
})
