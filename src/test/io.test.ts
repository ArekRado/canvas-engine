import 'regenerator-runtime/runtime'
import { initialStateWithDisabledDraw } from '../util/state'
import { runOneFrame } from '../util/runOneFrame'
import { createInitialize } from '../system/io'
import { vector, vectorZero } from '@arekrado/vector-2d'

describe('io', () => {
  let mousemoveCallback: Function
  let mouseenterCallback: Function
  let mouseleaveCallback: Function
  let mouseupCallback: Function
  let mousedownCallback: Function

  beforeEach(() => {
    mousemoveCallback = () => {}
    mouseenterCallback = () => {}
    mouseleaveCallback = () => {}
    mouseupCallback = () => {}
    mousedownCallback = () => {}

    createInitialize('', {
      document: {
        getElementById: () => ({
          getBoundingClientRect: () => ({ left: 0, top: 0 }),
          addEventListener: (
            type: keyof HTMLElementEventMap,
            callback: Function,
          ) => {
            switch (type) {
              case 'mousemove':
                mousemoveCallback = callback
                break
              case 'mouseenter':
                mouseenterCallback = callback
                break
              case 'mouseleave':
                mouseleaveCallback = callback
                break
              case 'mouseup':
                mouseupCallback = callback
                break
              case 'mousedown':
                mousedownCallback = callback
                break
            }
          },
        }),
      },
    })
  })

  it('should set buttons on mousedown event', () => {
    const v1 = runOneFrame({
      state: initialStateWithDisabledDraw,
      timeNow: 0,
    })

    expect(v1.mouse.buttons).toBe(0)

    mousedownCallback({ buttons: 1 })

    const v2 = runOneFrame({
      state: v1,
      timeNow: 0,
    })

    expect(v2.mouse.buttons).toBe(1)

    const v3 = runOneFrame({
      state: v2,
      timeNow: 0,
    })

    // Next tick should reset buttons
    expect(v3.mouse.buttons).toBe(0)
  })

  it('should set mouse position on mousemove event', () => {
    const v1 = runOneFrame({
      state: initialStateWithDisabledDraw,
      timeNow: 0,
    })

    expect(v1.mouse.position).toEqual(vectorZero())

    mousemoveCallback({ pageX: 1, pageY: 1 })

    const v2 = runOneFrame({
      state: v1,
      timeNow: 0,
    })

    expect(v2.mouse.position).toEqual(vector(1, 1))
  })
})
