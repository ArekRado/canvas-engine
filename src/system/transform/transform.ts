import { add, Vector2D, vectorZero } from '@arekrado/vector-2d'
import { InternalInitialState, Transform, Vector3D } from '../../type'
import { createGlobalSystem, systemPriority } from '../createSystem'
import { setComponent } from '../../component/setComponent'
import { getComponent } from '../../component/getComponent'
import { componentName } from '../../component/componentName'
import { parseV3ToV2 } from '../../util/parseV3ToV2'
import { Scene } from '@babylonjs/core/scene'

const syncTransformWithBabylon = ({
  transform,
  scene,
}: {
  transform: Transform
  scene: Scene
}) => {
  const transformNode = scene.getTransformNodeByUniqueId(
    parseFloat(transform.entity),
  )
  if (transformNode) {
    transformNode.position.x = transform.position[0]
    transformNode.position.y = transform.position[1]
    transformNode.position.z = transform.position[2] ?? 0

    transformNode.rotation.x = transform.rotation[0]
    transformNode.rotation.y = transform.rotation[1]
    transformNode.rotation.z = transform.rotation[2] ?? 0

    transformNode.scaling.x = transform.scale[0]
    transformNode.scaling.y = transform.scale[1]
    transformNode.scaling.z = transform.scale[2] ?? 1
  }
}

const getParentPosition = (
  state: InternalInitialState,
  parentTransform: Transform,
): Vector2D | Vector3D => {
  if (parentTransform.parentId) {
    const parentParentTransform = getComponent<Transform>({
      name: componentName.transform,
      entity: parentTransform.parentId,
      state,
    })

    if (parentParentTransform) {
      const position = getParentPosition(state, parentParentTransform)
      const fromParentPosition = parentTransform.fromParentPosition
      return add(parseV3ToV2(position), parseV3ToV2(fromParentPosition))
    } else {
      return vectorZero()
    }
  } else {
    return parentTransform.position
  }
}

export const transformSystem = (state: InternalInitialState) =>
  createGlobalSystem({
    state,
    name: componentName.transform,
    priority: systemPriority.transform,
    tick: ({ state }) => {
      return Object.values(state.component.transform).reduce(
        (state, transform) => {
          if (transform.parentId) {
            const parentTransform = getComponent<Transform>({
              state,
              entity: transform.parentId,
              name: componentName.transform,
            })

            if (parentTransform) {
              const fromParentPosition = transform.fromParentPosition
              const parentPosition = getParentPosition(state, parentTransform)
              const newPosition = add(
                parseV3ToV2(fromParentPosition),
                parseV3ToV2(parentPosition),
              )

              return setComponent<Transform, InternalInitialState>({
                state,
                data: {
                  ...transform,
                  position: newPosition,
                },
              })
            }
          }

          if (state.babylonjs.sceneRef) {
            syncTransformWithBabylon({
              scene: state.babylonjs.sceneRef,
              transform: transform,
            })
          }

          return state
        },
        state,
      )
    },
  })
