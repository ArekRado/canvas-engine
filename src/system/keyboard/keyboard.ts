import { componentName } from '../../component/componentName'
import { Keyboard, InternalInitialState } from '../../type'
import { defaultKeyboard } from '../../util/defaultComponents'
import { createSystem, systemPriority } from '../createSystem'
import { createKeyboard, updateKeyboard } from './keyboardCrud'

export const keyboardEntity = 'keyboard'

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

  state = createKeyboard({
    state,
    entity: keyboardEntity,
    data: defaultKeyboard(),
  })

  return createSystem({
    name: componentName.keyboard,
    componentName: componentName.keyboard,
    state,
    priority: systemPriority.keyboard,
    tick: ({ state, entity }) => {
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

      state = updateKeyboard({
        state,
        entity,
        update: () => keyboardBeforeReset,
      })

      return state
    },
  })
}
