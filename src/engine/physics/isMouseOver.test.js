// import { isMouseOver } from './isMouseOver'
// import { emptyGameObject } from '../gameObject/utils'
// import { initialState as mouseInitialState } from '../mouse/reducer'
// import { initialState as timeInitialState } from '../time/reducer'
// import { rigidbody } from '../rigidbody'
// import { vector } from './utils/vector'
test.skip('odpierdul się', () => {})
// describe('isMouseOver', () => {
//   const gameObjectWithMAE = {
//     ...emptyGameObject(),
//     rigidbody: rigidbody({
//       mouseActionsEnabled: true,
//     }),
//   }

//   const time = timeInitialState

//   describe('Rigidbody is point', () => {
//     describe('Should detect mouse', () => {
//       test('When mouse is over', () => {
//         const result = isMouseOver(gameObjectWithMAE, mouseInitialState, time)

//         expect(result).toBe(true)
//       })
//     })

//     describe('Shouldnt detect mouse', () => {
//       test('When mouse is not over', () => {
//         const result = isMouseOver(
//           gameObjectWithMAE,
//           {
//             ...mouseInitialState,
//             position: vector(1, 1),
//           },
//           time,
//         )

//         expect(result).toBe(false)
//       })
//     })
//   })

//   describe('Rigidbody bigger than point', () => {
//     describe('Should detect mouse', () => {
//       test('When mouse is over rigidbody', () => {
//         const result = isMouseOver(
//           {
//             ...gameObjectWithMAE,
//             rigidbody: {
//               ...gameObjectWithMAE.rigidbody,
//               size: vector(1, 1),
//             },
//           },
//           mouseInitialState,
//           time,
//         )

//         expect(result).toBe(true)
//       })

//       test('When mouse is over rigidbody', () => {
//         const result = isMouseOver(
//           {
//             ...gameObjectWithMAE,
//             rigidbody: {
//               ...gameObjectWithMAE.rigidbody,
//               size: vector(1, 1),
//             },
//           },
//           {
//             ...mouseInitialState,
//             position: vector(1, 1),
//           },
//           time,
//         )

//         expect(result).toBe(true)
//       })

//       test('When mouse is over rigidbody', () => {
//         const result = isMouseOver(
//           {
//             ...gameObjectWithMAE,
//             rigidbody: {
//               ...gameObjectWithMAE.rigidbody,
//               position: vector(0, 0),
//               size: vector(18, 31),
//             },
//           },
//           {
//             ...mouseInitialState,
//             position: vector(10, 10),
//           },
//           time,
//         )

//         expect(result).toBe(true)
//       })
//     })

//     describe('Shouldnt detect mouse', () => {
//       test('When mouse is not over rigidbody', () => {
//         const result = isMouseOver(
//           {
//             ...gameObjectWithMAE,
//             rigidbody: {
//               ...gameObjectWithMAE.rigidbody,
//               size: vector(1, 1),
//             },
//           },
//           {
//             ...mouseInitialState,
//             position: vector(-10, -10),
//           },
//           time,
//         )

//         expect(result).toBe(false)
//       })
//     })
//   })
// })
