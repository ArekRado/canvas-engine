import 'regenerator-runtime/runtime'
import { initialState } from '../util/initialState'
import { jsonToState, stateToJson } from '../util/jsonState'

describe('jsonState', () => {
  it('jsonToState ', () => {
    const jsonString = stateToJson(initialState)
    const state = jsonToState(jsonString, initialState)

    expect(state.entity).toMatchSnapshot()
    expect(state.component).toMatchSnapshot()
    expect(state.time).toMatchSnapshot()
    expect(state.asset).toMatchSnapshot()
    expect(state.mouse).toMatchSnapshot()
    expect(state.isDebugInitialized).toMatchSnapshot()
    expect(state.isDrawEnabled).toMatchSnapshot()
  })

  it('jsonToState', () => {
    const jsonString = stateToJson(initialState)

    expect(jsonString).toMatchSnapshot()
  })
})
