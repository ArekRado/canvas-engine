import { describe, it, expect } from 'vitest'

import { createEntity } from './createEntity'
import { removeEntity } from './removeEntity'
import { generateEntity } from './generateEntity'
import { createComponent } from '../component/createComponent'
import { EmptyState } from '../index'
import { getEmptyState } from '../util/state'

describe('entity', () => {
  it('remove - should remove components by entity', () => {
    const entity = generateEntity()

    const state = getEmptyState()
    createEntity(state, entity)

    createComponent<string, EmptyState>(state, 'keyboard', entity, '')
    createComponent<string, EmptyState>(state, 'mouse', entity, '')

    expect(state.entity.get(entity)).toEqual(entity)
    expect(state.component.keyboard.get(entity)).toBeDefined()
    expect(state.component.mouse.get(entity)).toBeDefined()

    removeEntity<EmptyState>(state, entity)

    expect(state.entity.get(entity)).not.toBeDefined()
    expect(state.component.keyboard.get(entity)).not.toBeDefined()
    expect(state.component.mouse.get(entity)).not.toBeDefined()
  })
})
