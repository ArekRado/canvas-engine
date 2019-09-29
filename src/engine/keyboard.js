import { createGameObject } from './gameObject'

export const KEY_UP = 'keyboard.KEY_UP'
export const KEY_DOWN = 'keyboard.KEY_DOWN'

export const keyboard = () =>
  createGameObject({
    id: 'keyboard',
    state: {
      keys: {},
    },
    tick: gameObject => {
      document.addEventListener(
        'keydown',
        payload => {
          gameObject.keyDown(payload)
        },
        false,
      )

      document.addEventListener(
        'keyup',
        payload => {
          gameObject.keyUp(payload)
        },
        false,
      )
    },
    actions: {
      keyDown: dispatch => payload => dispatch({ type: KEY_DOWN, payload }),
      keyUp: dispatch => payload => dispatch({ type: KEY_UP, payload }),
    },
    reducer: (state, action) => {
      switch (action.type) {
        case KEY_UP:
          return {
            ...state,
            keys: {
              ...state.keys,
              [action.payload.keyCode]: {
                ...action.payload,
                isPressed: true,
              },
            },
          }

        case KEY_DOWN:
          return {
            ...state,
            keys: {
              ...state.keys,
              [action.payload.keyCode]: {
                ...action.payload,
                isPressed: false,
              },
            },
          }

        default:
          return state
      }
    },
  })
