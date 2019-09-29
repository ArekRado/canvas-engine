// import { Vector2D } from './utils/vector'
// import { Rigidbody } from '../rigidbody'

// export const CREATE = 'gameObject.CREATE'
// export const SET_ROTATION = 'gameObject.SET_ROTATION'
// export const MOVE = 'gameObject.MOVE'
// export const SET_MOUSE_OVER = 'gameObject.SET_MOUSE_OVER'
// export const SET_LOCAL_STATE = 'gameObject.SET_LOCAL_STATE'

// export type GameObject<State> = {
//   id: string
//   rigidbody: Rigidbody
//   tags: string[]
//   image: {
//     position: Vector2D
//     size: Vector2D
//     url: string
//     zIndex: number
//     rotation: number
//     stickToRigidbody: boolean
//   }
//   state: State
// }

// export const initialState: GameObject[] = []

// export const reducer: Reducer<GameObject[]> = (
//   state = initialState,
//   action,
// ) => {
//   switch (action.type) {
//     case SET_ROTATION:
//       return state.map(gameObject =>
//         gameObject.id === action.payload.id
//           ? {
//               ...gameObject,
//               rigidbody: {
//                 ...gameObject.rigidbody,
//                 rotation: action.payload.rotation + 0.3,
//               },
//             }
//           : gameObject,
//       )

//     case MOVE:
//       return state.map(gameObject =>
//         gameObject.id === action.payload.id
//           ? {
//               ...gameObject,
//               rigidbody: {
//                 ...gameObject.rigidbody,
//                 position: action.payload.position,
//               },
//             }
//           : gameObject,
//       )

//     case SET_MOUSE_OVER:
//       return state.map(gameObject =>
//         gameObject.id === action.payload.id
//           ? {
//               ...gameObject,
//               rigidbody: {
//                 ...gameObject.rigidbody,
//                 isMouseOver: action.payload.isMouseOver,
//               },
//             }
//           : gameObject,
//       )

//     case SET_LOCAL_STATE:
//       return state.map(gameObject =>
//         gameObject.id === action.payload.id
//           ? {
//               ...gameObject,
//               state: action.payload.state,
//             }
//           : gameObject,
//       )
//     case CREATE:
//       return [...state, action.payload]
//     default:
//       return state
//   }
// }
