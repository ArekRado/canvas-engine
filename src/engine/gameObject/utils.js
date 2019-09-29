// import { GameObject } from './reducer'
// import { vectorZero } from './utils/vector'
// import { rigidbody as emptyRigidbody } from '../rigidbody'
// import { getGameObjectById } from './selectors'
// import { setLocalState } from './actions'
// import { Store, Reducer, AnyAction } from 'redux'

// export const emptyGameObject = (): GameObject => ({
//   tags: [],
//   image: {
//     url: '',
//     position: vectorZero(),
//     size: vectorZero(),
//     rotation: 0,
//     zIndex: 0,
//     stickToRigidbody: true,
//   },
//   id: `${Math.random()}`,
//   rigidbody: emptyRigidbody(),
//   state: null,
// })

export const isArrayContainsArray = (a, b) => b.every(bE => a.includes(bE))

// export const createLocalState = (store: Store) => <LocalState>(
//   reducer: Reducer<LocalState>,
// ) => (id: string, action: AnyAction) => {
//   const gameObject = getGameObjectById(store.getstate.engine, id)
//   if (gameObject) {
//     store.dispatch(
//       setLocalState({
//         state: reducer(gameObject.state as LocalState, action),
//         id,
//       }),
//     )
//   }
// }
