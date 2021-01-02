import 'regenerator-runtime/runtime'
import { initialStateWithDisabledDraw } from '../util/state'

import {
  set as setEntity,
  remove as removeEntity,
  generate,
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
    const entity = generate('test')
    const v1 = setEntity({ state: initialStateWithDisabledDraw, entity })

    const v2 = setComponent<Animation>(componentName.animation, {
      state: v1,
      data: defaultAnimation({ entity }),
    })
    const v3 = setComponent<CollideBox>(componentName.collideBox, {
      state: v2,
      data: defaultCollideBox({ entity }),
    })
    const v4 = setComponent<CollideCircle>(componentName.collideCircle, {
      state: v3,
      data: defaultCollideCircle({ entity }),
    })
    const state = setComponent<Sprite>(componentName.sprite, {
      state: v4,
      data: defaultSprite({ entity }),
    })

    expect(state.entity[0]).toBe(entity)
    expect(state.component.sprite[entity.id]).toBeDefined()
    expect(state.component.animation[entity.id]).toBeDefined()
    expect(state.component.collideBox[entity.id]).toBeDefined()
    expect(state.component.collideCircle[entity.id]).toBeDefined()

    const stateWithoutEntity = removeEntity({
      state,
      entity,
    })

    expect(stateWithoutEntity.entity[0]).not.toBeDefined()
    expect(stateWithoutEntity.component.sprite[entity.id]).not.toBeDefined()
    expect(stateWithoutEntity.component.animation[entity.id]).not.toBeDefined()
    expect(stateWithoutEntity.component.collideBox[entity.id]).not.toBeDefined()
    expect(
      stateWithoutEntity.component.collideCircle[entity.id],
    ).not.toBeDefined()
  })

  it('set - should set and update entity', () => {
    const entity = generate('test', { rotation: 1 })
    const v1 = setEntity({ state: initialStateWithDisabledDraw, entity })

    expect(v1.entity[0]).toEqual(entity)
    expect(v1.entity[0].rotation).toBe(1)

    const v2 = setEntity({
      state: v1,
      entity: { ...entity, rotation: 2 },
    })

    expect(v2.entity[0].rotation).toBe(2)
  })
})
