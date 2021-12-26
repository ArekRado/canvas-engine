import 'regenerator-runtime/runtime'
import { getInitialState, getSystems } from '../util/state'
import { runOneFrame } from '../util/runOneFrame'
import { getKeyboard, keyboardSystem } from '../system/keyboard'

describe('keyboard', () => {
  let keyupCallback: Function
  let keydownCallback: Function

  const getInitialStateWithKeyboard = () =>
    getSystems({
      state: getInitialState(),
      containerId: 'containerId',
      document: {
        getElementById: ((() => ({
          getBoundingClientRect: (() => ({
            left: 0,
            top: 0,
          })) as Element['getBoundingClientRect'],
          addEventListener: (() => {}) as Document['addEventListener'],
        })) as any) as Document['getElementById'],
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
    const key1 = 'a'
    const key2 = 'b'

    let state = getInitialStateWithKeyboard()

    expect(getKeyboard({ state })?.keys[key1]).toBeUndefined()

    keydownCallback({ key: key1 })

    state = runOneFrame({ state })

    expect(getKeyboard({ state })?.keys[key1]).toEqual({
      isDown: true,
      isUp: false,
      isPressed: true,
    })

    keydownCallback({ key: key2 })

    state = runOneFrame({ state })

    // runOneFrame should reset isDown
    expect(getKeyboard({ state })?.keys[key1]).toEqual({
      isDown: false,
      isUp: false,
      isPressed: true,
    })
    expect(getKeyboard({ state })?.keys[key2]).toEqual({
      isDown: true,
      isUp: false,
      isPressed: true,
    })

    keyupCallback({ key: key1 })

    state = runOneFrame({ state })

    expect(getKeyboard({ state })?.keys[key1]).toEqual({
      isDown: false,
      isUp: true,
      isPressed: false,
    })
  })
})
