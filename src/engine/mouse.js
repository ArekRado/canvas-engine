import { vector, vectorZero } from '../utils/vector'
import { createGameObject } from './gameObject'

export const MOUSE_MOVE = 'mouse.MOUSE_MOVE'
// export const MOUSE_UP = 'mouse.MOUSE_UP'
// export const MOUSE_DOWN = 'mouse.MOUSE_DOWN'
export const MOUSE_CLICK = 'mouse.MOUSE_CLICK'
export const MOUSE_UNCLICK = 'mouse.MOUSE_UNCLICK'

export const mouse = () =>
  createGameObject({
    id: 'mouse',
    state: {
      position: vectorZero(),
      button: 0,
      clicked: false,
    },
    afterCreate: go => {
      document.addEventListener(
        'mousemove',
        e => {
          go().mouseMove(vector(e.x, e.y))
        },
        false,
      )

      // document.addEventListener(
      //   'mousedown',
      //   e => {
      //     go().mouseDown(e.buttons)
      //   },
      //   false,
      // )

      // document.addEventListener(
      //   'mouseup',
      //   e => {
      //     go().mouseUp(e.buttons)
      //   },
      //   false,
      // )

      document.addEventListener(
        'click',
        e => {
          go().mouseClick(e.buttons)
        },
        false,
      )
    },
    tick: go => {
      if (go.clicked) {
        go.mouseUnclick(0)
      }
    },
    actions: {
      mouseMove: dispatch => payload => {
        dispatch({ type: MOUSE_MOVE, payload })
      },
      // mouseDown: dispatch => payload => {
      //   dispatch({ type: MOUSE_DOWN, payload })
      // },
      // mouseUp: dispatch => payload => {
      //   dispatch({ type: MOUSE_UP, payload })
      // },
      mouseClick: dispatch => payload => {
        dispatch({ type: MOUSE_CLICK, payload })
      },
      mouseUnclick: dispatch => () => {
        dispatch({ type: MOUSE_UNCLICK })
      },
    },
    reducer: (state, action) => {
      switch (action.type) {
        case MOUSE_MOVE:
          return {
            ...state,
            position: action.payload,
          }

        // case MOUSE_UP:
        // case MOUSE_DOWN:
        //   return {
        //     ...state,
        //     button: action.payload,
        //     prevButton: state.button,
        //   }

        case MOUSE_CLICK:
          return {
            ...state,
            clicked: true,
            button: action.payload,
          }

        case MOUSE_UNCLICK:
          return {
            ...state,
            clicked: false,
            button: 0,
          }

        default:
          return state
      }
    },
  })
