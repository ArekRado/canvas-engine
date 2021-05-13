import 'regenerator-runtime/runtime'
import { initialState } from '../util/state'
import { setEntity, createEntity } from '../entity'
import { runOneFrame } from '../util/runOneFrame'
import { componentName, removeComponent, setComponent } from '../component'
import { defaultData } from '..'

describe('primitive', () => {
  it('should pass through primitive render lifecycle without any errors', () => {
    expect(() => {
      const entity = createEntity('e')

      let state = setEntity({
        entity,
        state: initialState,
      })

      state = setComponent(componentName.line, {
        state,
        data: defaultData.line({ entityId: entity.id }),
      })

      state = setComponent(componentName.rectangle, {
        state,
        data: defaultData.rectangle({ entityId: entity.id }),
      })

      state = setComponent(componentName.ellipse, {
        state,
        data: defaultData.ellipse({ entityId: entity.id }),
      })

      state = runOneFrame({ state, timeNow: 0 })
      state = runOneFrame({ state, timeNow: 10 })

      state = removeComponent(componentName.line, {
        state,
        entityId: entity.id,
      })

      state = removeComponent(componentName.rectangle, {
        state,
        entityId: entity.id,
      })

      state = removeComponent(componentName.ellipse, {
        state,
        entityId: entity.id,
      })

      state = runOneFrame({ state, timeNow: 20 })
    }).not.toThrow()
  })
})
