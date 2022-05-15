import { getState } from '../util/state'

import { createEntity } from '../entity/createEntity'
import { removeEntity } from '../entity/removeEntity'
import { generateEntity } from '../entity/generateEntity'
import {
  defaultCollideCircle,
  defaultCollideBox,
  defaultAnimation,
} from '../util/defaultComponents'
import { setComponent } from '../component/setComponent'
import { CollideBox, CollideCircle, Animation } from '../type'
import { InternalInitialState } from '../index'
import { componentName } from '../component/componentName'

describe('entity', () => {
  it('remove - should remove components by entity', () => {
    const entity = generateEntity()
    let state = createEntity({ state: getState({}), entity })

    state = setComponent<Animation.AnimationComponent, InternalInitialState>({
      state,
      entity,
      name: componentName.animation,
      data: defaultAnimation({}),
    })
    state = setComponent<CollideBox, InternalInitialState>({
      state,
      entity,
      name: componentName.collideBox,
      data: defaultCollideBox({}),
    })
    state = setComponent<CollideCircle, InternalInitialState>({
      state,
      entity,
      name: componentName.collideCircle,
      data: defaultCollideCircle({}),
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
  //   const entity = generateEntity('test', { rotation: 1 })
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
