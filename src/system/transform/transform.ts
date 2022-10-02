import {
  AnyState,
  Dictionary,
  Entity,
  InternalInitialState,
  Transform,
  Vector3D,
} from '../../type'
import { createSystem, systemPriority } from '../createSystem'
import { componentName } from '../../component/componentName'
import { Scene } from '@babylonjs/core/scene'
import { getTransform, updateTransform } from './transformCrud'
import { updateMeshTransform } from '../mesh/mesh'

const syncTransformWithBabylon = ({
  entity,
  transform,
  scene,
}: {
  entity: Entity
  transform: Transform
  scene: Scene
}) => {
  const transformNode = scene.getTransformNodeByUniqueId(parseFloat(entity))
  if (transformNode) {
    transformNode.position.x = transform.position[0]
    transformNode.position.y = transform.position[1]
    transformNode.position.z = transform.position[2]

    transformNode.rotation.x = transform.rotation
    // transformNode.rotation.y = transform.rotation[1]
    // transformNode.rotation.z = transform.rotation[2] ?? 0

    transformNode.scaling.x = transform.scale[0]
    transformNode.scaling.y = transform.scale[1]
    transformNode.scaling.z = transform.scale[2] ?? 1
  }
}

const getParentPosition = (
  state: InternalInitialState,
  parentTransform: Transform,
): Vector3D => {
  if (parentTransform.parentId) {
    const parentParentTransform = getTransform({
      entity: parentTransform.parentId,
      state,
    })

    if (parentParentTransform) {
      const position = getParentPosition(state, parentParentTransform)
      const fromParentPosition = parentTransform.fromParentPosition
      return [
        position[0] + fromParentPosition[0],
        position[1] + fromParentPosition[1],
        position[2] + fromParentPosition[2],
      ]
    } else {
      return [0, 0, 0]
    }
  } else {
    return parentTransform.position
  }
}

const update = ({
  state,
  component,
  entity,
  previousComponent,
}: {
  state: AnyState
  component: Transform
  entity: Entity
  previousComponent?: Transform
}): AnyState => {
  if (previousComponent?.parentId !== component.parentId) {
    const transform: Dictionary<Transform> = state.component.transform

    if (previousComponent?.parentId !== undefined) {
      const children = transform[previousComponent?.parentId]._children
      transform[previousComponent?.parentId]._children = children.filter(
        (childrenEntity) => childrenEntity !== entity,
      )
    }

    if (component.parentId !== undefined) {
      transform[component.parentId]._children.push(entity)
    }
  }
  // const transforms = Object.entries(state.component.transform)
  // for (let i = 0; i < transforms.length; i++) {
  // const [entity, transform] = transforms[i]

  if (component.parentId) {
    const parentTransform = getTransform({
      state,
      entity: component.parentId,
    })

    if (parentTransform) {
      const fromParentPosition = component.fromParentPosition
      const parentPosition = getParentPosition(
        state as InternalInitialState,
        parentTransform,
      )
      const newPosition = [
        fromParentPosition[0] + parentPosition[0],
        fromParentPosition[1] + parentPosition[1],
        fromParentPosition[2] + parentPosition[2],
      ]

      state.component.transform[entity].position = newPosition
    }
  }

  if (component._children) {
    // const position = state.component.transform[entity].position;

    for (let i = 0; i < component._children.length; i++) {
      state = updateTransform({
        state,
        entity: component._children[i],
        update: () => ({}),
      })
    }
  }

  if (state.babylonjs.sceneRef) {
    syncTransformWithBabylon({
      scene: state.babylonjs.sceneRef,
      transform: component,
      entity,
    })

    if (state.component.mesh[entity] !== undefined) {
      const meshInstance = state.babylonjs.sceneRef?.getMeshByUniqueId(
        parseInt(entity),
      )

      if (meshInstance) {
        updateMeshTransform({
          transform: component,
          mesh: meshInstance,
        })
      }
    }
  }
  // }

  return state
}

export const transformSystem = (state: InternalInitialState) =>
  createSystem({
    state,
    name: componentName.transform,
    priority: systemPriority.transform,
    componentName: componentName.transform,
    create: update,
    update,
    remove: ({ state, entity, component }) => {
      if (component.parentId) {
        state = updateTransform({
          state,
          entity: component.parentId,
          update: ({ _children }) => ({
            _children: _children.filter(
              (childrenEntity) => childrenEntity !== entity,
            ),
          }),
        })
      }

      return state
    },
  })
