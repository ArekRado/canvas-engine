import { describe, it, expect } from 'vitest'

import { createEntity } from './createEntity'
import { removeEntity } from './removeEntity'
import { generateEntity } from './generateEntity'
import { createComponent } from '../component/createComponent'
import {
  InitialState,
  Keyboard,
  Mouse,
} from '../index'
import { componentName } from '../component/componentName'
import { defaultKeyboard, defaultMouse } from '../util/defaultComponents'
import { getInitialStateWithSystems } from '../util/state'

describe('entity', () => {
  it('remove - should remove components by entity', () => {
    const entity = generateEntity()
    let state = createEntity(getInitialStateWithSystems(), entity)

    state = createComponent<Keyboard, InitialState>(
      state,
      componentName.keyboard,
      entity,
      defaultKeyboard({}),
    )
    state = createComponent<Mouse, InitialState>(
      state,
      componentName.mouse,
      entity,
      defaultMouse({}),
    )

    expect(state.entity.get(entity)).toEqual(entity)
    expect(state.component.keyboard.get(entity)).toBeDefined()
    expect(state.component.mouse.get(entity)).toBeDefined()

    const stateWithoutEntity = removeEntity<InitialState>(state, entity)

    expect(stateWithoutEntity.entity.get(entity)).not.toBeDefined()
    expect(stateWithoutEntity.component.keyboard.get(entity)).not.toBeDefined()
    expect(stateWithoutEntity.component.mouse.get(entity)).not.toBeDefined()
  })
})
