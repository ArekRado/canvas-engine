/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-types */
import { getInitialState, getSystems } from '../../util/state'
import { runOneFrame } from '../../util/runOneFrame'
import { getComponent } from '../../component/getComponent'
import { componentName } from '../../component/componentName'
import { CanvasEngineEvent, Keyboard } from '../../type'
import { keyboardEntity } from './keyboard'
import { addEventHandler } from '../../event'

describe('keyboard', () => {
  let keyupCallback: Function
  let keydownCallback: Function

  const getInitialStateWithKeyboard = () =>
    getSystems({
      state: getInitialState(),
      containerId: 'containerId',
      document: {
        getElementById: (() => ({
          getBoundingClientRect: (() => ({
            left: 0,
            top: 0,
          })) as Element['getBoundingClientRect'],
          addEventListener: (() => {}) as Document['addEventListener'],
        })) as unknown as Document['getElementById'],
        addEventListener: ((
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
        }) as Document['addEventListener'],
      } as Document,
    })

  beforeEach(() => {
    keyupCallback = () => {}
    keydownCallback = () => {}
  })

  it('should set keyboard isUp and isDown flags', () => {
    const eventHandler = jest.fn(({ state }) => state)
    addEventHandler(eventHandler)

    const key1 = 'a'
    const key2 = 'b'

    let state = getInitialStateWithKeyboard()

    expect(
      getComponent<Keyboard>({
        entity: keyboardEntity,
        name: componentName.keyboard,
        state,
      })?.keys[key1],
    ).toBeUndefined()

    keydownCallback({ key: key1 })

    state = runOneFrame({ state })

    expect(
      getComponent<Keyboard>({
        entity: keyboardEntity,
        name: componentName.keyboard,
        state,
      })?.keys[key1],
    ).toEqual({
      isDown: true,
      isUp: false,
      isPressed: true,
    })

    keydownCallback({ key: key2 })

    state = runOneFrame({ state })

    // runOneFrame should reset isDown
    expect(
      getComponent<Keyboard>({
        entity: keyboardEntity,
        name: componentName.keyboard,
        state,
      })?.keys[key1],
    ).toEqual({
      isDown: false,
      isUp: false,
      isPressed: true,
    })
    expect(
      getComponent<Keyboard>({
        entity: keyboardEntity,
        name: componentName.keyboard,
        state,
      })?.keys[key2],
    ).toEqual({
      isDown: true,
      isUp: false,
      isPressed: true,
    })

    keyupCallback({ key: key1 })

    state = runOneFrame({ state })

    expect(
      getComponent<Keyboard>({
        entity: keyboardEntity,
        name: componentName.keyboard,
        state,
      })?.keys[key1],
    ).toEqual({
      isDown: false,
      isUp: true,
      isPressed: false,
    })

    expect(eventHandler.mock.calls[0][0].event.type).toEqual(
      CanvasEngineEvent.keyboardActionEvent,
    )
    expect(eventHandler.mock.calls[0][0].event.payload.keys[key1]).toEqual({
      isDown: true,
      isPressed: true,
      isUp: false,
    })
  })
})
