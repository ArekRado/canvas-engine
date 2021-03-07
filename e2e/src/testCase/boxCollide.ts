import {
  setComponent,
  initialState,
  setEntity,
  generateEntity,
  State,
  defaultData,
  CollideBox,
  componentName,
  Camera,
} from '@arekrado/canvas-engine'
import { vector } from '@arekrado/vector-2d'

export const boxCollide = (): State => {
  const entity1 = generateEntity('e1', {
    position: vector(0, 0),
  })
  const entityCamera = generateEntity('camera', {
    position: vector(0, 0),
  })
  // const entity2 = generateEntity('e2', {
  //   fromParentPosition: vector(1, 1),
  // })
  // const entity3 = generateEntity('e3', {
  //   fromParentPosition: vector(3.5, 3.5),
  // })

  let state = setEntity({
    entity: entity1,
    state: initialState,
  })
  // state = setEntity({ entity: entity2, state })
  // state = setEntity({ entity: entity3, state })

  state = setComponent<Camera>(componentName.camera, {
    state,
    data: defaultData.camera({
      entityId: entityCamera.id,
      position: vector(50, 50),
    }),
  })

  state = setComponent<CollideBox>(componentName.collideBox, {
    state,
    data: defaultData.collideBox({
      entityId: entity1.id,
      size: vector(80, 80),
      position: vector(0, 0),
    }),
  })

  // state = setComponent<CollideBox>(componentName.collideBox, {
  //   state,
  //   data: defaultData.collideBox({
  //     entityId: entity2.id,
  //     size: vector(1, 1),
  //     position: vector(0, 0),
  //   }),
  // })

  // state = setComponent<CollideBox>(componentName.collideBox, {
  //   state,
  //   data: defaultData.collideBox({
  //     entityId: entity3.id,
  //     size: vector(1, 1),
  //     position: vector(-1, -1),
  //   }),
  // })

  return state
}
