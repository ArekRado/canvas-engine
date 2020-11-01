import { add, Vector2D } from '@arekrado/vector-2d'
import {
  CollideBox,
  CollideType,
  Transform,
  transform as transformComponent,
} from 'component'
import { State } from 'main'

type DetectAABBcollision = (params: {
  v1: Vector2D
  size1: Vector2D
  v2: Vector2D
  size2: Vector2D
}) => boolean
export const detectAABBcollision: DetectAABBcollision = ({
  v1: [x1, y1],
  size1: [size1x, size1y],
  v2: [x2, y2],
  size2: [size2x, size2y],
}) =>
  x1 < x2 + size2x && x1 + size1x > x2 && y1 < y2 + size2y && y1 + size1y > y2

type FindCollisionsWith = (pramams: {
  state: State
  collideBox: CollideBox
  transform: Transform
}) => CollideType[]
const findCollisionsWith: FindCollisionsWith = ({
  state,
  collideBox,
  transform,
}) => {
  const collisionList: CollideType[] = []

  Object.values(state.component.collideBox).forEach((collideBox2) => {
    const transform2 = transformComponent.get({
      state,
      entity: collideBox2.entity,
      name: '',
    })

    if (transform2 && transform.entity !== transform2.entity) {
      const isColliding = detectAABBcollision({
        v1: add(transform.data.position, collideBox.data.position),
        size1: collideBox.data.size,
        v2: add(transform2.data.position, collideBox2.data.position),
        size2: collideBox2.data.size,
      })

      isColliding &&
        collisionList.push({
          type: 'box',
          entity: collideBox2.entity,
        })
    }
  })

  return collisionList
}

type Update = (params: { state: State }) => State
export const update: Update = ({ state }) => {
  Object.values(state.component.collideBox).forEach((collideBox) => {
    const transform = transformComponent.get({
      state,
      entity: collideBox.entity,
      name: '',
    })

    if (transform) {
      collideBox.data.collisions = findCollisionsWith({
        state,
        collideBox,
        transform,
      })
    }
  })

  return state
}

// let update = (~state: Type.state): Type.state => {
//   ...state,
//   collideBox:
//     Belt.Map.String.mapWithKey(
//       state.collideBox,
//       (id1, collideBox1) => {
//         let transform =
//           Belt.Map.String.get(state.transform, collideBox1.entity);

//         switch (transform) {
//         | None => collideBox1
//         | Some(transform) =>
//           let collisionList =

//             Belt.Map.String.reduce(
//               state.collideBox,
//               [],
//               (acc, id2, collideBox2) => {
//                 let transform2 =
//                   Belt.Map.String.get(state.transform, collideBox2.entity);

//                 switch (transform2, id2 === id1) {
//                 | (None, _) => acc
//                 | (_, true) => acc
//                 | (Some(transform2), _) =>
//                   let isColliding =
//                     detectAABBcollision(
//                       Vector_Util.add(
//                         transform.position,
//                         collideBox1.position,
//                       ),
//                       collideBox1.size,
//                       Vector_Util.add(
//                         transform2.position,
//                         collideBox2.position,
//                       ),
//                       collideBox2.size,
//                     );

//                   if (isColliding) {
//                     [Type.Box(id2), ...acc];
//                   } else {
//                     acc;
//                   };
//                 };
//               },
//             );

//           {...collideBox1, collisions: collisionList};
//         };
//       },
//     ),
// };
