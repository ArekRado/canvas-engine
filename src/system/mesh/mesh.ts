import { InternalInitialState, Transform, Mesh, AnyState } from '../../type'
import { createSystem } from '../createSystem'
import { componentName } from '../../component/componentName'
import { getMaterial } from '../material/materialCrud'
import { getTransform } from '../transform/transformCrud'
import { AbstractMesh, LinesMesh, Mesh as BabylonMesh } from '@babylonjs/core'

export const updateMeshTransform = ({
  mesh,
  transform,
}: {
  mesh: BabylonMesh | AbstractMesh
  transform: Transform
}) => {
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

const createOrUpdateMesh = ({
  mesh,
  meshInstance,
  state,
}: {
  mesh: Mesh
  meshInstance: BabylonMesh | AbstractMesh | undefined
  state: AnyState
}): BabylonMesh | LinesMesh | undefined => {
  const { MeshBuilder, sceneRef, Vector3, Color4 } = state.babylonjs
  if (!(MeshBuilder && sceneRef && Vector3 && Color4)) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('To use Mesh engine requires all properties to be defined', {
        MeshBuilder,
        sceneRef,
        Vector3,
        Color4,
      })
    }

    return undefined
  }

  let newMesh

  switch (mesh.data.type) {
    case 'plane':
      // lol no updates XD
      if (meshInstance) return undefined

      newMesh = MeshBuilder.CreatePlane('plane', {
        width: mesh.data.width,
        height: mesh.data.height,
        updatable: mesh.updatable,
        sideOrientation: mesh.data.sideOrientation,
      })
      break
    case 'lines':
      newMesh = MeshBuilder.CreateLines('lines', {
        instance: meshInstance as LinesMesh,
        updatable: mesh.updatable,
        points: mesh.data.points.reduce((acc, point) => {
          acc.push(new Vector3(point[0], point[1], 0))
          return acc
        }, [] as any[] /** XD */),
        colors: mesh.data.colors.reduce((acc, color) => {
          acc.push(new Color4(color[0], color[1], color[2], color[3]))
          return acc
        }, [] as any[] /** XD */),
      })

      break
  }

  return newMesh
}

export const meshSystem = (state: InternalInitialState) =>
  createSystem<Mesh, InternalInitialState>({
    state,
    name: componentName.mesh,
    componentName: componentName.mesh,
    create: ({ state, component, entity }) => {
      const { MeshBuilder, sceneRef, Vector3, Color4 } = state.babylonjs
      if (!(MeshBuilder && sceneRef && Vector3 && Color4)) return state

      const mesh = createOrUpdateMesh({
        mesh: component,
        meshInstance: undefined,
        state,
      })

      if (!mesh) {
        return state
      }

      mesh.uniqueId = parseInt(entity)

      const materialComponent = getMaterial({
        state,
        entity: component.materialEntity[0],
      })

      if (materialComponent) {
        const material = sceneRef.getMaterialByUniqueID(
          materialComponent?.uniqueId,
        )

        mesh.material = material
      } else if (component.data.type !== 'lines') {
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
        updateMeshTransform({
          mesh,
          transform,
        })
      }

      return state
    },
    remove: ({ state, entity }) => {
      const sceneRef = state.babylonjs.sceneRef
      if (sceneRef) {
        const mesh = sceneRef.getMeshByUniqueId(parseInt(entity))
        mesh?.dispose()
      }

      return state
    },
    update: ({ state, entity, component }) => {
      const meshInstance = state.babylonjs.sceneRef?.getMeshByUniqueId(
        parseInt(entity),
      )

      if (meshInstance) {
        createOrUpdateMesh({
          mesh: component,
          meshInstance,
          state,
        })

        const transform = getTransform({ state, entity })
        if (transform) {
          updateMeshTransform({
            mesh: meshInstance,
            transform,
          })
        }
      }

      return state
    },
    // tick: ({ state, entity }) => {
    //   const mesh = state.babylonjs.sceneRef?.getMeshByUniqueId(parseInt(entity))
    //   const transform = getTransform({
    //     state,
    //     entity,
    //   })

    //   if (mesh && transform) {
    //     updateMeshTransform({
    //       mesh,
    //       transform,
    //     })
    //   }

    //   return state
    // },
  })
