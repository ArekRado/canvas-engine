import 'regenerator-runtime/runtime'
import { initialState, initialStateWithDisabledDraw } from '../util/state'
import { setEntity, createEntity } from '../entity'
import { runOneFrame } from '../util/runOneFrame'
import { componentName, removeComponent, setComponent } from '../component'
import { defaultData, initializeEngine } from '..'

describe('camera', () => {
  it('should pass through camera render lifecycle without any errors', () => {
    let state = initializeEngine({ state: initialStateWithDisabledDraw })

    state = runOneFrame({ state, timeNow: 20 })

    expect(state.camera).toEqual(initialState.camera)
  })
})
