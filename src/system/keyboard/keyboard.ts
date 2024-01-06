import { createComponent } from '../../component/createComponent'
import { componentName } from '../../component/componentName'
import { createEntity } from '../../entity/createEntity'
import { emitEvent } from '../../event'
import {
  Keyboard,
  CanvasEngineEvent,
  KeyboardActionEvent,
  InitialState,
} from '../../type'
import { defaultKeyboard } from '../../util/defaultComponents'
import { createSystem, systemPriority } from '../createSystem'
import { updateComponent } from '../../component/updateComponent'

export const keyboardEntity = 'keyboard'

let shouldEmitEvent = false

let keyboard: Keyboard = {
  keys: {},
}

export const keyboardSystem = ({
  state,
  containerId,
  document,
}: {
  state: InitialState
  document: Document
  containerId: string
}) => {
  const container = document.getElementById(containerId)

  if (container) {
    document.addEventListener(
      'keydown',
      (e) => {
        shouldEmitEvent = true

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
        shouldEmitEvent = true

        keyboard.keys[e.key] = {
          isDown: false,
          isUp: true,
          isPressed: false,
        }
      },
      false,
    )
  }

  state = createEntity(state, keyboardEntity)

  state = createComponent(
    state,
    componentName.keyboard,
    keyboardEntity,
    defaultKeyboard(),
  )

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
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          acc[key] = {
            isDown: false,
            isUp: false,
            isPressed: value?.isPressed ?? false,
          }

          return acc
        }, {}),
      }

      state = updateComponent(
        state,
        componentName.keyboard,
        entity,
        () => keyboardBeforeReset,
      )

      if (shouldEmitEvent === true) {
        shouldEmitEvent = false

        emitEvent<KeyboardActionEvent>({
          type: CanvasEngineEvent.keyboardActionEvent,
          payload: keyboardBeforeReset,
        })
      }

      return state
    },
  })
}
