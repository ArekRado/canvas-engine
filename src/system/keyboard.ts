import { componentName, createSystem, setComponent } from '..'
import { createGetSetForUniqComponent } from '../component'
import { Keyboard, InternalInitialState } from '../type'
import { keyboard as keyboardDefaultComponent } from '../util/defaultComponents'
import { systemPriority } from './createSystem'

const keyboardEntity = 'keyboardEntity'

const keyboardGetSet = createGetSetForUniqComponent<Keyboard, InternalInitialState>({
  entity: keyboardEntity,
  name: componentName.keyboard,
})

export const getKeyboard = keyboardGetSet.getComponent
export const setKeyboard = keyboardGetSet.setComponent

let keyboard: Keyboard = {
  keys: {},
}

export const keyboardSystem = ({
  state,
  containerId,
  document,
}: {
  state: InternalInitialState
  document: Document
  containerId: string
}) => {
  const container = document.getElementById(containerId)
  
  if (container) {
    document.addEventListener(
      'keydown',
      (e) => {
        keyboard.keys[e.key] = {
          isDown: true,
          isUp: false,
          isPressed: true,
        }
      },
      false,
    )
    document.addEventListener(
      'keyup',
      (e) => {
        keyboard.keys[e.key] = {
          isDown: false,
          isUp: true,
          isPressed: false,
        }
      },
      false,
    )
  }

  state = setComponent<Keyboard, InternalInitialState>({
    state,
    data: keyboardDefaultComponent({
      entity: keyboardEntity,
    }),
  })

  return createSystem({
    name: componentName.keyboard,
    componentName: componentName.keyboard,
    state,
    priority: systemPriority.keyboard,
    tick: ({ state }) => {
      const keyboardBeforeReset = {
        keys: keyboard.keys,
      }

      keyboard = {
        keys: Object.entries(keyboard.keys).reduce((acc, [key, value]) => {
          acc[key] = {
            isDown: false,
            isUp: false,
            isPressed: value?.isPressed || false,
          }

          return acc
        }, {}),
      }

      state = setKeyboard({
        state,
        data: keyboardBeforeReset,
      })

      return state
    },
  })
}
