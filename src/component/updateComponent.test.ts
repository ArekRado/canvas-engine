import { getState } from '../util/state'
import { generateEntity } from '../entity/generateEntity'
import { createEntity } from '../entity/createEntity'
import { createComponent } from './createComponent'
import { updateComponent } from './updateComponent'
import { createSystem } from '../system/createSystem'

describe('updateComponent', () => {
  it('should be fast', () => {
    const entity = generateEntity()
    const name = 'test'

    let state = createEntity({
      entity,
      state: getState({}),
    })

    state = createSystem({
      state,
      name,
      componentName: name,
      update: ({ state }) => state,
      create: ({ state }) => state,
    })

    state = createComponent({
      state,
      entity,
      name,
      data: {
        value: 1,
      },
    })

    state = updateComponent({
      state,
      entity,
      name,
      update: () => ({}),
    })

    const length = 20
    let deltas = 0
    Array.from({ length }, () => {
      const timeBefore = performance.now()

      for (let i = 0; i < 1000; i++) {
        state = updateComponent({
          state,
          entity,
          name,
          update: () => ({ value: 2 }),
        })
      }

      const timeAfter = performance.now()
      const delta = timeAfter - timeBefore

      deltas += delta
    })

    console.log('avg delta:', deltas / length)
    // 2.138865000000044
    // 2.74191000000003
    // 2.0953449999999973
    // 2.5665999999999713
    // 2.2374700000000076
  })
})
