import 'regenerator-runtime/runtime'
import { getInitialState } from '../util/state'
import { createGlobalSystem } from '../system/createSystem'
import { State } from '../type'

describe('createGlobalSystem', () => {
  it('should not call create method when system is creating', () => {
    const initialize = jest.fn<State, [{ state: State }]>(({ state }) => state)
    const create = jest.fn<State, [{ state: State }]>(({ state }) => state)
    const remove = jest.fn<State, [{ state: State }]>(({ state }) => state)
    const tick = jest.fn<State, [{ state: State }]>(({ state }) => state)

    createGlobalSystem({
      state: getInitialState({}),
      name: 'test',
      initialize,
      create,
      tick,
    })

    expect(initialize).not.toHaveBeenCalled()
    expect(create).not.toHaveBeenCalled()
    expect(remove).not.toHaveBeenCalled()
    expect(tick).not.toHaveBeenCalled()
  })
})
