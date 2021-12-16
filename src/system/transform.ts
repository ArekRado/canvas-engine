import { add, Vector2D, vectorZero } from '@arekrado/vector-2d'
import { State, Transform } from '../type'
import { createGlobalSystem, systemPriority } from '../system/createSystem'
import { componentName, getComponent, setComponent } from '../component'
// import { scene } from '..'

const syncTransformWithBabylon = ({ transform }: { transform: Transform }) => {
  // const transformNode = scene.getTransformNodeByUniqueId(
  //   parseFloat(transform.entity),
  // )

  // if (transformNode) {
  //   transformNode.position.x = transform.position[0]
  //   transformNode.position.y = transform.position[1]

  //   transformNode.rotation.x = transform.rotation[0]
  //   transformNode.rotation.y = transform.rotation[1]
  //   transformNode.rotation.z = transform.rotation[2]
  // }
}

const getParentPosition = (
  state: State,
  parentTransform: Transform,
): Vector2D => {
  if (parentTransform.parentId) {
    const parentParentTransform = getComponent<Transform>({
      name: componentName.transform,
      entity: parentTransform.parentId,
      state,
    })

    if (parentParentTransform) {
      return add(
        getParentPosition(state, parentParentTransform),
        parentTransform.fromParentPosition,
      )
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
              const newPosition = add(
                transform.fromParentPosition,
                getParentPosition(state, parentTransform),
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

          syncTransformWithBabylon({
            transform: transform,
          })

          return state
        },
        params.state,
      )
    },
  })
