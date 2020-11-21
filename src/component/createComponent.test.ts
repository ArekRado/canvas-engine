import 'regenerator-runtime/runtime'
import { vector } from '@arekrado/vector-2d'
import { defaultAnimation, defaultTransform } from '../util/defaultComponents'
import { getActiveKeyframe } from '../system/animation'
import { generate, set as setEntity } from '../util/entity'
import { State } from '../type'
import { initialState } from '../util/initialState'
import { animation } from './animation'
import { transform } from './transform'
import { runOneFrame } from '../util/runOneFrame'
import { createSystem } from '../system/createSystem'
import { createComponent } from './createComponent'

describe('createComponent', () => {
  it('should call "create" method for proper system when component has been created', () => {
  //   const create = jest.fn()
  //   const tick = jest.fn()
  //   const remove = jest.fn()

  //   const v1 = createSystem({
  //     name: 'test',
  //     state: initialState,
  //     create,
  //     tick,
  //     remove,
  //   })

  //   const v2 = createComponent({
  //     name: 'test',
  //     state: v1,
  //   })

  //   expect(keyframeCurrentTime).toBe(0)
  //   expect(keyframeIndex).toBe(0)
  })
})
