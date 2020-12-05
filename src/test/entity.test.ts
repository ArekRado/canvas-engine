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
  defaultTransform,
} from '../util/defaultComponents'
import { setComponent } from '../component'
import { componentName } from '../component'

describe('entity', () => {
  it('remove - should remove components by entity', () => {
    const entity = generate('test')
    const v1 = setEntity({ state: initialStateWithDisabledDraw, entity })

    const v2 = setComponent({
      name: componentName.animation,
      state: v1,
      data: defaultAnimation({ entity }),
    })
    const v3 = setComponent({
      name: componentName.collideBox,
      state: v2,
      data: defaultCollideBox({ entity }),
    })
    const v4 = setComponent({
      name: componentName.collideCircle,
      state: v3,
      data: defaultCollideCircle({ entity }),
    })
    const v5 = setComponent({
      name: componentName.sprite,
      state: v4,
      data: defaultSprite({ entity }),
    })
    const state = setComponent({
      name: componentName.transform,
      state: v5,
      data: defaultTransform({ entity }),
    })

    expect(state.entity[0]).toBe(entity)
    expect(state.component.transform[entity.id]).toBeDefined()
    expect(state.component.sprite[entity.id]).toBeDefined()
    expect(state.component.animation[entity.id]).toBeDefined()
    expect(state.component.collideBox[entity.id]).toBeDefined()
    expect(state.component.collideCircle[entity.id]).toBeDefined()

    const stateWithoutEntity = removeEntity({
      state,
      entity,
    })

    expect(stateWithoutEntity.entity[0]).not.toBeDefined()
    expect(stateWithoutEntity.component.transform[entity.id]).not.toBeDefined()
    expect(stateWithoutEntity.component.sprite[entity.id]).not.toBeDefined()
    expect(stateWithoutEntity.component.animation[entity.id]).not.toBeDefined()
    expect(stateWithoutEntity.component.collideBox[entity.id]).not.toBeDefined()
    expect(
      stateWithoutEntity.component.collideCircle[entity.id],
    ).not.toBeDefined()
  })
})
