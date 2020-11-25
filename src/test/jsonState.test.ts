import 'regenerator-runtime/runtime'
import { initialStateWithDisabledDraw } from '../util/initialState'
import { jsonToState, stateToJson } from '../util/jsonState'

describe('jsonState', () => {
  it('jsonToState ', () => {
    const jsonString = stateToJson(initialStateWithDisabledDraw)
    const state = jsonToState(jsonString, initialStateWithDisabledDraw)

    expect(state.entity).toMatchSnapshot()
    expect(state.component).toMatchSnapshot()
    expect(state.time).toMatchSnapshot()
    expect(state.asset).toMatchSnapshot()
    expect(state.mouse).toMatchSnapshot()
    expect(state.isDebugInitialized).toMatchSnapshot()
    expect(state.isDrawEnabled).toMatchSnapshot()
  })

  it('jsonToState', () => {
    const jsonString = stateToJson(initialStateWithDisabledDraw)

    expect(jsonString).toMatchSnapshot()
  })
})
