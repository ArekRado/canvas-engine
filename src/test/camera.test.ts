import 'regenerator-runtime/runtime'
import { initialState } from '../util/state'
import { setEntity, createEntity } from '../entity'
import { runOneFrame } from '../util/runOneFrame'
import { componentName, removeComponent, setComponent } from '../component'
import { defaultData } from '..'

describe('camera', () => {
  it('should pass through camera render lifecycle without any errors', () => {
    let state = runOneFrame({ state: initialState, timeNow: 20 })

    expect(state.camera).toEqual(initialState.camera)
  })
})
