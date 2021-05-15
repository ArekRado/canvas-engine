import 'regenerator-runtime/runtime'
import { initialState } from '../util/state'
import { setEntity, createEntity } from '../entity'
import { runOneFrame } from '../util/runOneFrame'
import {
  componentName,
  getComponent,
  removeComponent,
  setComponent,
} from '../component'
import { defaultData } from '..'
import { Sprite } from '../type'

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

describe('sprite', () => {
  it('should pass through sprite render lifecycle without any errors', () => {
    expect(() => {
      const entity = createEntity('e')

      let state = setEntity({
        entity,
        state: initialState,
      })

      state = setComponent(componentName.sprite, {
        state,
        data: defaultData.sprite({ entityId: entity.id }),
      })

      state = runOneFrame({ state, timeNow: 0 })
      state = runOneFrame({ state, timeNow: 10 })

      state = removeComponent(componentName.sprite, {
        state,
        entityId: entity.id,
      })
      state = runOneFrame({ state, timeNow: 20 })
    }).not.toThrow()
  })

  it('should create new texture and attach it to sprite', async () => {
    global.Image = class {
      constructor() {
        setTimeout(() => {
          ;(this as any).onload() // simulate success
        }, 0)
      }
    } as any

    const entity = createEntity('e')

    let state = setEntity({
      entity,
      state: initialState,
    })

    state = setComponent(componentName.sprite, {
      state,
      data: defaultData.sprite({
        src:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=',
        entityId: entity.id,
      }),
    })

    await wait(5)

    state = runOneFrame({ state, timeNow: 20 })

    const sprite = getComponent<Sprite>(componentName.sprite, {
      entityId: entity.id,
      state,
    })

    expect(sprite?.texture).toBeDefined()
  })
})
