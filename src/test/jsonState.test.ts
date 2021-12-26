import 'regenerator-runtime/runtime'
import { getInitialState } from '../util/state'
import { jsonToState, stateToJson } from '../util/jsonState'
import { setTime } from '../system/time'

describe('jsonState', () => {
  it('jsonToState ', () => {
    let state = setTime({
      state: getState({}),
      data: {
        timeNow: 0,
        previousTimeNow: 0,
      },
    })
    const jsonString = stateToJson(state)
    state = jsonToState(jsonString, state)

    expect(state.entity).toMatchSnapshot()
    expect(state.component).toMatchSnapshot()
    expect(state.isDebugInitialized).toMatchSnapshot()
    expect(state.isDrawEnabled).toMatchSnapshot()
  })

  it('jsonToState', () => {
    let state = setTime({
      state: getState({}),
      data: {
        timeNow: 0,
        previousTimeNow: 0,
      },
    })
    const jsonString = stateToJson(state)

    expect(jsonString).toMatchSnapshot()
  })
})
