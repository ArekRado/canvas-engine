import { getState } from '../util/state'
import { runOneFrame } from '../util/runOneFrame'
import { getCamera, setCamera } from '../system/camera'

describe('camera', () => {
  it('should pass through camera render lifecycle without any errors', () => {
    let state = getState({})

    state = setCamera({ state, data: {} })
    state = runOneFrame({ state })
    const camera = getCamera({ state })

    expect(camera).toEqual(getCamera({ state: getState({}) }))
  })
})
