import 'regenerator-runtime/runtime'
import { getInitialState } from '../util/state'
import { runOneFrame } from '../util/runOneFrame'
import { initializeEngine } from '..'
import { setTime } from '../system/time'

describe('camera', () => {
  it('should pass through camera render lifecycle without any errors', () => {
    let state = initializeEngine({ state: getInitialState({}) })

    state = setTime({ timeNow: 20 })
    state = runOneFrame({ state })

    expect(state.camera).toEqual(getInitialState({}).camera)
  })
})
