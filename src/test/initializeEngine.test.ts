import 'regenerator-runtime/runtime'
import { initialStateWithDisabledDraw } from '../util/state'
import { createGlobalSystem, createSystem, initializeEngine, State } from '..'

describe('initializeEngine', () => {
  it('should return state with regl', () => {
    expect(initialStateWithDisabledDraw.regl).toBeUndefined()

    const state = initializeEngine({
      state: initialStateWithDisabledDraw,
    })

    expect(state.regl).toBeDefined()
  })

  it('should call initialize method in global systems', () => {
    const globalSystemInitialize = jest.fn<State, [{ state: State }]>(
      ({ state }) => state,
    )
    const systemInitialize = jest.fn<State, [{ state: State }]>(
      ({ state }) => state,
    )

    expect(globalSystemInitialize).not.toHaveBeenCalled()
    expect(systemInitialize).not.toHaveBeenCalled()

    let state = createGlobalSystem({
      state: initialStateWithDisabledDraw,
      name: 'globalSystem',
      initialize: globalSystemInitialize,
    })

    state = createSystem({
      state,
      name: 'system',
      initialize: systemInitialize,
    })

    state = initializeEngine({
      state,
    })

    expect(globalSystemInitialize).toHaveBeenCalled()
    expect(systemInitialize).toHaveBeenCalled()
  })
})
