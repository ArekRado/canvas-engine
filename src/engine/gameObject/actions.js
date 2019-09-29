// import {
//   MOVE,
//   CREATE,
//   SET_ROTATION,
//   SET_MOUSE_OVER,
//   SET_LOCAL_STATE,
//   GameObject,
// } from './reducer'
// import { Action, ActionNoParams } from 'utils/store'
// import { Vector2D } from './utils/vector'
// import { emptyGameObject } from './utils'

// type RotatePayload = { id: string; rotation: number }
// export const rotate: Action<RotatePayload, RotatePayload> = payload => ({
//   type: SET_ROTATION,
//   payload,
// })

// type MovePayload = { id: string; position: Vector2D }
// export const move: Action<MovePayload, MovePayload> = payload => ({
//   type: MOVE,
//   payload,
// })

// export const create: Action<GameObject, GameObject> = payload => ({
//   type: CREATE,
//   payload,
// })

// export const createEmpty: ActionNoParams<GameObject> = () => ({
//   type: CREATE,
//   payload: emptyGameObject(),
// })

// type SetMouseOverPayload = { id: string; isMouseOver: boolean }
// export const setMouseOver: Action<
//   SetMouseOverPayload,
//   SetMouseOverPayload
// > = payload => ({
//   type: SET_MOUSE_OVER,
//   payload,
// })

// export const setLocalState: Action<
//   { state: any; id: string },
//   { state: any; id: string }
// > = payload => ({
//   type: SET_LOCAL_STATE,
//   payload,
// })
