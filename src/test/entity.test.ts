import 'regenerator-runtime/runtime'
import { initialStateWithDisabledDraw } from '../util/state'

import {
  setEntity,
  removeEntity,
  generateEntity,
} from '../util/entity'
import {
  defaultAnimation,
  defaultCollideBox,
  defaultCollideCircle,
  defaultSprite,
} from '../util/defaultComponents'
import { setComponent } from '../component'
import { componentName } from '../component'
import {
  CollideBox,
  Animation,
  CollideCircle,
  Sprite,
} from '../type'

describe('entity', () => {
  it('remove - should remove components by entity', () => {
    const entity = generateEntity('test')
    const entityId = entity.id
    const v1 = setEntity({ state: initialStateWithDisabledDraw, entity })

    const v2 = setComponent<Animation>(componentName.animation, {
      state: v1,
      data: defaultAnimation({ entityId }),
    })
    const v3 = setComponent<CollideBox>(componentName.collideBox, {
      state: v2,
      data: defaultCollideBox({ entityId }),
    })
    const v4 = setComponent<CollideCircle>(componentName.collideCircle, {
      state: v3,
      data: defaultCollideCircle({ entityId }),
    })
    const state = setComponent<Sprite>(componentName.sprite, {
      state: v4,
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
    const entity = generateEntity('test', { rotation: 1 })
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
