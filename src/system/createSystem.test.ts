import { getState } from '../util/state'
import { createGlobalSystem } from './createSystem'
import { runOneFrame } from '../util/runOneFrame'
import { vi } from 'vitest'

describe('createGlobalSystem', () => {
  it('should not call create method when system is creating', () => {
    const remove = vi.fn(({ state }) => state)
    const tick = vi.fn(({ state }) => state)

    createGlobalSystem({
      state: getState(),
      name: 'test',
      tick,
    })

    expect(remove).not.toHaveBeenCalled()
    expect(tick).not.toHaveBeenCalled()
  })

  it('should trigger tick after runOneFrame', () => {
    const tick = vi.fn(({ state }) => state)

    const state = createGlobalSystem({
      state: getState(),
      name: 'test',
      tick,
    })

    runOneFrame({ state })

    expect(tick).toHaveBeenCalled()
  })
})

describe('createSystem', () => {
  it.todo('should call update method when setState is called')

  it.todo('test priority')
})
