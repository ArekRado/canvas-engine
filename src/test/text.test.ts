import 'regenerator-runtime/runtime'
import { initialState } from '../util/state'
import { setEntity, createEntity } from '../entity'
import { runOneFrame } from '../util/runOneFrame'
import { componentName, removeComponent, setComponent } from '../component'
import { defaultData } from '..'

describe('text', () => {
  it('should pass through text render lifecycle without any errors', () => {
    expect(() => {
      const entity = createEntity('e')

      let state = setEntity({
        entity,
        state: initialState,
      })

      state = setComponent(componentName.text, {
        state,
        data: defaultData.text({ entityId: entity.id }),
      })

      state = runOneFrame({ state, timeNow: 0 })
      state = runOneFrame({ state, timeNow: 10 })

      state = removeComponent(componentName.text, {
        state,
        entityId: entity.id,
      })

      state = runOneFrame({ state, timeNow: 20 })
    }).not.toThrow()
  })
})
