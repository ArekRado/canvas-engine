import { getInitialState, getSystems } from '../util/state'
import { runOneFrame } from '../util/runOneFrame'
import { getMouse } from '../system/mouse/mouse'
import { vector, vectorZero } from '@arekrado/vector-2d'

describe('mouse', () => {
  let mousemoveCallback: Function
  let mouseenterCallback: Function
  let mouseleaveCallback: Function
  let mouseupCallback: Function
  let mousedownCallback: Function
  let wheelCallback: Function

  const getInitialStateWithMouse = () =>
    getSystems({
      state: getInitialState(),
      containerId: 'containerId',
      document: {
        getElementById: ((() => ({
          getBoundingClientRect: (() => ({
            left: 0,
            top: 0,
          })) as Element['getBoundingClientRect'],
          addEventListener: ((
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
          }) as Document['addEventListener'],
        })) as any) as Document['getElementById'],
        addEventListener: (() => {}) as Document['addEventListener'],
      } as Document,
    })

  beforeEach(() => {
    mousemoveCallback = () => {}
    mouseenterCallback = () => {}
    mouseleaveCallback = () => {}
    mouseupCallback = () => {}
    mousedownCallback = () => {}
    wheelCallback = () => {}
  })

  it('should set buttons on mousedown event', () => {
    let state = getInitialStateWithMouse()

    expect(getMouse({ state })?.buttons).toBe(0)

    mousedownCallback({ buttons: 1 })

    state = runOneFrame({ state })

    expect(getMouse({ state })?.buttons).toBe(1)

    state = runOneFrame({ state })

    // Next tick should reset buttons
    expect(getMouse({ state })?.buttons).toBe(0)
  })

  it('should set mouse position on mousemove event', () => {
    let state = getInitialStateWithMouse()

    expect(getMouse({ state })?.position).toEqual(vectorZero())

    mousemoveCallback({ pageX: 1, pageY: 1 })

    state = runOneFrame({ state })

    expect(getMouse({ state })?.position).toEqual(vector(1, 1))
  })

  it('wheel', () => {
    let state = getInitialStateWithMouse()
    const initialMouse = getMouse({ state })

    wheelCallback({
      deltaMode: 1,
      deltaX: 2,
      deltaY: 3,
      deltaZ: 4,
    })

    state = runOneFrame({ state })

    expect(getMouse({ state })?.wheel).toEqual({
      deltaMode: 1,
      deltaX: 2,
      deltaY: 3,
      deltaZ: 4,
    })

    state = runOneFrame({ state })

    // Next tick should reset wheel
    expect(getMouse({ state })?.wheel).toEqual(initialMouse?.wheel)
  })
})
