import { add, Vector2D, vectorZero } from '@arekrado/vector-2d'
import { State, Transform, Vector3D } from '../type'
import { createGlobalSystem, systemPriority } from '../system/createSystem'
import { componentName, getComponent, setComponent } from '../component'
import { parseV3ToV2 } from '../util/parseV3ToV2'
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

    transformNode.rotation.x = transform.rotation[0]
    transformNode.rotation.y = transform.rotation[1]

    if (transform.rotation[2]) {
      transformNode.rotation.z = transform.rotation[2]
    }
  }
}

const getParentPosition = (
  state: State,
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

export const transformSystem = (state: State) =>
  createGlobalSystem<Transform>({
    state,
    name: componentName.transform,
    priority: systemPriority.transform,
    tick: (params) => {
      return Object.values(params.state.component.transform).reduce(
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

              return setComponent<Transform>({
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
        params.state,
      )
    },
  })
