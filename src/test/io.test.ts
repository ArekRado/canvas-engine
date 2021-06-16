import 'regenerator-runtime/runtime'
import { initialState, initialStateWithDisabledDraw } from '../util/state'
import { runOneFrame } from '../util/runOneFrame'
import { createInitialize } from '../system/io'
import { vector, vectorZero } from '@arekrado/vector-2d'

describe('io', () => {
  let mousemoveCallback: Function
  let mouseenterCallback: Function
  let mouseleaveCallback: Function
  let mouseupCallback: Function
  let mousedownCallback: Function
  let wheelCallback: Function
  let keyupCallback: Function
  let keydownCallback: Function

  beforeEach(() => {
    mousemoveCallback = () => {}
    mouseenterCallback = () => {}
    mouseleaveCallback = () => {}
    mouseupCallback = () => {}
    mousedownCallback = () => {}
    wheelCallback = () => {}
    keyupCallback = () => {}
    keydownCallback = () => {}

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
              case 'wheel':
                wheelCallback = callback
                break
            }
          },
        }),
        addEventListener: (
          type: keyof HTMLElementEventMap,
          callback: Function,
        ) => {
          switch (type) {
            case 'keyup':
              keyupCallback = callback
              break
            case 'keydown':
              keydownCallback = callback
              break
          }
        },
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

  it('should set keyboard isUp and isDown flags', () => {
    const key1 = 'a'
    const key2 = 'b'

    const v1 = runOneFrame({
      state: initialStateWithDisabledDraw,
      timeNow: 0,
    })

    expect(v1.keyboard[key1]).toBeUndefined()

    keydownCallback({ key: key1 })

    const v2 = runOneFrame({
      state: v1,
      timeNow: 0,
    })

    expect(v2.keyboard[key1]).toEqual({
      isDown: true,
      isUp: false,
      isPressed: true,
    })

    keydownCallback({ key: key2 })

    const v3 = runOneFrame({
      state: v2,
      timeNow: 0,
    })

    // runOneFrame should reset isDown
    expect(v3.keyboard[key1]).toEqual({
      isDown: false,
      isUp: false,
      isPressed: true,
    })
    expect(v3.keyboard[key2]).toEqual({
      isDown: true,
      isUp: false,
      isPressed: true,
    })

    keyupCallback({ key: key1 })

    const v4 = runOneFrame({
      state: v3,
      timeNow: 0,
    })

    expect(v4.keyboard[key1]).toEqual({
      isDown: false,
      isUp: true,
      isPressed: false,
    })
  })

  it('wheel', () => {
    let state = runOneFrame({
      state: initialStateWithDisabledDraw,
      timeNow: 0,
    })

    expect(state.mouse.wheel).toEqual(initialState.mouse.wheel)

    wheelCallback({
      deltaMode: 1,
      deltaX: 2,
      deltaY: 3,
      deltaZ: 4,
    })

    state = runOneFrame({
      state,
      timeNow: 0,
    })

    expect(state.mouse.wheel).toEqual({
      deltaMode: 1,
      deltaX: 2,
      deltaY: 3,
      deltaZ: 4,
    })

    state = runOneFrame({
      state,
      timeNow: 0,
    })

    // Next tick should reset wheel
    expect(state.mouse.wheel).toEqual(initialState.mouse.wheel)
  })
})
