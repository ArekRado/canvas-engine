import { getState } from '../util/state'

import { createEntity } from './createEntity'
import { removeEntity } from './removeEntity'
import { generateEntity } from './generateEntity'
import { defaultCollider, defaultAnimation } from '../util/defaultComponents'
import { createComponent } from '../component/createComponent'
import { Animation, Collider } from '../type'
import { InternalInitialState } from '../index'
import { componentName } from '../component/componentName'

describe('entity', () => {
  it('remove - should remove components by entity', () => {
    const entity = generateEntity()
    let state = createEntity({ state: getState({}), entity })

    state = createComponent<Animation.AnimationComponent, InternalInitialState>({
      state,
      entity,
      name: componentName.animation,
      data: defaultAnimation({}),
    })
    state = createComponent<Collider, InternalInitialState>({
      state,
      entity,
      name: componentName.collider,
      data: defaultCollider({}),
    })

    expect(state.entity[entity]).toEqual(entity)
    expect(state.component.animation[entity]).toBeDefined()
    expect(state.component.collider[entity]).toBeDefined()

    const stateWithoutEntity = removeEntity<InternalInitialState>({
      state,
      entity,
    })

    expect(stateWithoutEntity.entity[entity]).not.toBeDefined()
    expect(stateWithoutEntity.component.animation[entity]).not.toBeDefined()
    expect(stateWithoutEntity.component.collider[entity]).not.toBeDefined()
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
