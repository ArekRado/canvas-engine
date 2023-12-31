import { getState } from '../util/state'
import { describe, it, expect } from 'vitest'

import { createEntity } from './createEntity'
import { removeEntity } from './removeEntity'
import { generateEntity } from './generateEntity'
import { createComponent } from '../component/createComponent'
import {
  InternalInitialState,
  Keyboard,
  Mouse,
  defaultKeyboard,
  defaultMouse,
} from '../index'
import { componentName } from '../component/componentName'

describe('entity', () => {
  it('remove - should remove components by entity', () => {
    const entity = generateEntity()
    let state = createEntity({ state: getState(), entity })

    state = createComponent<Keyboard, InternalInitialState>({
      state,
      entity,
      name: componentName.keyboard,
      data: defaultKeyboard({}),
    })
    state = createComponent<Mouse, InternalInitialState>({
      state,
      entity,
      name: componentName.mouse,
      data: defaultMouse({}),
    })

    expect(state.entity.get(entity)).toEqual(entity)
    expect(state.component.keyboard.get(entity)).toBeDefined()
    expect(state.component.mouse.get(entity)).toBeDefined()

    const stateWithoutEntity = removeEntity<InternalInitialState>({
      state,
      entity,
    })

    expect(stateWithoutEntity.entity.get(entity)).not.toBeDefined()
    expect(stateWithoutEntity.component.keyboard.get(entity)).not.toBeDefined()
    expect(stateWithoutEntity.component.mouse.get(entity)).not.toBeDefined()
  })
})
