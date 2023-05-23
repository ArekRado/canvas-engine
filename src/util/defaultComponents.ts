import {
  GetDefaultComponent,
  Mouse,
} from '../type'
import { Keyboard } from '../type'

export const defaultMouse: GetDefaultComponent<Mouse> = (data = {}) => ({
  buttons: 0,
  position: [0, 0],
  isButtonUp: false,
  isButtonDown: false,
  isMoving: false,
  lastClick: {
    timestamp: -1,
    buttons: 0,
  },
  wheel: {
    deltaMode: 0,
    deltaX: 0,
    deltaY: 0,
    deltaZ: 0,
  },
  ...data,
})

export const defaultKeyboard: GetDefaultComponent<Keyboard> = (data = {}) => ({
  keys: {},
  ...data,
})
