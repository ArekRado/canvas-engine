import { InternalInitialState, Mesh } from '../../type'
import { createSystem } from '../createSystem'
import { componentName } from '../../component/componentName'
import { getMaterial } from '../material/materialCrud'
import { getTransform } from '../transform/transformCrud'

export const meshSystem = (state: InternalInitialState) =>
  createSystem<Mesh, InternalInitialState>({
    state,
    name: componentName.mesh,
    componentName: componentName.mesh,
    create: ({ state, component, entity }) => {
      const { MeshBuilder, sceneRef, Vector3, Color3 } = state.babylonjs
      if (!(MeshBuilder && sceneRef && Vector3 && Color3)) return state

      let mesh

      switch (component.data.type) {
        case 'plane':
          mesh = MeshBuilder.CreatePlane('plane', {
            width: component.data.width,
            height: component.data.height,
            updatable: component.data.updatable,
            sideOrientation: component.data.sideOrientation,
          })
          break
        case 'lines':
          mesh = MeshBuilder.CreateLines('lines', {
            points: component.data.points.reduce((acc, point) => {
              acc.push(new Vector3(point[0], point[1], 0))

              return acc
            }, [] as any[] /** XD */),
            colors: component.data.colors.reduce((acc, color) => {
              acc.push(new Color3(color[0], color[1], color[2]))

              return acc
            }, [] as any[] /** XD */),
          })

          break
      }

      mesh.uniqueId = component.uniqueId

      const materialComponent = getMaterial({
        state,
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
            `Mesh has been created without material component. Mesh entity: ${entity}`,
          )
        }
      }

      const transform = getTransform({
        state,
        entity,
      })

      if (transform) {
        mesh.position.x = transform.position[0]
        mesh.position.y = transform.position[1]
        mesh.position.z = transform.position[2] ?? 0

        mesh.rotation.x = transform.rotation
        mesh.rotation.y = 0
        mesh.rotation.z = 0

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
    tick: ({ state, component, entity }) => {
      const mesh = state.babylonjs.sceneRef?.getMeshByUniqueId(
        component.uniqueId,
      )
      const transform = getTransform({
        state,
        entity,
      })

      if (mesh && transform) {
        mesh.position.x = transform.position[0]
        mesh.position.y = transform.position[1]
        mesh.position.z = transform.position[2] ?? 0

        mesh.rotation.x = transform.rotation
        mesh.rotation.y = 0
        mesh.rotation.z = 0

        mesh.scaling.x = transform.scale[0]
        mesh.scaling.y = transform.scale[1]
        mesh.scaling.z = transform.scale[2] ?? 1
      }

      return state
    },
  })
