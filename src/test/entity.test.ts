import 'regenerator-runtime/runtime'
import { initialStateWithDisabledDraw } from '../util/state'

import { setEntity, removeEntity, createEntity } from '../entity'
import {
  collideCircle as defaultCollideCircle,
  collideBox as defaultCollideBox,
  sprite as defaultSprite,
  animation as defaultAnimation,
} from '../util/defaultComponents'
import { setComponent } from '../component'
import { componentName } from '../component'
import { CollideBox, Animation, CollideCircle, Sprite } from '../type'

describe('entity', () => {
  it('remove - should remove components by entity', () => {
    const entity = createEntity('test')
    const entityId = entity.id
    let state = setEntity({ state: initialStateWithDisabledDraw, entity })

    state = setComponent<Animation>(componentName.animation, {
      state,
      data: defaultAnimation({ entityId }),
    })
    state = setComponent<CollideBox>(componentName.collideBox, {
      state,
      data: defaultCollideBox({ entityId }),
    })
    state = setComponent<CollideCircle>(componentName.collideCircle, {
      state,
      data: defaultCollideCircle({ entityId }),
    })
    state = setComponent<Sprite>(componentName.sprite, {
      state,
      data: defaultSprite({ entityId }),
    })

    expect(state.entity[entity.id]).toEqual(entity)
    expect(state.component.sprite[entityId]).toBeDefined()
    expect(state.component.animation[entityId]).toBeDefined()
    expect(state.component.collideBox[entityId]).toBeDefined()
    expect(state.component.collideCircle[entityId]).toBeDefined()

    const stateWithoutEntity = removeEntity({
      state,
      entityId,
    })

    expect(stateWithoutEntity.entity[entity.id]).not.toBeDefined()
    expect(stateWithoutEntity.component.sprite[entityId]).not.toBeDefined()
    expect(stateWithoutEntity.component.animation[entityId]).not.toBeDefined()
    expect(stateWithoutEntity.component.collideBox[entityId]).not.toBeDefined()
    expect(
      stateWithoutEntity.component.collideCircle[entityId],
    ).not.toBeDefined()
  })

  it('set - should set and update entity', () => {
    const entity = createEntity('test', { rotation: 1 })
    const v1 = setEntity({ state: initialStateWithDisabledDraw, entity })

    expect(v1.entity[entity.id]).toEqual(entity)
    expect(v1.entity[entity.id].rotation).toBe(1)

    const v2 = setEntity({
      state: v1,
      entity: { ...entity, rotation: 2 },
    })

    expect(v2.entity[entity.id].rotation).toBe(2)
  })
})
