import 'regenerator-runtime/runtime'
import { getInitialState } from '../util/state'
import { runOneFrame } from '../util/runOneFrame'
import { initializeEngine } from '..'
import { getCamera, setCamera } from '../system/cameraSystem'

describe('camera', () => {
  it('should pass through camera render lifecycle without any errors', () => {
    let state = initializeEngine({ state: getInitialState({}) })

    state = setCamera({ state, data: {} })
    state = runOneFrame({ state })
    const camera = getCamera({ state })

    expect(camera).toEqual(getCamera({ state: getInitialState({}) }))
  })
})
