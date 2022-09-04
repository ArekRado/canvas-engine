/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { getInitialState, getSystems } from '../../util/state'
import { runOneFrame } from '../../util/runOneFrame'
import { vector, vectorZero } from '@arekrado/vector-2d'
import { getComponent } from '../../component/getComponent'
import { CanvasEngineEvent, Mouse } from '../../type'
import { mouseEntity } from './mouse'
import { componentName } from '../../component/componentName'
import { addEventHandler } from '../../event'

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
        getElementById: (() => ({
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
        })) as unknown as Document['getElementById'],
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
    const eventHandler = jest.fn(({ state }) => state)
    addEventHandler(eventHandler)

    let state = getInitialStateWithMouse()

    expect(
      getComponent<Mouse>({
        state,
        entity: mouseEntity,
        name: componentName.mouse,
      })?.buttons,
    ).toBe(0)

    mousedownCallback({ buttons: 1 })

    state = runOneFrame({ state })

    expect(
      getComponent<Mouse>({
        state,
        entity: mouseEntity,
        name: componentName.mouse,
      })?.buttons,
    ).toBe(1)

    state = runOneFrame({ state })

    // Next tick should reset buttons
    expect(
      getComponent<Mouse>({
        state,
        entity: mouseEntity,
        name: componentName.mouse,
      })?.buttons,
    ).toBe(0)

    expect(eventHandler.mock.calls[0][0].event.type).toEqual(
      CanvasEngineEvent.mouseActionEvent,
    )
    expect(eventHandler.mock.calls[0][0].event.payload.buttons).toEqual(1)
  })

  it('should set mouse position on mousemove event', () => {
    let state = getInitialStateWithMouse()

    expect(
      getComponent<Mouse>({
        state,
        entity: mouseEntity,
        name: componentName.mouse,
      })?.position,
    ).toEqual(vectorZero())

    mousemoveCallback({ pageX: 1, pageY: 1 })

    state = runOneFrame({ state })

    expect(
      getComponent<Mouse>({
        state,
        entity: mouseEntity,
        name: componentName.mouse,
      })?.position,
    ).toEqual(vector(1, 1))
  })

  it('wheel', () => {
    let state = getInitialStateWithMouse()
    const initialMouse = getComponent<Mouse>({
      state,
      entity: mouseEntity,
      name: componentName.mouse,
    })

    wheelCallback({
      deltaMode: 1,
      deltaX: 2,
      deltaY: 3,
      deltaZ: 4,
    })

    state = runOneFrame({ state })

    expect(
      getComponent<Mouse>({
        state,
        entity: mouseEntity,
        name: componentName.mouse,
      })?.wheel,
    ).toEqual({
      deltaMode: 1,
      deltaX: 2,
      deltaY: 3,
      deltaZ: 4,
    })

    state = runOneFrame({ state })

    // Next tick should reset wheel
    expect(
      getComponent<Mouse>({
        state,
        entity: mouseEntity,
        name: componentName.mouse,
      })?.wheel,
    ).toEqual(initialMouse?.wheel)
  })
})
