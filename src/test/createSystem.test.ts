import 'regenerator-runtime/runtime'
import { getState } from '../util/state'
import { createGlobalSystem } from '../system/createSystem'
import { InternalInitialState, runOneFrame } from '..'

describe('createGlobalSystem', () => {
  it('should not call create method when system is creating', () => {
    const remove = jest.fn<
      InternalInitialState,
      [{ state: InternalInitialState }]
    >(({ state }) => state)
    const tick = jest.fn<
      InternalInitialState,
      [{ state: InternalInitialState }]
    >(({ state }) => state)

    createGlobalSystem({
      state: getState({}),
      name: 'test',
      tick,
    })

    expect(remove).not.toHaveBeenCalled()
    expect(tick).not.toHaveBeenCalled()
  })

  it('should trigger tick after runOneFrame', () => {
    const tick = jest.fn<
      InternalInitialState,
      [{ state: InternalInitialState }]
    >(({ state }) => state)

    let state = createGlobalSystem({
      state: getState({}),
      name: 'test',
      tick,
    })

    runOneFrame({ state })

    expect(tick).toHaveBeenCalled()
  })

  it.todo('test priority')
})
