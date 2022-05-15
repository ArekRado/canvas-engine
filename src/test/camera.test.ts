import { getState } from '../util/state'
import { runOneFrame } from '../util/runOneFrame'
import { updateComponent } from '../component/updateComponent'
import { cameraEntity } from '../system/camera/camera'
import { componentName } from '../component/componentName'
import { getComponent } from '../component/getComponent'
import { Camera } from '../type'

describe('camera', () => {
  it('should pass through camera render lifecycle without any errors', () => {
    let state = getState({})

    state = updateComponent({
      state,
      entity: cameraEntity,
      name: componentName.camera,
      update: () => ({}),
    })
    state = runOneFrame({ state })
    const camera = getComponent<Camera>({
      state,
      entity: cameraEntity,
      name: componentName.camera,
    })

    expect(camera).toEqual(
      getComponent({
        state: getState({}),
        entity: cameraEntity,
        name: componentName.camera,
      }),
    )
  })
})
