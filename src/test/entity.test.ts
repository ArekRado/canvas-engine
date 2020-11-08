import 'regenerator-runtime/runtime'
import { initialState } from '../main'
import {
  animation,
  collideBox,
  collideCircle,
  fieldNumber,
  fieldString,
  fieldVector,
  sprite,
  transform,
} from '../component'
import {
  set as setEntity,
  remove as removeEntity,
  generate,
} from '../util/entity'
import {
  defaultAnimation,
  defaultCollideBox,
  defaultCollideCircle,
  defaultFieldNumber,
  defaultFieldString,
  defaultFieldVector,
  defaultSprite,
  defaultTransform,
} from '../util/defaultComponents'

describe('entity', () => {
  it('remove - should remove components by entity', () => {
    const entity = generate('test')
    const v1 = setEntity({ state: initialState, entity })

    const v2 = animation.set({
      state: v1,
      data: defaultAnimation({ entity, name: '' }),
    })
    const v3 = collideBox.set({
      state: v2,
      data: defaultCollideBox({ entity, name: '' }),
    })
    const v4 = collideCircle.set({
      state: v3,
      data: defaultCollideCircle({ entity, name: '' }),
    })
    const v5 = fieldNumber.set({
      state: v4,
      data: defaultFieldNumber({ entity, name: '' }),
    })
    const v6 = fieldString.set({
      state: v5,
      data: defaultFieldString({ entity, name: '' }),
    })
    const v7 = fieldVector.set({
      state: v6,
      data: defaultFieldVector({ entity, name: '' }),
    })
    const v8 = sprite.set({
      state: v7,
      data: defaultSprite({ entity, name: '' }),
    })
    const state = transform.set({
      state: v8,
      data: defaultTransform({ entity, name: '' }),
    })

    expect(state.entity[0]).toBe(entity)
    expect(state.component.transform[entity]).toBeDefined()
    expect(state.component.sprite[entity]).toBeDefined()
    expect(state.component.animation[entity]).toBeDefined()
    expect(state.component.collideBox[entity]).toBeDefined()
    expect(state.component.collideCircle[entity]).toBeDefined()
    expect(state.component.fieldNumber[entity]).toBeDefined()
    expect(state.component.fieldString[entity]).toBeDefined()
    expect(state.component.fieldVector[entity]).toBeDefined()

    const stateWithoutEntity = removeEntity({
      state,
      entity,
    })

    expect(stateWithoutEntity.entity[0]).not.toBeDefined()
    expect(stateWithoutEntity.component.transform[entity]).not.toBeDefined()
    expect(stateWithoutEntity.component.sprite[entity]).not.toBeDefined()
    expect(stateWithoutEntity.component.animation[entity]).not.toBeDefined()
    expect(stateWithoutEntity.component.collideBox[entity]).not.toBeDefined()
    expect(stateWithoutEntity.component.collideCircle[entity]).not.toBeDefined()
    expect(stateWithoutEntity.component.fieldNumber[entity]).not.toBeDefined()
    expect(stateWithoutEntity.component.fieldString[entity]).not.toBeDefined()
    expect(stateWithoutEntity.component.fieldVector[entity]).not.toBeDefined()
  })
})
