import { vectorZero } from '../utils/vector'
import { createStore } from './store'
import { circleAndPoint } from './collision/circleAndPoint'

const colliders = ['point', 'rectangle', 'circle']

export const createRigidbody = (params = {}) => {
  const state = {
    isStatic: params.isStatic || true,
    mass: params.mass || 1,
    velocity: params.velocity || vectorZero(),
    position: params.position || vectorZero(),
    layer: params.layer || 0,
    collisions: params.collisions || [],
    mouseActionsEnabled: params.mouseActionsEnabled || false,
    isMouseOver: false,
    isClicked: false,
    isSelected: false,
    size: params.size || vectorZero(),
    rotation: params.rotation || 0,
    collider:
      colliders.indexOf(params.collider) !== -1 ? params.collider : 'circle',
    onClick: params.onClick || (() => {}),
    onDeselect: params.onDeselect || (() => {}),
  }

  const reducer = (rigidbody, action) => {
    switch (action.type) {
      case 'setRotation':
        return {
          ...rigidbody,
          rotation: action.payload,
        }

      case 'setPosition':
        return {
          ...rigidbody,
          position: action.payload,
        }

      case 'setIsClicked':
        return {
          ...rigidbody,
          isClicked: action.payload,
        }

      case 'setIsSelected':
        return {
          ...rigidbody,
          isSelected: action.payload,
        }

      default:
        return rigidbody
    }
  }

  const actions = {
    setRotation: dispatch => rotation =>
      dispatch({
        type: 'setRotation',
        payload: rotation,
      }),

    setPosition: dispatch => position =>
      dispatch({
        type: 'setPosition',
        payload: position,
      }),

    setIsMouseOver: dispatch => isMouseOver =>
      dispatch({
        type: 'setIsMouseOver',
        payload: isMouseOver,
      }),

    setIsClicked: dispatch => isClicked =>
      dispatch({
        type: 'setIsClicked',
        payload: isClicked,
      }),

    setIsSelected: dispatch => isClicked =>
      dispatch({
        type: 'setIsSelected',
        payload: isClicked,
      }),
  }

  const store = createStore(reducer, state, actions)

  const tick = (go, app) => {
    const rigidbody = go.rigidbody
    if (rigidbody.isClicked) {
      rigidbody.setIsClicked(false)
    }

    if (rigidbody.mouseActionsEnabled) {
      const mouse = app.gameObjects.mouse
      if (circleAndPoint(rigidbody.position, 50, mouse.position)) {
        if (!rigidbody.isMouseOver) {
          rigidbody.setIsMouseOver(true)
        }

        if (mouse.clicked) {
          if (go.isSelected) {
            rigidbody.setIsClicked(true)
            rigidbody.setIsSelected(false)
            rigidbody.onClick(go, app)
          } else {
            rigidbody.setIsClicked(true)
            rigidbody.setIsSelected(true)
            rigidbody.onClick(go, app)
          }
        }
      } else if (rigidbody.isMouseOver) {
        rigidbody.setIsMouseOver(false)

        if (mouse.clicked) {
          rigidbody.setIsSelected(false)
          rigidbody.onDeselect(go, app)
        }
      }
    }
  }

  return {
    ...state,
    ...actions,
    store,
    tick,
  }
}
