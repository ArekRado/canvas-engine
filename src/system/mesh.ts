import { InternalInitialState, Material, Mesh, Transform } from '../type'
import { createSystem } from './createSystem'
import { getComponent } from '../component/getComponent'
import { componentName } from '../component/componentName'

export const meshSystem = (state: InternalInitialState) =>
  createSystem<Mesh, InternalInitialState>({
    state,
    name: componentName.mesh,
    componentName: componentName.mesh,
    create: ({ state, component }) => {
      const { MeshBuilder, sceneRef } = state.babylonjs
      if (!(MeshBuilder && sceneRef)) return state

      const mesh = MeshBuilder.CreatePlane(component.type, {
        width: component.width,
        height: component.height,
        updatable: component.updatable,
        sideOrientation: component.sideOrientation,
      })
      mesh.uniqueId = component.uniqueId

      const materialComponent = getComponent<Material, any>({
        state,
        name: componentName.material,
        entity: component.materialEntity[0],
      })

      if (materialComponent) {
        const material = sceneRef.getMaterialByUniqueID(
          materialComponent?.uniqueId,
        )

        mesh.material = material
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.warn(
            `Mesh has been created without material component. Mesh entity: ${component.entity}`,
          )
        }
      }

      const transform = getComponent<Transform>({
        state,
        name: componentName.transform,
        entity: component.entity,
      })

      if (transform) {
        mesh.position.x = transform.position[0]
        mesh.position.y = transform.position[1]
        mesh.position.z = transform.position[2] ?? 0

        mesh.rotation.x = transform.rotation[0]
        mesh.rotation.y = transform.rotation[1]
        mesh.rotation.z = transform.rotation[2] ?? 0

        mesh.scaling.x = transform.scale[0]
        mesh.scaling.y = transform.scale[1]
        mesh.scaling.z = transform.scale[2] ?? 1
      }

      return state
    },
    remove: ({ state, component }) => {
      const sceneRef = state.babylonjs.sceneRef
      if (sceneRef) {
        const mesh = sceneRef.getMeshByUniqueId(component.uniqueId)
        mesh?.dispose()
      }

      return state
    },
    tick: ({ state, component }) => {
      const mesh = state.babylonjs.sceneRef?.getMeshByUniqueId(
        component.uniqueId,
      )
      const transform = getComponent<Transform>({
        state,
        name: componentName.transform,
        entity: component.entity,
      })

      if (mesh && transform) {
        mesh.position.x = transform.position[0]
        mesh.position.y = transform.position[1]
        mesh.position.z = transform.position[2] ?? 0

        mesh.rotation.x = transform.rotation[0]
        mesh.rotation.y = transform.rotation[1]
        mesh.rotation.z = transform.rotation[2] ?? 0

        mesh.scaling.x = transform.scale[0]
        mesh.scaling.y = transform.scale[1]
        mesh.scaling.z = transform.scale[2] ?? 1
      }

      return state
    },
  })
